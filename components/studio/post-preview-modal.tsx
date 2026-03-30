"use client";

import { X } from "lucide-react";
import { HtmlContent } from "@/components/shared/html-content";

type PostPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    excerpt: string;
    content: string;
    categoryLabel: string;
    subcategoryLabel: string;
    authorName: string;
    authorRole: string;
    mediaType: "IMAGE" | "YOUTUBE" | "";
    mediaUrl: string;
  };
};

function getYoutubeEmbedUrl(url: string) {
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

function isYoutubeShort(url: string) {
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

export function PostPreviewModal({
  isOpen,
  onClose,
  data,
}: PostPreviewModalProps) {
  if (!isOpen) {
    return null;
  }

  const youtubeEmbedUrl =
    data.mediaType === "YOUTUBE" ? getYoutubeEmbedUrl(data.mediaUrl) : null;

  const youtubeIsShort =
    data.mediaType === "YOUTUBE" ? isYoutubeShort(data.mediaUrl) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Prévia da publicação
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visualização aproximada de como o post ficará no site.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 p-2 text-slate-700 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-8">
          <article className="mx-auto max-w-4xl">
            <header className="border-b border-slate-200 pb-8">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                {data.title || "Título do post"}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-4 w-4 rounded-full bg-slate-200" />
                  <div className="leading-tight">
                    <div className="font-medium text-slate-700">
                      {data.authorName || "Autor"}
                    </div>
                    {data.authorRole ? (
                      <div className="text-xs text-slate-500">
                        {data.authorRole}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="text-xs text-slate-500">Data de publicação</div>

                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {data.categoryLabel}
                </div>

                <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  {data.subcategoryLabel}
                </div>
              </div>
            </header>

            {data.mediaType === "IMAGE" && data.mediaUrl ? (
              <div className="mt-10 overflow-hidden rounded-2xl">
                <img
                  src={data.mediaUrl}
                  alt={data.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}

            {data.mediaType === "YOUTUBE" && youtubeEmbedUrl ? (
              <div
                className={`mt-10 overflow-hidden rounded-2xl bg-black ${
                  youtubeIsShort ? "max-w-[380px] ml-0 mr-auto" : ""
                }`}
              >
                <div
                  className={
                    youtubeIsShort ? "aspect-[9/16] w-full" : "aspect-video w-full"
                  }
                >
                  <iframe
                    src={youtubeEmbedUrl}
                    title={data.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            {data.excerpt ? (
              <div className="mt-8 text-lg leading-8 text-slate-500">
                {data.excerpt}
              </div>
            ) : null}

            <div className="mt-8">
              {data.content ? (
                <HtmlContent
                  className="prose-content"
                  html={data.content}
                />
              ) : (
                <p className="leading-8 text-slate-400">
                  O conteúdo do post aparecerá aqui.
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}