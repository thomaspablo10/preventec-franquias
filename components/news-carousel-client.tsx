"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

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

type NewsCarouselClientProps = {
  posts: CarouselPost[];
};

export function NewsCarouselClient({ posts }: NewsCarouselClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleCount = 3;
  const totalSlides = posts.length;

  const visiblePosts = useMemo(() => {
    if (!posts.length) return [];

    if (posts.length <= visibleCount) {
      return posts;
    }

    const visible: CarouselPost[] = [];

    for (let i = 0; i < visibleCount; i++) {
      visible.push(posts[(activeIndex + i) % totalSlides]);
    }

    return visible;
  }, [posts, activeIndex, totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalSlides]);

  function handlePrev() {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handlePrev}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Artigo anterior"
          className="border-border text-foreground/60 hover:text-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          disabled={totalSlides <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Próximo artigo"
          className="border-border text-foreground/60 hover:text-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          disabled={totalSlides <= 1}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {visiblePosts.map((post, index) => (
          <Link
            key={`${post.id}-${activeIndex}-${index}`}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDuration: "400ms",
              animationDelay: `${index * 60}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="bg-muted relative h-48 flex-shrink-0 overflow-hidden">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                  <FileText className="h-10 w-10 text-zinc-400" />
                </div>
              )}

              <div className="absolute left-3 top-3">
                <span className="bg-primary inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-foreground mb-2 line-clamp-2 text-base font-bold leading-snug transition-colors group-hover:text-primary">
                {post.title}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
                {post.excerpt}
              </p>

              <div className="border-border flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full">
                    <span className="text-primary text-xs font-bold">
                      {post.author.charAt(0)}
                    </span>
                  </div>

                  <span className="text-muted-foreground text-xs font-medium">
                    {post.author}
                  </span>
                </div>

                <time
                  className="text-muted-foreground text-xs"
                  suppressHydrationWarning
                >
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </time>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir para artigo ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-primary w-6"
                  : "bg-border hover:bg-primary/40 w-2"
              }`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}