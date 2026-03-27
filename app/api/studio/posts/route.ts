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

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const where =
      session.role === "EDITOR"
        ? { creatorId: session.userId }
        : {};

    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
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

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao listar posts:", error);

    return NextResponse.json(
      { error: "Erro ao listar posts." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    if (!["ADMIN", "EDITOR", "REVIEWER"].includes(session.role)) {
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
    const slug = await generateUniqueSlug(title);

    const creator = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        publicName: true,
        jobTitle: true,
      },
    });

    const post = await prisma.post.create({
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
            : null,
        creatorId: session.userId,
        reviewerId:
          session.role === "ADMIN" || session.role === "REVIEWER"
            ? session.userId
            : null,
        publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,
        publishedAuthorName:
          finalStatus === "PUBLISHED"
            ? creator?.publicName || session.name
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

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);

    return NextResponse.json(
      { error: "Erro ao criar post." },
      { status: 500 }
    );
  }
}