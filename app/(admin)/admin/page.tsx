"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminDashboard, type AdminDashboardResponse } from "@/lib/dashboard";

function formatFranchiseStatus(status: "active" | "pending" | "inactive") {
  if (status === "active") return "Ativa";
  if (status === "inactive") return "Inativa";
  return "Pendente";
}

function formatTicketStatus(status: string) {
  if (status === "open") return "Aberto";
  if (status === "in_progress") return "Em andamento";
  if (status === "resolved") return "Resolvido";
  if (status === "closed") return "Fechado";
  return status;
}

function formatPriority(priority: string) {
  if (priority === "high") return "Alta";
  if (priority === "low") return "Baixa";
  return "Média";
}

function formatDateTime(value: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await getAdminDashboard();
        setData(response);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o dashboard.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (errorMessage || !data) {
    return (
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage || "Não foi possível carregar os dados."}
        </div>
      </div>
    );
  }

  const { stats, recent_franchises, recent_tickets, recent_documents } = data;

  const cards = [
    { label: "Total de franquias", value: stats.total_franchises },
    { label: "Franquias ativas", value: stats.active_franchises },
    { label: "Tickets abertos", value: stats.open_tickets },
    { label: "Tickets não lidos", value: stats.unread_tickets },
    { label: "Documentos ativos", value: stats.active_documents },
    { label: "Usuários franqueados", value: stats.total_franchisees },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6 pb-24 md:p-8 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="mt-2 text-muted-foreground">
          Visão geral real do sistema, franquias, documentos e suporte.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.pending_franchises}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Em andamento</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.in_progress_tickets}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Resolvidos</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.resolved_tickets}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Fechados</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.closed_tickets}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-white p-6 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Franquias recentes</h2>
            <Link href="/admin/franqueados" className="text-sm font-medium text-primary hover:underline">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-3">
            {recent_franchises.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma franquia cadastrada.</p>
            ) : (
              recent_franchises.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.trade_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.city}/{item.state}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Contato: {item.contact_name}
                      </p>
                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                      {formatFranchiseStatus(item.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Tickets recentes</h2>
            <Link href="/admin/suporte" className="text-sm font-medium text-primary hover:underline">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-3">
            {recent_tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum ticket encontrado.</p>
            ) : (
              recent_tickets.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.subject}</p>
                      <p className="text-sm text-muted-foreground">{item.franchise_name}</p>
                    </div>

                    {item.unread_count > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                        {item.unread_count} nova(s)
                      </span>
                    )}
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.last_message || "Sem mensagens."}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2 py-1">
                      {formatTicketStatus(item.status)}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1">
                      Prioridade {formatPriority(item.priority)}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1">
                      {formatDateTime(item.last_message_at || item.updated_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Documentos recentes</h2>
            <Link href="/admin/documentos" className="text-sm font-medium text-primary hover:underline">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-3">
            {recent_documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum documento cadastrado.</p>
            ) : (
              recent_documents.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.category || "Sem categoria"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2 py-1">
                      {item.scope === "global" ? "Global" : "Franquia"}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1">
                      {item.franchise_name || "Todas as franquias"}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1">
                      {formatDateTime(item.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}