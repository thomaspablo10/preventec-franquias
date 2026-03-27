import { StudioHeader } from "@/components/studio/header";
import { UsersTable } from "@/components/studio/users-table";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function StudioUsersPage() {
  const session = await requireStudioRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <main>
      <StudioHeader
        title="Usuários"
        description="Gerencie os usuários e perfis do Studio."
        name={session.name}
        role={session.role}
      />

      <UsersTable initialUsers={users} currentUserId={session.userId} />
    </main>
  );
}