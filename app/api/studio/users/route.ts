import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const allRoles = ["MASTER", "ADMIN", "EDITOR", "REVIEWER"] as const;
const adminRoles = ["ADMIN", "EDITOR", "REVIEWER"] as const;

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !["MASTER", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where:
        session.role === "MASTER"
          ? {}
          : {
              role: {
                not: "MASTER",
              },
            },
      orderBy: {
        createdAt: "desc",
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
      users: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao listar usuários." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session || !["MASTER", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role?.trim();
    const password = body.password?.trim();

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail, perfil e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const allowedRoles = session.role === "MASTER" ? allRoles : adminRoles;

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Perfil inválido para seu nível de acesso." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe um usuário com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        isActive: true,
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

    return NextResponse.json(
      {
        success: true,
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}