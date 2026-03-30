import fs from "fs/promises";
import path from "path";
import { StudioHeader } from "@/components/studio/header";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getDirectorySize(dirPath: string): Promise<number> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const sizes = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          return getDirectorySize(fullPath);
        }

        const stats = await fs.stat(fullPath);
        return stats.size;
      })
    );

    return sizes.reduce((total, size) => total + size, 0);
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function StudioMasterPage() {
  const session = await requireStudioRole(["MASTER"]);

  const [storageSize, avatarCount, recentUsers, recentPosts] = await Promise.all([
    getDirectorySize(path.join(process.cwd(), "storage")),
    prisma.user.count({
      where: {
        avatarUrl: {
          not: null,
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 10,
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
        title="Master"
        description="Ferramentas administrativas reais do sistema."
        name={session.name}
        role={session.role}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Storage total</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">
            {formatBytes(storageSize)}
          </div>
          <div className="mt-2 text-sm text-zinc-600">
            Espaço ocupado por arquivos do sistema
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Avatares salvos</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{avatarCount}</div>
          <div className="mt-2 text-sm text-zinc-600">
            Usuários com foto configurada
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Ambiente</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">
            {process.env.NODE_ENV === "production" ? "Produção" : "Desenvolvimento"}
          </div>
          <div className="mt-2 text-sm text-zinc-600">
            Execução atual do sistema
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Banco</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">Online</div>
          <div className="mt-2 text-sm text-zinc-600">
            Prisma conectado ao PostgreSQL
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Usuários recentes</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Últimos usuários cadastrados, incluindo MASTER.
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

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Banco de dados</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Acesso administrativo protegido via Prisma, sem expor SQL bruto nem Prisma Studio pela web.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Arquivos</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Os uploads do sistema estão centralizados em <code>storage/</code>, fora do
            <code> public/</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Segurança</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Área restrita somente para MASTER, com isolamento de sessão e expiração por inatividade.
          </p>
        </div>
      </section>
    </main>
  );
}