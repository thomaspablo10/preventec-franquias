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

    const publishNow = body.publishNow === true;
    const scheduledPublishAt = body.scheduledPublishAt
      ? new Date(body.scheduledPublishAt)
      : null;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        creatorId: true,
        creator: {
          select: {
            name: true,
            publicName: true,
            jobTitle: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }

    if (post.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Somente posts aprovados podem ser publicados." },
        { status: 400 }
      );
    }

    if (!publishNow && !scheduledPublishAt) {
      return NextResponse.json(
        { error: "Informe publicar agora ou uma data de publicação." },
        { status: 400 }
      );
    }

    const publishedAuthorName = post.creator.publicName || post.creator.name;
    const publishedAuthorRole = post.creator.jobTitle || null;

    if (publishNow) {
      const updated = await prisma.post.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          scheduledPublishAt: null,
          reviewerId: session.userId,
          publishedAuthorName,
          publishedAuthorRole,
        },
      });

      return NextResponse.json({ success: true, post: updated });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        scheduledPublishAt,
        reviewerId: session.userId,
        publishedAuthorName,
        publishedAuthorRole,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Erro ao publicar/agendar post:", error);

    return NextResponse.json(
      { error: "Erro ao publicar/agendar post." },
      { status: 500 }
    );
  }
}