import { NextResponse } from "next/server";
import {
  PostCategory,
  PostMediaType,
  PostStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  generateUniqueSlug,
  normalizePostStatusForRole,
  validateMediaFields,
} from "@/lib/post-utils";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses: PostStatus[] = [
  "DRAFT",
  "APPROVAL",
  "ADJUSTMENT",
  "REJECTED",
  "PUBLISHED",
];

const allowedCategories: PostCategory[] = [
  "MEDICINA_DO_TRABALHO",
  "SEGURANCA_DO_TRABALHO",
  "FINANCEIRO",
  "TECNOLOGIA_DA_INFORMACAO",
  "NOTICIAS_GERAIS",
];

const allowedMediaTypes: PostMediaType[] = ["IMAGE", "YOUTUBE"];

export async function GET(_req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado." },
        { status: 404 }
      );
    }

    if (session.role === "EDITOR" && post.creatorId !== session.userId) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Erro ao buscar post:", error);

    return NextResponse.json(
      { error: "Erro ao buscar post." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { id } = await context.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado." },
        { status: 404 }
      );
    }

    if (session.role === "EDITOR" && existingPost.creatorId !== session.userId) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const body = await req.json();

    const title = body.title?.trim();
    const excerpt = body.excerpt?.trim() || null;
    const content = body.content?.trim();
    const category = body.category?.trim() as PostCategory;
    const mediaType = (body.mediaType?.trim() || null) as PostMediaType | null;
    const mediaUrl = body.mediaUrl?.trim() || null;
    const requestedStatus = body.status?.trim() as PostStatus;
    const reviewNote = body.reviewNote?.trim() || null;

    if (!title || !content || !category || !requestedStatus) {
      return NextResponse.json(
        { error: "Título, conteúdo, área e status são obrigatórios." },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(requestedStatus)) {
      return NextResponse.json(
        { error: "Status inválido." },
        { status: 400 }
      );
    }

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "Área inválida." },
        { status: 400 }
      );
    }

    if (mediaType && !allowedMediaTypes.includes(mediaType)) {
      return NextResponse.json(
        { error: "Tipo de mídia inválido." },
        { status: 400 }
      );
    }

    const mediaValidation = validateMediaFields(mediaType, mediaUrl);

    if (!mediaValidation.valid) {
      return NextResponse.json(
        { error: mediaValidation.error },
        { status: 400 }
      );
    }

    const finalStatus = normalizePostStatusForRole(session.role, requestedStatus);
    const slug = await generateUniqueSlug(title, id);

    const creator = await prisma.user.findUnique({
      where: { id: existingPost.creatorId },
      select: {
        publicName: true,
        jobTitle: true,
      },
    });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        mediaType,
        mediaUrl,
        status: finalStatus,
        reviewNote:
          session.role === "ADMIN" || session.role === "REVIEWER"
            ? reviewNote
            : undefined,
        reviewerId:
          session.role === "ADMIN" || session.role === "REVIEWER"
            ? session.userId
            : undefined,
        publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,
        publishedAuthorName:
          finalStatus === "PUBLISHED"
            ? creator?.publicName || null
            : null,
        publishedAuthorRole:
          finalStatus === "PUBLISHED"
            ? creator?.jobTitle || null
            : null,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            publicName: true,
            jobTitle: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Erro ao atualizar post:", error);

    return NextResponse.json(
      { error: "Erro ao atualizar post." },
      { status: 500 }
    );
  }
}