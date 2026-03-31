"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRouter } from "next/navigation";
import { PostPreviewModal } from "@/components/studio/post-preview-modal";
import { TiptapEditor } from "@/components/studio/tiptap-editor";
import {
  getCategoryOptions,
  getPostCategoryLabel,
  getPostSubcategoryLabel,
  getSubcategoryOptions,
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
    subcategory: PostSubcategory;
    mediaType: PostMediaType | "";
    mediaUrl: string;
    status: PostStatus;
    isPublished?: boolean;
  };
  authorName?: string;
  authorRole?: string;
};

function getFormStatusOptions(isPublished?: boolean) {
  if (isPublished) {
    return [{ value: "PUBLISHED", label: "Publicado" }];
  }

  return [
    { value: "DRAFT", label: "Rascunho" },
    { value: "IN_REVIEW", label: "Enviar para revisão" },
  ];
}

export function PostForm({
  mode,
  role,
  postId,
  initialData,
  authorName,
  authorRole,
}: PostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isPublished = initialData?.isPublished === true;
  const isMaster = role === "MASTER";

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [category, setCategory] = useState<PostCategory>(
    initialData?.category ?? "MEDICINA_DO_TRABALHO"
  );
  const [subcategory, setSubcategory] = useState<PostSubcategory>(
    initialData?.subcategory ?? "GERAL"
  );
  const [mediaType, setMediaType] = useState<PostMediaType | "">(
    initialData?.mediaType ?? ""
  );
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl ?? "");
  const [status, setStatus] = useState<PostStatus>(initialData?.status ?? "DRAFT");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imagePreviewVersion, setImagePreviewVersion] = useState(Date.now());

  const statusOptions = getFormStatusOptions(isPublished);
  const categoryOptions = getCategoryOptions();
  const subcategoryOptions = getSubcategoryOptions(category as never);
  const fieldsDisabled = isPublished && !isMaster;

  useEffect(() => {
    const exists = subcategoryOptions.some((item) => item.value === subcategory);

    if (!exists && subcategoryOptions.length > 0) {
      setSubcategory(subcategoryOptions[0].value as PostSubcategory);
    }
  }, [category, subcategory, subcategoryOptions]);

  const selectedCategoryLabel = useMemo(() => {
    return getPostCategoryLabel(category as never);
  }, [category]);

  const selectedSubcategoryLabel = useMemo(() => {
    return getPostSubcategoryLabel(subcategory as never);
  }, [subcategory]);

  const imagePreviewUrl = useMemo(() => {
    if (mediaType !== "IMAGE" || !mediaUrl) {
      return "";
    }

    const separator = mediaUrl.includes("?") ? "&" : "?";
    return `${mediaUrl}${separator}v=${imagePreviewVersion}`;
  }, [mediaType, mediaUrl, imagePreviewVersion]);

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
          subcategory,
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
    setImagePreviewVersion(Date.now());

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/studio/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao enviar imagem.");
        return;
      }

      setMediaType("IMAGE");
      setMediaUrl(data.url);
      setImagePreviewVersion(Date.now());

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setError("Erro ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  function handleMediaTypeChange(nextValue: PostMediaType | "") {
    setMediaType(nextValue);
    setMediaUrl("");
    setImagePreviewVersion(Date.now());

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Título
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={fieldsDisabled || loading}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
                placeholder="Digite o título do post"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Resumo
              </label>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                disabled={fieldsDisabled || loading}
                className="min-h-28 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
                placeholder="Resumo opcional do post"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Categoria
                </label>
                <SearchableSelect
                  options={categoryOptions}
                  value={category}
                  onChange={(value) => setCategory(value as PostCategory)}
                  placeholder="Selecione a categoria"
                  disabled={fieldsDisabled || loading}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Subcategoria
                </label>
                <SearchableSelect
                  options={subcategoryOptions}
                  value={subcategory}
                  onChange={(value) => setSubcategory(value as PostSubcategory)}
                  placeholder="Selecione a subcategoria"
                  disabled={fieldsDisabled || loading}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Tipo de mídia
              </label>
              <select
                value={mediaType}
                onChange={(event) =>
                  handleMediaTypeChange(event.target.value as PostMediaType | "")
                }
                disabled={fieldsDisabled || loading}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
              >
                <option value="">Sem mídia</option>
                <option value="IMAGE">Imagem</option>
                <option value="YOUTUBE">Vídeo</option>
              </select>
            </div>

            {mediaType === "IMAGE" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Imagem
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={fieldsDisabled || loading || uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-zinc-800"
                  />

                  {mediaUrl ? (
                    <button
                      type="button"
                      onClick={clearMedia}
                      className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                    >
                      Remover mídia
                    </button>
                  ) : null}
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  A imagem será comprimida e salva no storage do blog.
                </p>

                {uploadingImage ? (
                  <p className="mt-2 text-sm text-zinc-500">Enviando imagem...</p>
                ) : null}

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {imagePreviewUrl ? (
                  <img
                    key={imagePreviewUrl}
                    src={imagePreviewUrl}
                    alt="Prévia da imagem"
                    className="mt-4 max-h-72 rounded-2xl border border-zinc-200 object-cover"
                  />
                ) : null}
              </div>
            ) : null}

            {mediaType === "YOUTUBE" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  URL do vídeo
                </label>
                <input
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  disabled={fieldsDisabled || loading}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
                  placeholder="Cole a URL do YouTube"
                />

                {mediaUrl ? (
                  <button
                    type="button"
                    onClick={clearMedia}
                    className="mt-3 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Remover mídia
                  </button>
                ) : null}
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Conteúdo
              </label>
              <TiptapEditor
                value={content}
                onChange={setContent}
                disabled={fieldsDisabled || loading}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-zinc-700">Autor exibido</p>
              <p className="mt-1 text-sm text-zinc-900">{authorName || "Autor"}</p>
              {authorRole ? (
                <p className="text-xs text-zinc-500">{authorRole}</p>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-700">Classificação</p>
              <p className="mt-1 text-sm text-zinc-900">{selectedCategoryLabel}</p>
              <p className="text-xs text-zinc-500">{selectedSubcategoryLabel}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as PostStatus)}
                disabled={fieldsDisabled || loading}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fieldsDisabled ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Post publicado só pode ser editado pelo MASTER.
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="rounded-xl border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Pré-visualizar
            </button>

            <button
              type="submit"
              disabled={loading || fieldsDisabled}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/studio/posts")}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Voltar
            </button>
          </div>
        </div>
      </form>

      <PostPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={{
          title,
          excerpt,
          content,
          categoryLabel: selectedCategoryLabel,
          subcategoryLabel: selectedSubcategoryLabel,
          authorName: authorName || "Autor",
          authorRole: authorRole || "",
          mediaType,
          mediaUrl,
        }}
      />
    </>
  );
}