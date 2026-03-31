import { StudioHeader } from "@/components/studio/header";
import { requireStudioSession } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function roleLabel(role: string) {
  if (role === "MASTER") return "Master";
  if (role === "ADMIN") return "Admin";
  if (role === "EDITOR") return "Editor";
  return "Revisor";
}

function statusLabel(status: string) {
  if (status === "DRAFT") return "Rascunho";
  if (status === "IN_REVIEW") return "Em revisão";
  if (status === "CHANGES_REQUESTED") return "Ajustes";
  if (status === "REJECTED") return "Recusado";
  if (status === "APPROVED") return "Aprovado";
  if (status === "PUBLISHED") return "Publicado";
  return status;
}

function statusBadgeClass(status: string) {
  if (status === "PUBLISHED") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "APPROVED") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "IN_REVIEW") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "CHANGES_REQUESTED") {
    return "bg-orange-100 text-orange-700";
  }

  if (status === "REJECTED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default async function StudioDashboardPage() {
  const session = await requireStudioSession();
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
          <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
            <div className="text-sm font-semibold text-slate-500">Usuários</div>
            <div className="mt-3 text-4xl font-semibold tracking-tight text-[#16324f]">
              {totalUsers}
            </div>
            <div className="mt-3 text-sm text-slate-600">
              {activeUsers} ativos · {inactiveUsers} inativos
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
            <div className="text-sm font-semibold text-slate-500">Usuário</div>
            <div className="mt-3 text-xl font-semibold text-[#16324f]">
              {session.name}
            </div>
            <div className="mt-3 text-sm text-slate-600">{session.email}</div>
          </div>
        )}

        <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="text-sm font-semibold text-slate-500">Posts</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-[#16324f]">
            {totalPosts}
          </div>
          <div className="mt-3 text-sm text-slate-600">
            {publishedPosts} publicados · {draftPosts} rascunhos
          </div>
        </div>

        <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="text-sm font-semibold text-slate-500">
            Fluxo editorial
          </div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-[#16324f]">
            {reviewPosts}
          </div>
          <div className="mt-3 text-sm text-slate-600">
            Em revisão, ajustes e aprovados
          </div>
        </div>

        <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="text-sm font-semibold text-slate-500">Mensagens</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-[#16324f]">
            {totalMessages}
          </div>
          <div className="mt-3 text-sm text-slate-600">
            Total de mensagens internas
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {isAdminLevel ? (
          <div className="rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
            <div className="border-b border-[#e6eef8] px-6 py-5">
              <h2 className="text-xl font-semibold text-[#16324f]">
                Usuários recentes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Últimos usuários cadastrados no sistema.
              </p>
            </div>

            <div className="overflow-x-auto px-4 py-3">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#e8eef7] text-left">
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Nome
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Perfil
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Status
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Criado em
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#edf3fb] transition hover:bg-[#f8fbff]"
                    >
                      <td className="px-3 py-4 text-sm text-slate-900">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-700">
                        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#3157c8]">
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm">
                        {user.isActive ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Ativo
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}

                  {recentUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-10 text-center text-sm text-slate-500"
                      >
                        Nenhum usuário recente.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
            <div className="border-b border-[#e6eef8] px-6 py-5">
              <h2 className="text-xl font-semibold text-[#16324f]">Minha conta</h2>
              <p className="mt-1 text-sm text-slate-600">
                Resumo rápido do seu acesso atual.
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="rounded-2xl border border-[#e6eef8] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Nome
                </div>
                <div className="mt-2 font-semibold text-[#16324f]">
                  {session.name}
                </div>
              </div>

              <div className="rounded-2xl border border-[#e6eef8] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  E-mail
                </div>
                <div className="mt-2 font-semibold text-[#16324f]">
                  {session.email}
                </div>
              </div>

              <div className="rounded-2xl border border-[#e6eef8] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Perfil
                </div>
                <div className="mt-2 font-semibold text-[#16324f]">
                  {roleLabel(session.role)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="border-b border-[#e6eef8] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#16324f]">Posts recentes</h2>
            <p className="mt-1 text-sm text-slate-600">
              Últimos posts alterados no Studio.
            </p>
          </div>

          <div className="overflow-x-auto px-4 py-3">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#e8eef7] text-left">
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Título
                  </th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Status
                  </th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Autor
                  </th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Atualizado
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-[#edf3fb] transition hover:bg-[#f8fbff]"
                  >
                    <td className="px-3 py-4 text-sm text-slate-900">
                      <div className="font-semibold">{post.title}</div>
                      <div className="text-xs text-slate-500">/blog/{post.slug}</div>
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(
                          post.status
                        )}`}
                      >
                        {statusLabel(post.status)}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      {post.creator?.name || "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      {formatDate(post.updatedAt)}
                    </td>
                  </tr>
                ))}

                {recentPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-10 text-center text-sm text-slate-500"
                    >
                      Nenhum post recente.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}