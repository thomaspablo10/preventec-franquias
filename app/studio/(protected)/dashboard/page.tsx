import { StudioHeader } from "@/components/studio/header";
import { requireStudioSession } from "@/lib/permissions";

export default async function StudioDashboardPage() {
  const session = await requireStudioSession();

  return (
    <main>
      <StudioHeader
        title="Dashboard"
        description="Visão geral inicial do painel editorial."
        name={session.name}
        role={session.role}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Usuário</p>
          <p className="mt-2 text-base font-semibold text-zinc-900">
            {session.name}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">E-mail</p>
          <p className="mt-2 text-base font-semibold text-zinc-900">
            {session.email}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Perfil</p>
          <p className="mt-2 text-base font-semibold text-zinc-900">
            {session.role}
          </p>
        </div>
      </div>
    </main>
  );
}