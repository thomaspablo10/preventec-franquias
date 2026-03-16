"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPortalDashboard, type PortalDashboardResponse } from "@/lib/dashboard";

function formatStatus(status: "active" | "pending" | "inactive") {
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

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function PortalDashboardPage() {
  const [data, setData] = useState<PortalDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await getPortalDashboard();
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

  const { franchise, stats, recent_tickets, recent_documents } = data;

  return (
    <div className="mx-auto max-w-7xl p-6 pb-24 md:p-8 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Portal do Franqueado</h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe sua unidade, documentos e andamento dos atendimentos.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Franquia</p>
          <p className="mt-2 text-lg font-bold text-foreground">{franchise.trade_name}</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-2 text-lg font-bold text-foreground">
            {formatStatus(franchise.status)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Cidade</p>
          <p className="mt-2 text-lg font-bold text-foreground">
            {franchise.city}/{franchise.state}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Documentos disponíveis</p>
          <p className="mt-2 text-lg font-bold text-foreground">
            {stats.available_documents}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Abertos</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.open_tickets}</p>
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

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">Não lidos</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.unread_tickets}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Seus tickets</h2>
            <Link href="/portal/suporte" className="text-sm font-medium text-primary hover:underline">
              Ir para suporte
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
                      <p className="text-sm text-muted-foreground">
                        {formatTicketStatus(item.status)}
                      </p>
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

                  <p className="text-xs text-muted-foreground">
                    Última atualização: {formatDate(item.last_message_at || item.updated_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Documentos recentes</h2>
            <Link href="/portal/documentos" className="text-sm font-medium text-primary hover:underline">
              Ver documentos
            </Link>
          </div>

          <div className="space-y-3">
            {recent_documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum documento disponível.</p>
            ) : (
              recent_documents.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.category || "Sem categoria"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2 py-1">
                      {item.scope === "global" ? "Global" : "Da franquia"}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1">
                      {formatDate(item.created_at)}
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