import { StudioHeader } from "@/components/studio/header";
import { PostsTable } from "@/components/studio/posts-table";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function StudioPostsPage() {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);

  const where =
    session.role === "EDITOR"
      ? { creatorId: session.userId }
      : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          publicName: true,
          jobTitle: true,
          email: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          publicName: true,
          jobTitle: true,
          email: true,
        },
      },
      messages: {
        where: {
          recipientId: session.userId,
          readAt: null,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    category: post.category,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    unreadMessages: post.status === "PUBLISHED" && session.role !== "ADMIN" ? 0 : post.messages.length,
    creator: post.creator,
    reviewer: post.reviewer,
  }));

  return (
    <main>
      <StudioHeader
        title="Posts"
        description="Gerencie os conteúdos do blog."
        name={session.name}
        role={session.role}
      />

      <PostsTable
        posts={formattedPosts}
        currentUserId={session.userId}
        currentRole={session.role}
      />
    </main>
  );
}