export const dynamic = "force-dynamic";
export const revalidate = 0;
import { BlogPostCard } from "@/components/blog/blog-post-card";
import {
  formatPublicDate,
  getPublicCategoryLabel,
  getPublicSubcategoryLabel,
  getPublishedPosts,
} from "@/lib/public-blog";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Blog Preventec</h1>
          <p className="mt-3 text-base text-slate-600">
            Artigos e insights sobre saúde e segurança ocupacional
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <input
              type="text"
              placeholder="Buscar artigos..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 px-8 py-14 text-center text-slate-500">
            Nenhum post publicado no momento.
          </div>
        ) : (
          <div
            className="grid gap-x-6 gap-y-10"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 360px))",
            }}
          >
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                categoryLabel={getPublicCategoryLabel(post.category)}
                subcategoryLabel={getPublicSubcategoryLabel(post.subcategory)}
                publishedAt={post.publishedAt ? formatPublicDate(post.publishedAt) : ""}
                authorName={post.publishedAuthorName}
                authorRole={post.publishedAuthorRole}
                mediaType={post.mediaType}
                mediaUrl={post.mediaUrl}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}