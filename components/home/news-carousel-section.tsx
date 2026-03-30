import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPostCategoryLabel } from "@/lib/post-utils";
import { NewsCarouselClient } from "@/components/news-carousel-client";

type CarouselPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  coverImage: string | null;
};

function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || null;
    }

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/shorts/")
    ) {
      return parsed.pathname.split("/").filter(Boolean)[1] || null;
    }

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/embed/")
    ) {
      return parsed.pathname.split("/").filter(Boolean)[1] || null;
    }

    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

function getPostCoverImage(post: {
  mediaType: string | null;
  mediaUrl: string | null;
}) {
  if (post.mediaType === "IMAGE" && post.mediaUrl) {
    return post.mediaUrl;
  }

  if (post.mediaType === "YOUTUBE" && post.mediaUrl) {
    const youtubeId = getYoutubeId(post.mediaUrl);

    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
  }

  return null;
}

export async function NewsCarouselSection() {
  const postsFromDb = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 9,
    include: {
      creator: {
        select: {
          name: true,
          publicName: true,
        },
      },
    },
  });

  if (!postsFromDb.length) {
    return null;
  }

  const posts: CarouselPost[] = postsFromDb.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: getPostCategoryLabel(post.category),
    author: post.creator.publicName || post.creator.name,
    publishedAt: (post.publishedAt || post.createdAt).toISOString(),
    coverImage: getPostCoverImage(post),
  }));

  return (
    <section className="overflow-hidden bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Últimas Notícias
            </span>
            <h2 className="text-foreground mt-2 text-3xl font-bold text-balance sm:text-4xl">
              Blog e Conteúdo
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-primary hidden items-center gap-1 text-sm font-semibold hover:underline sm:flex"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <NewsCarouselClient posts={posts} />

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/blog"
            className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}