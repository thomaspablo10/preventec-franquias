import Link from "next/link";
import { BlogCardMedia } from "@/components/blog/blog-card-media";

type BlogPostCardProps = {
  title: string;
  slug: string;
  excerpt: string | null;
  categoryLabel: string;
  subcategoryLabel: string;
  publishedAt: string;
  authorName: string | null;
  authorRole: string | null;
  mediaType: "IMAGE" | "YOUTUBE" | null;
  mediaUrl: string | null;
};

export function BlogPostCard({
  title,
  slug,
  excerpt,
  categoryLabel,
  subcategoryLabel,
  publishedAt,
  mediaType,
  mediaUrl,
}: BlogPostCardProps) {
  return (
    <article className="group min-w-0">
      <Link href={`/blog/${slug}`} className="block">
        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
            <BlogCardMedia
              mediaType={mediaType}
              mediaUrl={mediaUrl}
              title={title}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {categoryLabel}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
              {subcategoryLabel}
            </span>
          </div>

          <h2 className="mt-2 text-lg font-semibold leading-7 text-slate-900 transition group-hover:text-blue-700 md:text-xl line-clamp-3">
            {title}
          </h2>

          {excerpt ? (
            <p className="mt-2 line-clamp-3 text-base leading-7 text-slate-600">
              {excerpt}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="text-xs text-slate-400">{publishedAt}</span>
            <span className="text-xs font-semibold text-blue-700">
              Ler mais →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}