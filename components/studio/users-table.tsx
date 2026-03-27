"use client";

import { useState } from "react";
import { CreateUserForm } from "@/components/studio/create-user-form";

type RoleOption = "ADMIN" | "EDITOR" | "REVIEWER";

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
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function roleLabel(role: RoleOption) {
  if (role === "ADMIN") return "Admin";
  if (role === "EDITOR") return "Editor";
  return "Revisor";
}

export function UsersTable({
  initialUsers,
  currentUserId,
}: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleCreated(user: UserItem) {
    setUsers((current) => [user, ...current]);
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

  return (
    <div className="space-y-6">
      <CreateUserForm onCreated={handleCreated} />

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
              {users.map((user) => (
                <tr key={user.id} className="bg-zinc-50">
                  <td className="rounded-l-xl px-3 py-3 text-sm font-medium text-zinc-900">
                    {user.name}
                    {user.id === currentUserId ? (
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
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={loadingId === user.id || user.id === currentUserId}
                      className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loadingId === user.id
                        ? "Processando..."
                        : user.isActive
                        ? "Desativar"
                        : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}

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
    </div>
  );
}