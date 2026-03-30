"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  postStatus:
    | "DRAFT"
    | "IN_REVIEW"
    | "CHANGES_REQUESTED"
    | "REJECTED"
    | "APPROVED"
    | "PUBLISHED";
  currentRole: "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";
  canReview: boolean;
  canPublish: boolean;
};

export function PostReviewActions({
  postId,
  postStatus,
  canReview,
  canPublish,
}: Props) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [scheduledPublishAt, setScheduledPublishAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleReview(action: "approve" | "request_changes" | "reject") {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/studio/posts/${postId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro na ação editorial.");
        return;
      }

      setSuccess("Ação editorial executada com sucesso.");
      router.refresh();
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishNow() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/studio/posts/${postId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishNow: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao publicar.");
        return;
      }

      setSuccess("Post publicado com sucesso.");
      router.refresh();
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedulePublish() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/studio/posts/${postId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishNow: false,
          scheduledPublishAt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao agendar publicação.");
        return;
      }

      setSuccess("Publicação agendada com sucesso.");
      router.refresh();
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-900">Ações editoriais</h2>

      {canReview && postStatus === "IN_REVIEW" ? (
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Mensagem ao criador
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              placeholder="Mensagem opcional para o criador"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleReview("approve")}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              Aprovar
            </button>

            <button
              type="button"
              onClick={() => handleReview("request_changes")}
              disabled={loading}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
            >
              Pedir ajustes
            </button>

            <button
              type="button"
              onClick={() => handleReview("reject")}
              disabled={loading}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              Recusar
            </button>
          </div>
        </div>
      ) : null}

      {canPublish && postStatus === "APPROVED" ? (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePublishNow}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Publicar agora
            </button>
          </div>

          <div className="max-w-sm">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Agendar publicação
            </label>
            <input
              type="datetime-local"
              value={scheduledPublishAt}
              onChange={(event) => setScheduledPublishAt(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSchedulePublish}
            disabled={loading || !scheduledPublishAt}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
          >
            Agendar
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}
    </div>
  );
}