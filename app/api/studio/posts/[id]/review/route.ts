import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    if (!["MASTER", "ADMIN", "REVIEWER"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const action = body.action?.trim();
    const message = body.message?.trim() || "";

    if (!["approve", "request_changes", "reject"].includes(action)) {
      return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        creatorId: true,
        status: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }

    let nextStatus: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";

    if (action === "approve") {
      nextStatus = "APPROVED";
    } else if (action === "request_changes") {
      nextStatus = "CHANGES_REQUESTED";
    } else {
      nextStatus = "REJECTED";
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status: nextStatus,
        reviewerId: session.userId,
      },
    });

    if (message) {
      await prisma.postMessage.create({
        data: {
          postId: id,
          senderId: session.userId,
          recipientId: post.creatorId,
          content: message,
        },
      });
    }

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Erro na revisão do post:", error);

    return NextResponse.json(
      { error: "Erro ao revisar post." },
      { status: 500 }
    );
  }
}