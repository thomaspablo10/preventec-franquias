import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/studio/profile-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioProfilePage() {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      cpf: true,
      avatarUrl: true,
      publicName: true,
      jobTitle: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return (
    <main className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Meu perfil</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Atualize seus dados, assinatura pública do blog, foto de perfil e senha.
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Usuário: <span className="font-semibold text-zinc-800">{user.name}</span> · Perfil:{" "}
          <span className="font-semibold text-zinc-800">{user.role}</span>
        </p>
      </div>

      <ProfileForm
        initialData={{
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          cpf: user.cpf ?? "",
          avatarUrl: user.avatarUrl ?? "",
          publicName: user.publicName ?? "",
          jobTitle: user.jobTitle ?? "",
        }}
      />
    </main>
  );
}