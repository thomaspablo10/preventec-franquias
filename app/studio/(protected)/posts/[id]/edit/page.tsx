import { notFound } from "next/navigation";
import { StudioHeader } from "@/components/studio/header";
import { PostForm } from "@/components/studio/post-form";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudioEditPostPage({ params }: PageProps) {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      category: true,
      mediaType: true,
      mediaUrl: true,
      status: true,
      creatorId: true,
    },
  });

  if (!post) {
    notFound();
  }

  if (post.status === "PUBLISHED" && session.role !== "ADMIN") {
    notFound();
  }

  if (session.role === "EDITOR" && post.creatorId !== session.userId) {
    notFound();
  }

  return (
    <main>
      <StudioHeader
        title="Editar post"
        description="Atualize o conteúdo e o fluxo editorial."
        name={session.name}
        role={session.role}
      />

      <PostForm
        mode="edit"
        role={session.role}
        postId={post.id}
        initialData={{
          title: post.title,
          excerpt: post.excerpt ?? "",
          content: post.content,
          category: post.category,
          mediaType: post.mediaType ?? "",
          mediaUrl: post.mediaUrl ?? "",
          status: post.status,
          isPublished: post.status === "PUBLISHED",
        }}
      />
    </main>
  );
}