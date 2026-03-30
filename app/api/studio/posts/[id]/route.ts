import { NextResponse } from "next/server";
import {
  PostCategory,
  PostMediaType,
  PostStatus,
  PostSubcategory,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateUniqueSlug, validateMediaFields } from "@/lib/post-utils";
import { isValidSubcategoryForCategory } from "@/lib/post-categories";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedCategories = Object.values(PostCategory);
const allowedSubcategories = Object.values(PostSubcategory);
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

    const canAccess =
      session.role === "MASTER" ||
      session.role === "ADMIN" ||
      session.role === "REVIEWER" ||
      post.creatorId === session.userId;

    if (!canAccess) {
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
        status: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado." },
        { status: 404 }
      );
    }

    const isMaster = session.role === "MASTER";
    const isAdmin = session.role === "ADMIN";
    const isOwner = existingPost.creatorId === session.userId;

    const canEdit = isMaster || isAdmin || isOwner;

    if (!canEdit) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (existingPost.status === "PUBLISHED" && !isMaster) {
      return NextResponse.json(
        { error: "Somente o MASTER pode editar post publicado." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const title = body.title?.trim();
    const excerpt = body.excerpt?.trim() || null;
    const content = body.content?.trim();
    const category = body.category?.trim() as PostCategory;
    const subcategory = (body.subcategory?.trim() || "GERAL") as PostSubcategory;
    const mediaType = (body.mediaType?.trim() || null) as PostMediaType | null;
    const mediaUrl = body.mediaUrl?.trim() || null;
    const requestedStatus = body.status?.trim() as PostStatus;

    if (
      !title ||
      !content?.replace(/<[^>]*>/g, "").trim() ||
      !category ||
      !subcategory ||
      !requestedStatus
    ) {
      return NextResponse.json(
        {
          error:
            "Título, conteúdo, categoria, subcategoria e status são obrigatórios.",
        },
        { status: 400 }
      );
    }

    if (isMaster) {
      // MASTER pode tudo
    } else if (isAdmin) {
      if (
        ![
          "DRAFT",
          "IN_REVIEW",
          "CHANGES_REQUESTED",
          "REJECTED",
          "APPROVED",
        ].includes(requestedStatus)
      ) {
        return NextResponse.json(
          { error: "Status inválido para edição." },
          { status: 400 }
        );
      }
    } else {
      if (!["DRAFT", "IN_REVIEW"].includes(requestedStatus)) {
        return NextResponse.json(
          {
            error:
              "Editor só pode salvar como rascunho ou enviar novamente para revisão.",
          },
          { status: 400 }
        );
      }
    }

    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
    }

    if (!allowedSubcategories.includes(subcategory)) {
      return NextResponse.json(
        { error: "Subcategoria inválida." },
        { status: 400 }
      );
    }

    if (!isValidSubcategoryForCategory(category, subcategory)) {
      return NextResponse.json(
        { error: "Subcategoria incompatível com a categoria escolhida." },
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

    const slug = await generateUniqueSlug(title, id);

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        subcategory,
        mediaType,
        mediaUrl,
        status: requestedStatus,
        reviewerId: requestedStatus === "IN_REVIEW" ? null : undefined,
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

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    if (session.role !== "MASTER") {
      return NextResponse.json(
        { error: "Somente o MASTER pode excluir posts." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado." },
        { status: 404 }
      );
    }

    await prisma.postMessage.deleteMany({
      where: { postId: id },
    });

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir post:", error);

    return NextResponse.json(
      { error: "Erro ao excluir post." },
      { status: 500 }
    );
  }
}