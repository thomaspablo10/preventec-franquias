import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import {
  PostCategory,
  PostMediaType,
  PostStatus,
  PostSubcategory,
} from "@prisma/client";
import {
  getPostCategoryLabel as getCategoryLabelFromMap,
  getPostSubcategoryLabel as getSubcategoryLabelFromMap,
} from "@/lib/post-categories";

export function getPostCategoryLabel(category: PostCategory) {
  return getCategoryLabelFromMap(category);
}

export function getPostSubcategoryLabel(subcategory: PostSubcategory) {
  return getSubcategoryLabelFromMap(subcategory);
}

export function getPostStatusLabel(status: PostStatus) {
  if (status === "DRAFT") return "Rascunho";
  if (status === "IN_REVIEW") return "Em revisão";
  if (status === "CHANGES_REQUESTED") return "Ajustes solicitados";
  if (status === "REJECTED") return "Recusado";
  if (status === "APPROVED") return "Aprovado";
  return "Publicado";
}

export function isValidYoutubeUrl(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "");

    return hostname === "youtube.com" || hostname === "youtu.be";
  } catch {
    return false;
  }
}

export function validateMediaFields(
  mediaType?: PostMediaType | null,
  mediaUrl?: string | null
) {
  if (!mediaType && !mediaUrl) {
    return { valid: true };
  }

  if (!mediaType || !mediaUrl) {
    return {
      valid: false,
      error: "Preencha o tipo de mídia e a URL da mídia.",
    };
  }

  if (mediaType === "IMAGE") {
    return { valid: true };
  }

  if (mediaType === "YOUTUBE") {
    if (!isValidYoutubeUrl(mediaUrl)) {
      return {
        valid: false,
        error: "Informe uma URL válida do YouTube.",
      };
    }

    return { valid: true };
  }

  return {
    valid: false,
    error: "Tipo de mídia inválido.",
  };
}

export async function generateUniqueSlug(
  title: string,
  currentPostId?: string
) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === currentPostId) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}