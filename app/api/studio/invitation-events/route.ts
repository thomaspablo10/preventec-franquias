import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudioRole } from "@/lib/permissions";

const invitationEventSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Informe um slug válido.")
    .regex(/^[a-z0-9-]+$/, "O slug deve conter apenas letras minúsculas, números e hífen."),
  title: z.string().trim().min(3, "Informe o título do evento."),
  hostName: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  eventDate: z.string().trim().min(1, "Informe a data e horário."),
  locationName: z.string().trim().min(3, "Informe o nome do local."),
  address: z.string().trim().min(3, "Informe o endereço."),
  mapsUrl: z.string().trim().url("Informe um link válido do Maps.").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    await requireStudioRole(["MASTER", "ADMIN"]);

    const json = await request.json();
    const data = invitationEventSchema.parse(json);

    const existing = await prisma.invitationEvent.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe um evento com esse slug." },
        { status: 409 },
      );
    }

    const event = await prisma.invitationEvent.create({
      data: {
        slug: data.slug,
        title: data.title,
        hostName: data.hostName || null,
        description: data.description || null,
        eventDate: new Date(`${data.eventDate}:00-04:00`),
        locationName: data.locationName,
        address: data.address,
        mapsUrl: data.mapsUrl || null,
        isActive: data.isActive,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Evento criado com sucesso.",
      event,
    });
  } catch (error: unknown) {
    console.error("Erro ao criar evento de convite:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Dados inválidos." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível criar o evento agora." },
      { status: 500 },
    );
  }
}