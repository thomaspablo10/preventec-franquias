"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { PostMessagesModal } from "@/components/studio/post-messages-modal";

type StudioRole = "ADMIN" | "EDITOR" | "REVIEWER";
type PostStatus = "DRAFT" | "APPROVAL" | "ADJUSTMENT" | "REJECTED" | "PUBLISHED";
type PostCategory =
  | "MEDICINA_DO_TRABALHO"
  | "SEGURANCA_DO_TRABALHO"
  | "FINANCEIRO"
  | "TECNOLOGIA_DA_INFORMACAO"
  | "NOTICIAS_GERAIS";

type PostItem = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  category: PostCategory;
  createdAt: string;
  updatedAt: string;
  unreadMessages: number;
  creator: {
    id: string;
    name: string;
    publicName: string | null;
    jobTitle: string | null;
    email: string;
  };
  reviewer: {
    id: string;
    name: string;
    publicName: string | null;
    jobTitle: string | null;
    email: string;
  } | null;
};

type PostsTableProps = {
  posts: PostItem[];
  currentUserId: string;
  currentRole: StudioRole;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function statusLabel(status: PostStatus) {
  if (status === "DRAFT") return "Rascunho";
  if (status === "APPROVAL") return "Aprovação";
  if (status === "ADJUSTMENT") return "Ajustar";
  if (status === "REJECTED") return "Reprovado";
  return "Publicado";
}

function statusClass(status: PostStatus) {
  if (status === "DRAFT") return "bg-zinc-100 text-zinc-700";
  if (status === "APPROVAL") return "bg-amber-100 text-amber-700";
  if (status === "ADJUSTMENT") return "bg-blue-100 text-blue-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  return "bg-emerald-100 text-emerald-700";
}

function categoryLabel(category: PostCategory) {
  if (category === "MEDICINA_DO_TRABALHO") return "Medicina do Trabalho";
  if (category === "SEGURANCA_DO_TRABALHO") return "Segurança do Trabalho";
  if (category === "FINANCEIRO") return "Financeiro";
  if (category === "TECNOLOGIA_DA_INFORMACAO") return "Tecnologia da Informação";
  return "Notícias Gerais";
}

export function PostsTable({
  posts,
  currentUserId,
  currentRole,
}: PostsTableProps) {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [postList, setPostList] = useState(posts);

  function handleMessagesRead(postId: string) {
    setPostList((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              unreadMessages: 0,
            }
          : post
      )
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Posts</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Gerencie os conteúdos do blog.
            </p>
          </div>

          <Link
            href="/studio/posts/new"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Novo post
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Título
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Criador
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Área
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Atualizado em
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Mensagens
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {postList.map((post) => {
                const canEdit =
                  currentRole === "ADMIN" ||
                  (post.status !== "PUBLISHED" &&
                    (currentRole === "REVIEWER" || post.creator.id === currentUserId));

                const canMessage =
                  currentRole === "ADMIN" ||
                  post.status !== "PUBLISHED";

                return (
                  <tr key={post.id} className="bg-zinc-50">
                    <td className="rounded-l-xl px-3 py-3">
                      <div className="text-sm font-semibold text-zinc-900">
                        {post.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        /blog/{post.slug}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {post.creator.publicName || post.creator.name}
                    </td>

                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {categoryLabel(post.category)}
                    </td>

                    <td className="px-3 py-3 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                          post.status
                        )}`}
                      >
                        {statusLabel(post.status)}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {formatDate(post.updatedAt)}
                    </td>

                    <td className="px-3 py-3 text-center">
                      {canMessage ? (
                        <button
                          type="button"
                          onClick={() => setSelectedPost(post)}
                          className="relative inline-flex items-center justify-center rounded-xl border border-zinc-300 px-3 py-2 text-zinc-700 transition hover:bg-zinc-100"
                          title="Abrir mensagens"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {post.unreadMessages > 0 ? (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                              {post.unreadMessages}
                            </span>
                          ) : null}
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-400">Bloqueado</span>
                      )}
                    </td>

                    <td className="rounded-r-xl px-3 py-3 text-right">
                      {canEdit ? (
                        <Link
                          href={`/studio/posts/${post.id}/edit`}
                          className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Editar
                        </Link>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          Sem permissão
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {postList.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-sm text-zinc-500"
                  >
                    Nenhum post cadastrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPost ? (
        <PostMessagesModal
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          currentUserId={currentUserId}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onMessagesRead={() => handleMessagesRead(selectedPost.id)}
        />
      ) : null}
    </>
  );
}