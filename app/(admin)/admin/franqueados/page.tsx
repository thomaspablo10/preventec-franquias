"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createFranchise,
  deleteFranchise,
  listFranchises,
  updateFranchise,
  type Franchise,
  type FranchiseStatus,
} from "@/lib/franchises";
import { createUser } from "@/lib/users";

type FormData = {
  corporate_name: string;
  trade_name: string;
  cnpj: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  state: string;
  status: FranchiseStatus;
  join_date: string;
  notes: string;
};

type UserFormData = {
  full_name: string;
  email: string;
  password: string;
};

const initialFormData: FormData = {
  corporate_name: "",
  trade_name: "",
  cnpj: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  city: "",
  state: "",
  status: "pending",
  join_date: "",
  notes: "",
};

const initialUserFormData: UserFormData = {
  full_name: "",
  email: "",
  password: "",
};

function formatStatus(status: FranchiseStatus) {
  if (status === "active") return "Ativa";
  if (status === "inactive") return "Inativa";
  return "Pendente";
}

function formatDate(date: string | null) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

export default function FranqueadosPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userSubmitting, setUserSubmitting] = useState(false);
  const [editingFranchiseId, setEditingFranchiseId] = useState<number | null>(null);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [userFormData, setUserFormData] = useState<UserFormData>(initialUserFormData);

  async function loadFranchises() {
    try {
      setLoading(true);
      setErrorMessage("");
      const data = await listFranchises();
      setFranchises(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as franquias.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFranchises();
  }, []);

  const filtered = useMemo(() => {
    return franchises.filter((franchise) => {
      const normalizedSearch = search.toLowerCase();

      const matchSearch =
        franchise.trade_name.toLowerCase().includes(normalizedSearch) ||
        franchise.corporate_name.toLowerCase().includes(normalizedSearch) ||
        franchise.contact_name.toLowerCase().includes(normalizedSearch) ||
        franchise.contact_email.toLowerCase().includes(normalizedSearch) ||
        franchise.city.toLowerCase().includes(normalizedSearch);

      const statusLabel = formatStatus(franchise.status);
      const matchFilter = filter === "Todas" || statusLabel === filter;

      return matchSearch && matchFilter;
    });
  }, [franchises, search, filter]);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateUserField<K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ) {
    setUserFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingFranchiseId(null);
  }

  function resetUserForm() {
    setUserFormData(initialUserFormData);
    setSelectedFranchise(null);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEditModal(franchise: Franchise) {
    setEditingFranchiseId(franchise.id);
    setFormData({
      corporate_name: franchise.corporate_name,
      trade_name: franchise.trade_name,
      cnpj: franchise.cnpj ?? "",
      contact_name: franchise.contact_name,
      contact_email: franchise.contact_email,
      contact_phone: franchise.contact_phone ?? "",
      city: franchise.city,
      state: franchise.state,
      status: franchise.status,
      join_date: franchise.join_date ?? "",
      notes: franchise.notes ?? "",
    });
    setIsModalOpen(true);
  }

  function openUserModal(franchise: Franchise) {
    setSelectedFranchise(franchise);
    setUserFormData({
      full_name: franchise.contact_name ?? "",
      email: franchise.contact_email ?? "",
      password: "",
    });
    setIsUserModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setIsModalOpen(false);
    resetForm();
  }

  function closeUserModal() {
    if (userSubmitting) return;
    setIsUserModalOpen(false);
    resetUserForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (editingFranchiseId) {
        const updated = await updateFranchise(editingFranchiseId, {
          corporate_name: formData.corporate_name,
          trade_name: formData.trade_name,
          cnpj: formData.cnpj || null,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          city: formData.city,
          state: formData.state,
          status: formData.status,
          join_date: formData.join_date || null,
          notes: formData.notes || null,
        });

        setFranchises((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const created = await createFranchise({
          corporate_name: formData.corporate_name,
          trade_name: formData.trade_name,
          cnpj: formData.cnpj || null,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          city: formData.city,
          state: formData.state,
          status: formData.status,
          join_date: formData.join_date || null,
          notes: formData.notes || null,
          is_active: true,
        });

        setFranchises((prev) => [created, ...prev]);
      }

      closeModal();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível salvar.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(franchise: Franchise) {
    const confirmed = window.confirm(
      `Deseja inativar a franquia "${franchise.trade_name}"?`
    );

    if (!confirmed) return;

    try {
      const deleted = await deleteFranchise(franchise.id);

      setFranchises((prev) =>
        prev.map((item) => (item.id === deleted.id ? deleted : item))
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível remover.";
      setErrorMessage(message);
    }
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFranchise) return;

    setUserSubmitting(true);
    setErrorMessage("");

    try {
      await createUser({
        full_name: userFormData.full_name,
        email: userFormData.email,
        password: userFormData.password,
        role: "franchisee",
        franchise_id: selectedFranchise.id,
        is_active: true,
      });

      closeUserModal();
      alert("Usuário franqueado criado com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível criar o usuário.";
      setErrorMessage(message);
    } finally {
      setUserSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6 pb-24 md:p-8 md:pb-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Gerenciar Franqueados
        </h1>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          + Adicionar Franqueado
        </button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Buscar franquias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Todas">Todas as Franquias</option>
          <option value="Ativa">Ativa</option>
          <option value="Pendente">Pendente</option>
          <option value="Inativa">Inativa</option>
        </select>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Franquia
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Contato
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Cidade
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Data de Entrada
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    Carregando franquias...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((franchise) => (
                  <tr
                    key={franchise.id}
                    className="border-b border-border transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {franchise.trade_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {franchise.corporate_name}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {franchise.contact_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {franchise.contact_email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      {franchise.city}/{franchise.state}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          franchise.status === "active"
                            ? "bg-green-100 text-green-700"
                            : franchise.status === "inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {formatStatus(franchise.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(franchise.join_date)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(franchise)}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => openUserModal(franchise)}
                          className="text-sm font-semibold text-emerald-700 hover:underline"
                        >
                          Criar Usuário
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(franchise)}
                          className="text-sm font-semibold text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    Nenhuma franquia encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingFranchiseId ? "Editar Franqueado" : "Cadastrar Franqueado"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Razão social</label>
                <input
                  type="text"
                  value={formData.corporate_name}
                  onChange={(e) => updateField("corporate_name", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Nome fantasia</label>
                <input
                  type="text"
                  value={formData.trade_name}
                  onChange={(e) => updateField("trade_name", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">CNPJ</label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => updateField("cnpj", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Responsável</label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => updateField("contact_name", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => updateField("contact_email", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Telefone</label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => updateField("contact_phone", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Cidade</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value.toUpperCase())}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value as FranchiseStatus)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="pending">Pendente</option>
                  <option value="active">Ativa</option>
                  <option value="inactive">Inativa</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Data de entrada</label>
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => updateField("join_date", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  rows={4}
                />
              </div>

              <div className="mt-2 flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2 font-medium"
                  disabled={submitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2 font-medium text-white disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting
                    ? "Salvando..."
                    : editingFranchiseId
                    ? "Salvar Alterações"
                    : "Salvar Franqueado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isUserModalOpen && selectedFranchise ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Criar Usuário da Franquia
              </h2>

              <button
                type="button"
                onClick={closeUserModal}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Fechar
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-muted/40 p-3 text-sm">
              <strong>Franquia:</strong> {selectedFranchise.trade_name}
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nome completo</label>
                <input
                  type="text"
                  value={userFormData.full_name}
                  onChange={(e) => updateUserField("full_name", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => updateUserField("email", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Senha</label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => updateUserField("password", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="rounded-lg border px-4 py-2 font-medium"
                  disabled={userSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white disabled:opacity-60"
                  disabled={userSubmitting}
                >
                  {userSubmitting ? "Criando..." : "Criar Usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}