"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostMessagesModal } from "@/components/studio/post-messages-modal";
import {
  getPostCategoryLabel,
  getPostSubcategoryLabel,
} from "@/lib/post-categories";

type StudioRole = "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";
type PostStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "CHANGES_REQUESTED"
  | "REJECTED"
  | "APPROVED"
  | "PUBLISHED";

type PostCategory = string;
type PostSubcategory = string;

type PostItem = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  category: PostCategory;
  subcategory: PostSubcategory;
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
  if (status === "IN_REVIEW") return "Revisão";
  if (status === "CHANGES_REQUESTED") return "Ajustar";
  if (status === "REJECTED") return "Recusado";
  if (status === "APPROVED") return "Aprovado";
  return "Publicado";
}

function statusClass(status: PostStatus) {
  if (status === "DRAFT") return "bg-zinc-100 text-zinc-700";
  if (status === "IN_REVIEW") return "bg-amber-100 text-amber-700";
  if (status === "CHANGES_REQUESTED") return "bg-blue-100 text-blue-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  if (status === "APPROVED") return "bg-violet-100 text-violet-700";
  return "bg-emerald-100 text-emerald-700";
}

export function PostsTable({
  posts,
  currentUserId,
  currentRole,
}: PostsTableProps) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [postList, setPostList] = useState(posts);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

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

  async function handleDelete(postId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este post? Essa ação não poderá ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    setDeletingPostId(postId);

    try {
      const response = await fetch(`/api/studio/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao excluir post.");
        return;
      }

      setPostList((current) => current.filter((post) => post.id !== postId));
      router.refresh();
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setDeletingPostId(null);
    }
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
                  Categoria
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
                  currentRole === "MASTER" ||
                  (post.status !== "PUBLISHED" &&
                    (currentRole === "ADMIN" || post.creator.id === currentUserId));

                const canMessage =
                  currentRole === "MASTER" ||
                  currentRole === "ADMIN" ||
                  post.status !== "PUBLISHED";

                const canDelete = currentRole === "MASTER";

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

                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {getPostCategoryLabel(post.category as never)}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                          {getPostSubcategoryLabel(post.subcategory as never)}
                        </span>
                      </div>
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
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/studio/posts/${post.id}`}
                          className="rounded-xl border border-blue-300 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          Prévia
                        </Link>

                        {canEdit ? (
                          <Link
                            href={`/studio/posts/${post.id}/edit`}
                            className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                          >
                            Editar
                          </Link>
                        ) : null}

                        {canDelete ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingPostId === post.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </button>
                        ) : null}
                      </div>
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
                    Nenhum post encontrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPost ? (
        <PostMessagesModal
          isOpen={true}
          onClose={() => setSelectedPost(null)}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          currentUserId={currentUserId}
          currentRole={currentRole}
          onReadMessages={() => handleMessagesRead(selectedPost.id)}
        />
      ) : null}
    </>
  );
}