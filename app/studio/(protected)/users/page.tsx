import { StudioHeader } from "@/components/studio/header";
import { UsersTable } from "@/components/studio/users-table";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function StudioUsersPage() {
  const session = await requireStudioRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    where:
      session.role === "MASTER"
        ? {}
        : {
            role: {
              not: "MASTER",
            },
          },
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

      <UsersTable
        initialUsers={users.map((user) => ({
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        }))}
        currentUserId={session.userId}
        currentUserRole={session.role}
      />
    </main>
  );
}