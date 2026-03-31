"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { CreateUserForm } from "@/components/studio/create-user-form";
import { EditUserModal } from "@/components/studio/edit-user-modal";

type RoleOption = "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type UsersTableProps = {
  initialUsers: UserItem[];
  currentUserId: string;
  currentUserRole: RoleOption;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function roleLabel(role: RoleOption) {
  if (role === "MASTER") return "Master";
  if (role === "ADMIN") return "Admin";
  if (role === "EDITOR") return "Editor";
  return "Revisor";
}

export function UsersTable({
  initialUsers,
  currentUserId,
  currentUserRole,
}: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  function handleCreated(user: UserItem) {
    setUsers((current) => [user, ...current]);
  }

  function handleSaved(updatedUser: UserItem) {
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  }

  async function handleToggleStatus(userId: string) {
    setLoadingId(userId);

    try {
      const response = await fetch(`/api/studio/users/${userId}/toggle-status`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao alterar status.");
        return;
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? data.user : user))
      );
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDeleteUser(user: UserItem) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o usuário "${user.name}"?\n\nEssa ação não poderá ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    setLoadingId(user.id);

    try {
      const response = await fetch(`/api/studio/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao excluir usuário.");
        return;
      }

      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[#e6eef8] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="text-xl font-semibold text-[#16324f]">Usuários</h2>
            <p className="mt-1 text-sm text-slate-600">
              Lista de acessos do Studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#d8e7f5] bg-[#f3f8ff] px-3 py-1 text-xs font-semibold text-[#3157c8]">
              {users.length} usuário(s)
            </span>

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4169E1] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3157c8]"
            >
              <Plus className="h-4 w-4" />
              Novo usuário
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-3 py-3 md:px-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#e8eef7] text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Nome
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  E-mail
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Perfil
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Criado em
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                const isMasterUser = user.role === "MASTER";
                const canEdit =
                  loadingId !== user.id &&
                  !(isMasterUser && currentUserRole !== "MASTER");

                const canToggle =
                  loadingId !== user.id &&
                  !isSelf &&
                  !(isMasterUser && currentUserRole !== "MASTER");

                const canDelete =
                  currentUserRole === "MASTER" &&
                  !isSelf &&
                  !isMasterUser;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#edf3fb] transition hover:bg-[#f8fbff]"
                  >
                    <td className="px-4 py-4 text-sm text-slate-900">
                      <div className="font-semibold">{user.name}</div>
                      {isSelf ? (
                        <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          Você
                        </span>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#3157c8]">
                        {roleLabel(user.role)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {user.isActive ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Ativo
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Inativo
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          disabled={!canEdit}
                          className="rounded-xl border border-[#cfe0ef] bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#f5f9ff] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={!canToggle}
                          className="rounded-xl border border-[#cfe0ef] bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#f5f9ff] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadingId === user.id
                            ? "Processando..."
                            : user.isActive
                            ? "Desativar"
                            : "Ativar"}
                        </button>

                        {canDelete ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={loadingId === user.id}
                            className="rounded-xl border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {loadingId === user.id ? "Excluindo..." : "Excluir"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_20px_60px_rgba(15,46,95,0.22)]">
            <div className="flex items-start justify-between border-b border-[#e6eef8] bg-gradient-to-r from-[#f7fbff] to-white px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-[#16324f]">
                  Novo usuário
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Cadastre um novo acesso para o Studio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e7f5] bg-white text-slate-500 transition hover:bg-[#f5f9ff] hover:text-slate-700"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              <CreateUserForm
                onCreated={handleCreated}
                currentUserRole={currentUserRole}
                onClose={() => setCreateOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}

      <EditUserModal
        user={editingUser}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}