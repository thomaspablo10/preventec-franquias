import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import {
  PostCategory,
  PostMediaType,
  PostStatus,
  UserRole,
} from "@prisma/client";

export function getPostCategoryLabel(category: PostCategory) {
  if (category === "MEDICINA_DO_TRABALHO") return "Medicina do Trabalho";
  if (category === "SEGURANCA_DO_TRABALHO") return "Segurança do Trabalho";
  if (category === "FINANCEIRO") return "Financeiro";
  if (category === "TECNOLOGIA_DA_INFORMACAO") return "Tecnologia da Informação";
  return "Notícias Gerais";
}

export function getPostStatusLabel(status: PostStatus) {
  if (status === "DRAFT") return "Rascunho";
  if (status === "APPROVAL") return "Aprovação";
  if (status === "ADJUSTMENT") return "Ajustar";
  if (status === "REJECTED") return "Reprovado";
  return "Publicado";
}

export function normalizePostStatusForRole(
  role: UserRole,
  requestedStatus: PostStatus
): PostStatus {
  if (role === "EDITOR") {
    if (requestedStatus === "PUBLISHED") return "APPROVAL";
    if (requestedStatus === "REJECTED") return "APPROVAL";
    if (requestedStatus === "ADJUSTMENT") return "APPROVAL";
  }

  return requestedStatus;
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