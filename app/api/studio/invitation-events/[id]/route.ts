import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudioRole } from "@/lib/permissions";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const updateInvitationEventSchema = z.object({
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
  isActive: z.boolean(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireStudioRole(["MASTER", "ADMIN"]);

    const { id } = await context.params;
    const json = await request.json();
    const data = updateInvitationEventSchema.parse(json);

    const existingSlug = await prisma.invitationEvent.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
      select: { id: true },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Já existe outro evento com esse slug." },
        { status: 409 },
      );
    }

    await prisma.invitationEvent.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        hostName: data.hostName || null,
        description: data.description || null,
        eventDate: new Date(data.eventDate),
        locationName: data.locationName,
        address: data.address,
        mapsUrl: data.mapsUrl || null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Evento atualizado com sucesso.",
    });
  } catch (error: unknown) {
    console.error("Erro ao atualizar evento:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Dados inválidos." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível atualizar o evento agora." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await requireStudioRole(["MASTER", "ADMIN"]);

    const { id } = await context.params;

    await prisma.invitationEvent.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Evento apagado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao apagar evento:", error);

    return NextResponse.json(
      { error: "Não foi possível apagar o evento agora." },
      { status: 500 },
    );
  }
}