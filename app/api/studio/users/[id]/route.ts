import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allRoles = ["MASTER", "ADMIN", "EDITOR", "REVIEWER"] as const;
const adminRoles = ["ADMIN", "EDITOR", "REVIEWER"] as const;

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session || !["MASTER", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role?.trim();
    const password = body.password?.trim() || null;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Nome, e-mail e perfil são obrigatórios." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const allowedRoles = session.role === "MASTER" ? allRoles : adminRoles;

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Perfil inválido para seu nível de acesso." },
        { status: 400 }
      );
    }

    if (existingUser.role === "MASTER" && session.role !== "MASTER") {
      return NextResponse.json(
        { error: "Somente MASTER pode editar outro MASTER." },
        { status: 403 }
      );
    }

    if (session.role !== "MASTER" && role === "MASTER") {
      return NextResponse.json(
        { error: "Somente MASTER pode promover usuário para MASTER." },
        { status: 403 }
      );
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== id) {
      return NextResponse.json(
        { error: "Já existe um usuário com este e-mail." },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        ...(password ? { passwordHash: await hash(password, 10) } : {}),
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
    console.error("Erro ao editar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao editar usuário." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session || session.role !== "MASTER") {
      return NextResponse.json(
        { error: "Somente o MASTER pode excluir usuários." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (existingUser.id === session.userId) {
      return NextResponse.json(
        { error: "Você não pode excluir seu próprio usuário." },
        { status: 400 }
      );
    }

    if (existingUser.role === "MASTER") {
      return NextResponse.json(
        { error: "Usuários MASTER não podem ser excluídos por esta tela." },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.postMessage.deleteMany({
        where: {
          OR: [{ senderId: id }, { recipientId: id }],
        },
      });

      await tx.post.updateMany({
        where: {
          OR: [{ creatorId: id }, { reviewerId: id }],
        },
        data: {
          reviewerId: null,
        },
      });

      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir usuário." },
      { status: 500 }
    );
  }
}