"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { mockBlogPosts } from "@/lib/mock-data";

export function NewsCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const posts = mockBlogPosts;
  const visibleCount = 3;

  const totalSlides = posts.length;

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);
  };

  useEffect(() => {
    if (!isPaused) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const getVisiblePosts = () => {
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(posts[(activeIndex + i) % totalSlides]);
    }
    return visible;
  };

  const visiblePosts = getVisiblePosts();

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Últimas Notícias
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Blog e Conteúdo
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="Artigo anterior"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="Próximo artigo"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visiblePosts.map((post, i) => (
            <Link
              key={`${post.id}-${activeIndex}-${i}`}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDuration: "400ms", animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-foreground text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {post.author}
                    </span>
                  </div>
                  <time className="text-xs text-muted-foreground" suppressHydrationWarning>
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

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ir para artigo ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
