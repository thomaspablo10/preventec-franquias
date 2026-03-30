import { prisma } from "@/lib/prisma";
import { PostMediaType } from "@prisma/client";
import {
  getPostCategoryLabel,
  getPostSubcategoryLabel,
} from "@/lib/post-categories";

export function getPublicCategoryLabel(category: any) {
  return getPostCategoryLabel(category);
}

export function getPublicSubcategoryLabel(subcategory: any) {
  return getPostSubcategoryLabel(subcategory);
}

export function formatPublicDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getYoutubeVideoId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/shorts/")
    ) {
      return parsed.pathname.split("/").filter(Boolean)[1];
    }

    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(url: string) {
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYoutubeThumbnailUrl(url: string) {
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      subcategory: true,
      mediaType: true,
      mediaUrl: true,
      publishedAt: true,
      publishedAuthorName: true,
      publishedAuthorRole: true,
      creator: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      category: true,
      subcategory: true,
      mediaType: true,
      mediaUrl: true,
      publishedAt: true,
      publishedAuthorName: true,
      publishedAuthorRole: true,
      creator: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });
}

export function isImageMedia(mediaType: PostMediaType | null, mediaUrl: string | null) {
  return mediaType === "IMAGE" && !!mediaUrl;
}

export function isYoutubeMedia(mediaType: PostMediaType | null, mediaUrl: string | null) {
  return mediaType === "YOUTUBE" && !!mediaUrl;
}