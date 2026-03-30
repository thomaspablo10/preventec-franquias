import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session || !["MASTER", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isActive: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (user.id === session.userId) {
      return NextResponse.json(
        { error: "Você não pode desativar seu próprio usuário." },
        { status: 400 }
      );
    }

    if (user.role === "MASTER" && session.role !== "MASTER") {
      return NextResponse.json(
        { error: "Somente MASTER pode alterar status de outro MASTER." },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao alterar status do usuário:", error);
    return NextResponse.json(
      { error: "Erro ao alterar status do usuário." },
      { status: 500 }
    );
  }
}