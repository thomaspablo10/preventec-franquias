"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StudioRole = "ADMIN" | "EDITOR" | "REVIEWER";
type PostStatus = "DRAFT" | "APPROVAL" | "ADJUSTMENT" | "REJECTED" | "PUBLISHED";
type PostCategory =
  | "MEDICINA_DO_TRABALHO"
  | "SEGURANCA_DO_TRABALHO"
  | "FINANCEIRO"
  | "TECNOLOGIA_DA_INFORMACAO"
  | "NOTICIAS_GERAIS";
type PostMediaType = "IMAGE" | "YOUTUBE";

type PostFormProps = {
  mode: "create" | "edit";
  role: StudioRole;
  postId?: string;
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    category: PostCategory;
    mediaType: PostMediaType | "";
    mediaUrl: string;
    status: PostStatus;
    isPublished?: boolean;
  };
};

function getStatusOptions(role: StudioRole, isPublished?: boolean) {
  if (isPublished && role !== "ADMIN") {
    return [{ value: "PUBLISHED", label: "Publicado" }];
  }

  if (role === "EDITOR") {
    return [
      { value: "DRAFT", label: "Rascunho" },
      { value: "APPROVAL", label: "Enviar para aprovação" },
    ];
  }

  return [
    { value: "DRAFT", label: "Rascunho" },
    { value: "APPROVAL", label: "Aprovação" },
    { value: "ADJUSTMENT", label: "Ajustar" },
    { value: "REJECTED", label: "Reprovado" },
    { value: "PUBLISHED", label: "Publicado" },
  ];
}

function getCategoryOptions() {
  return [
    { value: "MEDICINA_DO_TRABALHO", label: "Medicina do Trabalho" },
    { value: "SEGURANCA_DO_TRABALHO", label: "Segurança do Trabalho" },
    { value: "FINANCEIRO", label: "Financeiro" },
    { value: "TECNOLOGIA_DA_INFORMACAO", label: "Tecnologia da Informação" },
    { value: "NOTICIAS_GERAIS", label: "Notícias Gerais" },
  ];
}

export function PostForm({
  mode,
  role,
  postId,
  initialData,
}: PostFormProps) {
  const router = useRouter();

  const isPublished = initialData?.isPublished === true;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [category, setCategory] = useState<PostCategory>(
    initialData?.category ?? "MEDICINA_DO_TRABALHO"
  );
  const [mediaType, setMediaType] = useState<PostMediaType | "">(
    initialData?.mediaType ?? ""
  );
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl ?? "");
  const [status, setStatus] = useState<PostStatus>(
    initialData?.status ?? "DRAFT"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusOptions = getStatusOptions(role, isPublished);
  const categoryOptions = getCategoryOptions();
  const fieldsDisabled = isPublished && role !== "ADMIN";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (fieldsDisabled) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url =
        mode === "create" ? "/api/studio/posts" : `/api/studio/posts/${postId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          mediaType: mediaType || null,
          mediaUrl: mediaUrl || null,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao salvar post.");
        return;
      }

      router.push("/studio/posts");
      router.refresh();
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function clearMedia() {
    setMediaType("");
    setMediaUrl("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fieldsDisabled ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Este post está publicado. Apenas administradores podem alterá-lo.
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={fieldsDisabled}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
              placeholder="Digite o título do post"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Resumo
            </label>
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              disabled={fieldsDisabled}
              className="min-h-24 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
              placeholder="Resumo curto do conteúdo"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Área do post
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as PostCategory)}
              disabled={fieldsDisabled}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-900">Mídia principal</p>
            <p className="mt-1 text-xs text-zinc-500">
              Escolha apenas uma opção: imagem ou vídeo do YouTube.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Tipo de mídia
                </label>
                <select
                  value={mediaType}
                  onChange={(event) => setMediaType(event.target.value as PostMediaType | "")}
                  disabled={fieldsDisabled}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
                >
                  <option value="">Sem mídia</option>
                  <option value="IMAGE">Imagem</option>
                  <option value="YOUTUBE">YouTube</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  URL da mídia
                </label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  disabled={fieldsDisabled}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
                  placeholder={
                    mediaType === "YOUTUBE"
                      ? "https://www.youtube.com/watch?v=..."
                      : "https://dominio.com/imagem.jpg"
                  }
                />
              </div>
            </div>

            {(mediaType || mediaUrl) && !fieldsDisabled ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={clearMedia}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Remover mídia
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Conteúdo
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={fieldsDisabled}
              className="min-h-[320px] w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
              placeholder="Escreva o conteúdo do post"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as PostStatus)}
              disabled={fieldsDisabled}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3">
            {!fieldsDisabled ? (
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Salvando..."
                  : mode === "create"
                  ? "Criar post"
                  : "Salvar alterações"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => router.push("/studio/posts")}
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}