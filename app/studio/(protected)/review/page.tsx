import Link from "next/link";
import { StudioHeader } from "@/components/studio/header";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getPostCategoryLabel } from "@/lib/post-utils";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function StudioReviewPage() {
  const session = await requireStudioRole(["ADMIN", "REVIEWER"]);

  const posts = await prisma.post.findMany({
    where: {
      status: "APPROVAL",
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      creator: {
        select: {
          name: true,
          publicName: true,
          jobTitle: true,
        },
      },
    },
  });

  return (
    <main>
      <StudioHeader
        title="Revisão"
        description="Área para revisar, ajustar, reprovar ou publicar conteúdos."
        name={session.name}
        role={session.role}
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Fila de aprovação</h2>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {posts.length} pendente(s)
          </span>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Criador: {post.creator.publicName || post.creator.name}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Área: {getPostCategoryLabel(post.category)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Atualizado em {formatDate(post.updatedAt)}
                </p>
              </div>

              <Link
                href={`/studio/posts/${post.id}/edit`}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Revisar
              </Link>
            </div>
          ))}

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
              Nenhum post aguardando aprovação.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}