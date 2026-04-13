import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const invitationSchema = z
  .object({
    eventSlug: z.string().trim().min(1, "Evento inválido."),
    name: z.string().trim().min(3, "Informe seu nome completo."),
    phone: z.string().trim().min(10, "Informe um telefone válido."),
    company: z.string().trim().min(2, "Informe a empresa."),
    hasCompanion: z.boolean(),
    companionName: z.string().trim().optional().or(z.literal("")),
    deviceToken: z.string().trim().min(10, "Dispositivo inválido."),
  })
  .superRefine((data, ctx) => {
    if (data.hasCompanion && !data.companionName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o nome do acompanhante.",
        path: ["companionName"],
      });
    }
  });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = invitationSchema.parse(json);

    const event = await prisma.invitationEvent.findFirst({
      where: {
        slug: data.eventSlug,
        isActive: true,
        eventDate: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado ou inativo." },
        { status: 404 },
      );
    }

    const existing = await prisma.invitationSubmission.findFirst({
      where: {
        eventId: event.id,
        deviceToken: data.deviceToken,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Presença confirmada!!!",
          alreadyConfirmed: true,
        },
        { status: 409 },
      );
    }

    await prisma.invitationSubmission.create({
      data: {
        eventId: event.id,
        name: data.name,
        phone: data.phone,
        company: data.company,
        companionName: data.hasCompanion ? data.companionName?.trim() || null : null,
        deviceToken: data.deviceToken,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sua confirmação foi enviada com sucesso.",
    });
  } catch (error: unknown) {
    console.error("Erro ao salvar convite:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Dados inválidos." },
        { status: 400 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "Você já enviou uma confirmação para este evento.",
          alreadyConfirmed: true,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível registrar sua confirmação agora." },
      { status: 500 },
    );
  }
}