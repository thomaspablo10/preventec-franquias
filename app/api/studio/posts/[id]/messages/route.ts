import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function canAccessMessages(session: NonNullable<Awaited<ReturnType<typeof getSession>>>, post: {
  creatorId: string;
  reviewerId: string | null;
  status: string;
}) {
  if (post.status === "PUBLISHED" && session.role !== "ADMIN") {
    return false;
  }

  return (
    session.role === "ADMIN" ||
    session.role === "REVIEWER" ||
    post.creatorId === session.userId
  );
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
        reviewerId: true,
        status: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }

    if (!canAccessMessages(session, post)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    await prisma.postMessage.updateMany({
      where: {
        postId: id,
        recipientId: session.userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    const messages = await prisma.postMessage.findMany({
      where: {
        postId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Erro ao listar mensagens do post:", error);
    return NextResponse.json({ error: "Erro ao listar mensagens." }, { status: 500 });
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Mensagem obrigatória." }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
        reviewerId: true,
        status: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }

    if (!canAccessMessages(session, post)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    let recipientId: string | null = null;

    if (session.role === "EDITOR") {
      if (!post.reviewerId) {
        return NextResponse.json(
          { error: "Este post ainda não possui revisor atribuído." },
          { status: 400 }
        );
      }

      recipientId = post.reviewerId;
    } else {
      recipientId = post.creatorId;
    }

    const message = await prisma.postMessage.create({
      data: {
        postId: id,
        senderId: session.userId,
        recipientId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            role: true,
          },
        },
      },
    });

    if ((session.role === "ADMIN" || session.role === "REVIEWER") && post.reviewerId !== session.userId) {
      await prisma.post.update({
        where: { id },
        data: {
          reviewerId: session.userId,
        },
      });
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Erro ao enviar mensagem do post:", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem." }, { status: 500 });
  }
}