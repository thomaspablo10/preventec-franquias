import { StudioHeader } from "@/components/studio/header";
import { ProfileForm } from "@/components/studio/profile-form";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function StudioProfilePage() {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      publicName: true,
      jobTitle: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <main>
      <StudioHeader
        title="Meu perfil"
        description="Atualize seus dados de exibição e assinatura pública."
        name={session.name}
        role={session.role}
      />

      <ProfileForm initialData={user} />
    </main>
  );
}