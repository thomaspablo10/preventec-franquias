import { StudioHeader } from "@/components/studio/header";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function StudioDashboardPage() {
  const session = await requireStudioRole(["ADMIN", "EDITOR", "REVIEWER"]);

  const isAdminLevel = session.role === "MASTER" || session.role === "ADMIN";

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalPosts,
    publishedPosts,
    draftPosts,
    reviewPosts,
    totalMessages,
    recentUsers,
    recentPosts,
  ] = await Promise.all([
    isAdminLevel
      ? prisma.user.count({
          where:
            session.role === "MASTER"
              ? {}
              : {
                  role: {
                    not: "MASTER",
                  },
                },
        })
      : Promise.resolve(0),

    isAdminLevel
      ? prisma.user.count({
          where:
            session.role === "MASTER"
              ? { isActive: true }
              : {
                  isActive: true,
                  role: {
                    not: "MASTER",
                  },
                },
        })
      : Promise.resolve(0),

    isAdminLevel
      ? prisma.user.count({
          where:
            session.role === "MASTER"
              ? { isActive: false }
              : {
                  isActive: false,
                  role: {
                    not: "MASTER",
                  },
                },
        })
      : Promise.resolve(0),

    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.count({
      where: {
        status: {
          in: ["IN_REVIEW", "CHANGES_REQUESTED", "REJECTED", "APPROVED"],
        },
      },
    }),
    prisma.postMessage.count(),

    isAdminLevel
      ? prisma.user.findMany({
          where:
            session.role === "MASTER"
              ? {}
              : {
                  role: {
                    not: "MASTER",
                  },
                },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        })
      : Promise.resolve([]),

    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return (
    <main className="space-y-6">
      <StudioHeader
        title="Dashboard"
        description="Visão geral do painel editorial."
        name={session.name}
        role={session.role}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isAdminLevel ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-zinc-500">Usuários</div>
            <div className="mt-2 text-3xl font-bold text-zinc-900">{totalUsers}</div>
            <div className="mt-2 text-sm text-zinc-600">
              {activeUsers} ativos · {inactiveUsers} inativos
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-zinc-500">Usuário</div>
            <div className="mt-2 text-lg font-bold text-zinc-900">{session.name}</div>
            <div className="mt-2 text-sm text-zinc-600">{session.email}</div>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Posts</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{totalPosts}</div>
          <div className="mt-2 text-sm text-zinc-600">
            {publishedPosts} publicados · {draftPosts} rascunhos
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Fluxo editorial</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{reviewPosts}</div>
          <div className="mt-2 text-sm text-zinc-600">
            Em revisão / ajustes / aprovados
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Mensagens</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{totalMessages}</div>
          <div className="mt-2 text-sm text-zinc-600">
            Total de mensagens internas
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {isAdminLevel ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Usuários recentes</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Últimos usuários cadastrados no sistema.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Nome
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Perfil
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Criado em
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="bg-zinc-50">
                      <td className="rounded-l-xl px-3 py-3 text-sm text-zinc-900">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </td>
                      <td className="px-3 py-3 text-sm text-zinc-700">{user.role}</td>
                      <td className="px-3 py-3 text-sm">
                        {user.isActive ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Ativo
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="rounded-r-xl px-3 py-3 text-sm text-zinc-700">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Minha conta</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Resumo rápido do seu acesso atual.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-zinc-50 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Nome</div>
                <div className="mt-1 font-medium text-zinc-900">{session.name}</div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">E-mail</div>
                <div className="mt-1 font-medium text-zinc-900">{session.email}</div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Perfil</div>
                <div className="mt-1 font-medium text-zinc-900">{session.role}</div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Posts recentes</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Últimos posts alterados no Studio.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Título
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Autor
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Atualizado
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id} className="bg-zinc-50">
                    <td className="rounded-l-xl px-3 py-3 text-sm text-zinc-900">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-zinc-500">/blog/{post.slug}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-zinc-700">{post.status}</td>
                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {post.creator?.name || "—"}
                    </td>
                    <td className="rounded-r-xl px-3 py-3 text-sm text-zinc-700">
                      {formatDate(post.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}