"use client";

import { useEffect, useState } from "react";
import { getMyFranchise } from "@/lib/portal";
import type { Franchise } from "@/lib/franchises";

function formatStatus(status: Franchise["status"]) {
  if (status === "active") return "Ativa";
  if (status === "inactive") return "Inativa";
  return "Pendente";
}

export default function PortalPerfilPage() {
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setErrorMessage("");
        const data = await getMyFranchise();
        setFranchise(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o perfil.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <p>Nenhuma franquia vinculada.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 pb-24 md:p-8 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Perfil da Franquia</h1>
        <p className="mt-2 text-muted-foreground">
          Informações cadastrais da sua unidade.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {franchise.trade_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {franchise.corporate_name}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              franchise.status === "active"
                ? "bg-green-100 text-green-700"
                : franchise.status === "inactive"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {formatStatus(franchise.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">CNPJ</p>
            <p className="font-medium text-foreground">{franchise.cnpj || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Cidade / UF</p>
            <p className="font-medium text-foreground">
              {franchise.city}/{franchise.state}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Responsável</p>
            <p className="font-medium text-foreground">
              {franchise.contact_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">
              {franchise.contact_email}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="font-medium text-foreground">
              {franchise.contact_phone || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Data de entrada</p>
            <p className="font-medium text-foreground">
              {franchise.join_date || "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Observações</p>
            <p className="font-medium text-foreground">
              {franchise.notes || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}