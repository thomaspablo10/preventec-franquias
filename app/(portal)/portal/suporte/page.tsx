"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createTicket,
  getTicket,
  listTickets,
  replyTicket,
  type AppTicket,
  type TicketConversation,
  type TicketPriority,
} from "@/lib/tickets";
import { useAuth } from "@/hooks/use-auth";

function formatTime(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString("pt-BR");
}

function priorityLabel(priority: TicketPriority) {
  if (priority === "high") return "Alta";
  if (priority === "low") return "Baixa";
  return "Média";
}

export default function PortalSupportPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<TicketConversation[]>([]);
  const [activeTicket, setActiveTicket] = useState<AppTicket | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [creating, setCreating] = useState(false);
  const [replying, setReplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [replyMessage, setReplyMessage] = useState("");

  async function loadConversations() {
    try {
      const data = await listTickets();
      setConversations(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível carregar as conversas.";
      setErrorMessage(message);
    } finally {
      setLoadingList(false);
    }
  }

  async function openConversation(ticketId: number) {
    try {
      setLoadingTicket(true);
      setActiveTicketId(ticketId);
      const ticket = await getTicket(ticketId);
      setActiveTicket(ticket);

      setConversations((prev) =>
        prev.map((item) =>
          item.id === ticketId ? { ...item, unread_count: 0 } : item
        )
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível abrir a conversa.";
      setErrorMessage(message);
    } finally {
      setLoadingTicket(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await listTickets();
        setConversations(data);

        if (activeTicketId) {
          const ticket = await getTicket(activeTicketId);
          setActiveTicket(ticket);
        }
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTicketId]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aTime = a.last_message_at ?? a.updated_at;
      const bTime = b.last_message_at ?? b.updated_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [conversations]);

  async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setErrorMessage("");

    try {
      const created = await createTicket({
        subject,
        description,
        priority,
      });

      setSubject("");
      setDescription("");
      setPriority("medium");
      await loadConversations();
      await openConversation(created.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível abrir o ticket.";
      setErrorMessage(message);
    } finally {
      setCreating(false);
    }
  }

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeTicketId || !replyMessage.trim()) return;

    setReplying(true);
    setErrorMessage("");

    try {
      const updated = await replyTicket(activeTicketId, replyMessage.trim());
      setActiveTicket(updated);
      setReplyMessage("");
      await loadConversations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível enviar a mensagem.";
      setErrorMessage(message);
    } finally {
      setReplying(false);
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#f5f7fb]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[360px_1fr]">
        <aside className="border-r border-border bg-white">
          <div className="border-b border-border p-4">
            <h1 className="text-2xl font-bold text-foreground">Suporte</h1>
            <p className="text-sm text-muted-foreground">
              Conversas com a equipe
            </p>
          </div>

          <div className="border-b border-border p-4">
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <input
                type="text"
                placeholder="Assunto"
                className="w-full rounded-lg border px-3 py-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <select
                className="w-full rounded-lg border px-3 py-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
              >
                <option value="low">Prioridade baixa</option>
                <option value="medium">Prioridade média</option>
                <option value="high">Prioridade alta</option>
              </select>

              <textarea
                placeholder="Descreva seu problema..."
                className="w-full rounded-lg border px-3 py-2"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white"
                disabled={creating}
              >
                {creating ? "Abrindo..." : "Abrir nova conversa"}
              </button>
            </form>
          </div>

          <div className="h-[calc(100%-290px)] overflow-y-auto">
            {loadingList ? (
              <div className="p-4 text-sm text-muted-foreground">Carregando conversas...</div>
            ) : sortedConversations.length > 0 ? (
              sortedConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation.id)}
                  className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/40 ${
                    activeTicketId === conversation.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <p className="line-clamp-1 font-semibold text-foreground">
                      {conversation.subject}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatTime(conversation.last_message_at)}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {conversation.last_message || "Sem mensagens"}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {priorityLabel(conversation.priority)}
                    </span>

                    {conversation.unread_count > 0 ? (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 py-1 text-[11px] font-bold text-white">
                        {conversation.unread_count}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                Nenhuma conversa aberta.
              </div>
            )}
          </div>
        </aside>

        <section className="flex h-full flex-col bg-[#efeae2]">
          {activeTicket ? (
            <>
              <div className="border-b border-border bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-foreground">{activeTicket.subject}</h2>
                    <p className="text-sm text-muted-foreground">
                      Status: {activeTicket.status} • Prioridade: {priorityLabel(activeTicket.priority)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto flex max-w-4xl flex-col gap-3">
                  {activeTicket.messages.map((message) => {
                    const isMine = message.user_id === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                            isMine
                              ? "bg-[#d9fdd3] text-foreground"
                              : "bg-white text-foreground"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">{message.message}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={handleReply}
                className="border-t border-border bg-white p-4"
              >
                <div className="mx-auto flex max-w-4xl gap-3">
                  <textarea
                    className="min-h-[52px] flex-1 rounded-2xl border px-4 py-3"
                    placeholder="Digite sua mensagem..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-primary px-5 py-3 font-medium text-white"
                    disabled={replying}
                  >
                    {replying ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
              {loadingTicket ? "Abrindo conversa..." : "Selecione uma conversa ou abra uma nova."}
            </div>
          )}
        </section>
      </div>

      {errorMessage ? (
        <div className="fixed bottom-4 right-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}