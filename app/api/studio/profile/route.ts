import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function onlyDigits(value: string | null | undefined) {
  return (value || "").replace(/\D/g, "");
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await req.json();

    const name = body.name?.trim();
    const phone = onlyDigits(body.phone);
    const cpf = onlyDigits(body.cpf);
    const avatarUrl = body.avatarUrl?.trim() || null;
    const publicName = body.publicName?.trim() || null;
    const jobTitle = body.jobTitle?.trim() || null;
    const currentPassword = body.currentPassword?.trim() || null;
    const newPassword = body.newPassword?.trim() || null;

    if (!name) {
      return NextResponse.json({ error: "Nome completo é obrigatório." }, { status: 400 });
    }

    if (cpf && cpf.length !== 11) {
      return NextResponse.json({ error: "CPF inválido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    let passwordHash: string | undefined;

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Para alterar a senha, informe a senha atual e a nova senha." },
          { status: 400 }
        );
      }

      const passwordMatches = await compare(currentPassword, user.passwordHash);

      if (!passwordMatches) {
        return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
      }

      passwordHash = await hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        phone: phone || null,
        cpf: cpf || null,
        avatarUrl,
        publicName,
        jobTitle,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json({ error: "Erro ao atualizar perfil." }, { status: 500 });
  }
}