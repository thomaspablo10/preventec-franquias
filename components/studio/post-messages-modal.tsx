"use client";

import { useEffect, useState } from "react";

type MessageItem = {
  id: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    publicName: string | null;
    jobTitle: string | null;
    role: "ADMIN" | "EDITOR" | "REVIEWER";
  };
  recipient: {
    id: string;
    name: string;
    publicName: string | null;
    jobTitle: string | null;
    role: "ADMIN" | "EDITOR" | "REVIEWER";
  };
};

type PostMessagesModalProps = {
  postId: string;
  postTitle: string;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onMessagesRead?: () => void;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function getVisualRole(role: "ADMIN" | "EDITOR" | "REVIEWER") {
  if (role === "EDITOR") return "Criador";
  return "Revisor";
}

function getDisplayName(message: MessageItem["sender"]) {
  return message.publicName || message.name;
}

export function PostMessagesModal({
  postId,
  postTitle,
  currentUserId,
  isOpen,
  onClose,
  onMessagesRead,
}: PostMessagesModalProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function loadMessages() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/studio/posts/${postId}/messages`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao carregar mensagens.");
        return;
      }

      setMessages(data.messages || []);
      onMessagesRead?.();
    } catch {
      setError("Erro ao carregar mensagens.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(`/api/studio/posts/${postId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao enviar mensagem.");
        return;
      }

      setMessages((current) => [...current, data.message]);
      setContent("");
    } catch {
      setError("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Mensagens do post</h2>
            <p className="mt-1 text-sm text-zinc-600">{postTitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-zinc-50 px-6 py-4">
          {loading ? (
            <div className="text-sm text-zinc-500">Carregando mensagens...</div>
          ) : null}

          {!loading && messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500">
              Nenhuma mensagem neste post ainda.
            </div>
          ) : null}

          <div className="space-y-4">
            {messages.map((message) => {
              const isMine = message.sender.id === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMine
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-200 bg-white text-zinc-900"
                    }`}
                  >
                    <div className="mb-2">
                      <div className="text-sm font-semibold">
                        {getDisplayName(message.sender)}
                      </div>
                      <div
                        className={`text-xs ${
                          isMine ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {getVisualRole(message.sender.role)}
                        {message.sender.jobTitle ? ` · ${message.sender.jobTitle}` : ""}
                      </div>
                      <div
                        className={`mt-1 text-[11px] ${
                          isMine ? "text-zinc-400" : "text-zinc-400"
                        }`}
                      >
                        {formatDate(message.createdAt)}
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-6">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-zinc-200 bg-white px-6 py-4"
        >
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Nova mensagem
          </label>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            placeholder="Escreva uma mensagem para o criador ou revisor..."
          />

          {error ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Enviando..." : "Enviar mensagem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}