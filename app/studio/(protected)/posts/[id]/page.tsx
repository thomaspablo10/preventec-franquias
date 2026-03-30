export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getPostCategoryLabel } from "@/lib/post-utils";
import { PostReviewActions } from "@/components/studio/post-review-actions";
import { HtmlContent } from "@/components/shared/html-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getYoutubeEmbedUrl(url: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/shorts/")
    ) {
      const id = parsed.pathname.split("/").filter(Boolean)[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    const id = parsed.searchParams.get("v");

    if (!id) return null;

    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

function isYoutubeShort(url: string | null) {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    return (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/shorts/")
    );
  } catch {
    return false;
  }
}

export default async function StudioPostPreviewPage({ params }: PageProps) {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          publicName: true,
          jobTitle: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          publicName: true,
          jobTitle: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const canAccess =
    session.role === "MASTER" ||
    session.role === "ADMIN" ||
    session.role === "REVIEWER" ||
    post.creatorId === session.userId;

  if (!canAccess) {
    notFound();
  }

  const youtubeEmbedUrl =
    post.mediaType === "YOUTUBE" ? getYoutubeEmbedUrl(post.mediaUrl) : null;

  const youtubeIsShort =
    post.mediaType === "YOUTUBE" ? isYoutubeShort(post.mediaUrl) : false;

  const canEdit =
    session.role === "MASTER" ||
    (post.status !== "PUBLISHED" &&
      (session.role === "ADMIN" || post.creatorId === session.userId));

  return (
    <main className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Prévia</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Visualização editorial do conteúdo antes da publicação.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/studio/posts"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Voltar
            </Link>

            {canEdit ? (
              <Link
                href={`/studio/posts/${post.id}/edit`}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Editar
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Criador</p>
            <p className="mt-1 text-sm font-medium text-zinc-900">
              {post.creator.publicName || post.creator.name}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Revisor</p>
            <p className="mt-1 text-sm font-medium text-zinc-900">
              {post.reviewer ? post.reviewer.publicName || post.reviewer.name : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Status</p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{post.status}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Área</p>
            <p className="mt-1 text-sm font-medium text-zinc-900">
              {getPostCategoryLabel(post.category)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Publicação agendada
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">
              {formatDate(post.scheduledPublishAt)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Publicado em</p>
            <p className="mt-1 text-sm font-medium text-zinc-900">
              {formatDate(post.publishedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <article className="mx-auto max-w-4xl">
          <header className="border-b border-slate-200 pb-8">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full bg-slate-200" />
                <div className="leading-tight">
                  <div className="font-medium text-slate-700">
                    {post.creator.publicName || post.creator.name}
                  </div>
                  {post.creator.jobTitle ? (
                    <div className="text-xs text-slate-500">
                      {post.creator.jobTitle}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {getPostCategoryLabel(post.category)}
              </div>
            </div>
          </header>

          {post.mediaType === "IMAGE" && post.mediaUrl ? (
            <div className="mt-10 overflow-hidden rounded-2xl">
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}

          {post.mediaType === "YOUTUBE" && youtubeEmbedUrl ? (
            <div
              className={`mt-10 overflow-hidden rounded-2xl bg-black ${
                youtubeIsShort ? "ml-0 mr-auto max-w-[380px]" : ""
              }`}
            >
              <div
                className={
                  youtubeIsShort ? "aspect-[9/16] w-full" : "aspect-video w-full"
                }
              >
                <iframe
                  src={youtubeEmbedUrl}
                  title={post.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          {post.excerpt ? (
            <div className="mt-8 text-lg leading-8 text-slate-500">
              {post.excerpt}
            </div>
          ) : null}

          <HtmlContent className="prose-content mt-8" html={post.content} />
        </article>
      </div>

      <PostReviewActions
        postId={post.id}
        postStatus={post.status}
        currentRole={session.role}
        canReview={
          session.role === "MASTER" ||
          session.role === "ADMIN" ||
          session.role === "REVIEWER"
        }
        canPublish={session.role === "MASTER" || session.role === "ADMIN"}
      />
    </main>
  );
}