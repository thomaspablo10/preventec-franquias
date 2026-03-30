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

const allowedCategories = Object.values(PostCategory);
const allowedSubcategories = Object.values(PostSubcategory);
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

    if (!["MASTER", "ADMIN", "EDITOR"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
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

    if (session.role === "MASTER" || session.role === "ADMIN") {
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
          { error: "Status inválido para criação." },
          { status: 400 }
        );
      }
    } else {
      if (!["DRAFT", "IN_REVIEW"].includes(requestedStatus)) {
        return NextResponse.json(
          { error: "Status inválido para criação." },
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

    const slug = await generateUniqueSlug(title);

    const post = await prisma.post.create({
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
        creatorId: session.userId,
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