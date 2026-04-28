export const dynamic = "force-dynamic";
export const revalidate = 0;
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostMedia } from "@/components/blog/blog-post-media";
import { BlogPostMeta } from "@/components/blog/blog-post-meta";
import { HtmlContent } from "@/components/shared/html-content";
import {
  formatPublicDate,
  getPublicCategoryLabel,
  getPublicSubcategoryLabel,
  getPublishedPostBySlug,
} from "@/lib/public-blog";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  return {
    title: `${post.title} | Blog Preventec® Franquias`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/blog"
          className="text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          ← Voltar ao Blog
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6">
            <BlogPostMeta
              authorName={post.publishedAuthorName}
              authorRole={post.publishedAuthorRole}
              authorAvatarUrl={post.creator?.avatarUrl || null}
              publishedAt={post.publishedAt ? formatPublicDate(post.publishedAt) : ""}
              categoryLabel={getPublicCategoryLabel(post.category)}
              subcategoryLabel={getPublicSubcategoryLabel(post.subcategory)}
            />
          </div>
        </header>

        <div className="mt-10">
          <BlogPostMedia
            mediaType={post.mediaType}
            mediaUrl={post.mediaUrl}
            title={post.title}
          />
        </div>

        {post.excerpt ? (
          <div className="mt-8 text-lg leading-8 text-slate-500">
            {post.excerpt}
          </div>
        ) : null}

        <HtmlContent
          className="prose-content mt-8"
          html={post.content}
        />
      </article>
    </main>
  );
}