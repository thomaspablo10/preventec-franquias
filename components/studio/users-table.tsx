"use client";

import { useState } from "react";
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
      <CreateUserForm
        onCreated={handleCreated}
        currentUserRole={currentUserRole}
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Usuários</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Lista de acessos do Studio.
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {users.length} usuário(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Nome
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  E-mail
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Criado em
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
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
                  <tr key={user.id} className="bg-zinc-50">
                    <td className="rounded-l-xl px-3 py-3 text-sm font-medium text-zinc-900">
                      {user.name}
                      {isSelf ? (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          Você
                        </span>
                      ) : null}
                    </td>

                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {user.email}
                    </td>

                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {roleLabel(user.role)}
                    </td>

                    <td className="px-3 py-3 text-sm">
                      {user.isActive ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Ativo
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                          Inativo
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3 text-sm text-zinc-700">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="rounded-r-xl px-3 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          disabled={!canEdit}
                          className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={!canToggle}
                          className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                            className="rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="px-3 py-8 text-center text-sm text-zinc-500"
                  >
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

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