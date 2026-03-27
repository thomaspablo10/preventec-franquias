import { StudioHeader } from "@/components/studio/header";
import { PostForm } from "@/components/studio/post-form";
import { requireStudioRole } from "@/lib/permissions";

export default async function StudioNewPostPage() {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);

  return (
    <main>
      <StudioHeader
        title="Novo post"
        description="Crie um novo conteúdo para o blog."
        name={session.name}
        role={session.role}
      />

      <PostForm mode="create" role={session.role} />
    </main>
  );
}