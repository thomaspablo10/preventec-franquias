import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const now = new Date();

    const posts = await prisma.post.findMany({
      where: {
        status: "APPROVED",
        scheduledPublishAt: {
          not: null,
          lte: now,
        },
      },
      include: {
        creator: {
          select: {
            name: true,
            publicName: true,
            jobTitle: true,
          },
        },
      },
    });

    for (const post of posts) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: "PUBLISHED",
          publishedAt: now,
          publishedAuthorName: post.creator.publicName || post.creator.name,
          publishedAuthorRole: post.creator.jobTitle || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      publishedCount: posts.length,
    });
  } catch (error) {
    console.error("Erro ao publicar agendados:", error);

    return NextResponse.json(
      { error: "Erro ao publicar agendados." },
      { status: 500 }
    );
  }
}