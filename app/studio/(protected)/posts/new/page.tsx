import { StudioHeader } from "@/components/studio/header";
import { PostForm } from "@/components/studio/post-form";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function StudioNewPostPage() {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      publicName: true,
      jobTitle: true,
      name: true,
    },
  });

  return (
    <main>
      <StudioHeader
        title="Novo post"
        description="Crie um novo conteúdo para o blog."
        name={session.name}
        role={session.role}
      />

      <PostForm
        mode="create"
        role={session.role}
        authorName={user?.publicName || user?.name || session.name}
        authorRole={user?.jobTitle || ""}
      />
    </main>
  );
}