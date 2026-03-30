"use client";

import { useEffect, useMemo, useState } from "react";

type RoleOption = "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type EditUserModalProps = {
  user: UserItem | null;
  currentUserId: string;
  currentUserRole: RoleOption;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (user: UserItem) => void;
};

export function EditUserModal({
  user,
  currentUserId,
  currentUserRole,
  isOpen,
  onClose,
  onSaved,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleOption>("EDITOR");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableRoles = useMemo(() => {
    if (currentUserRole === "MASTER") {
      return ["MASTER", "ADMIN", "EDITOR", "REVIEWER"] as RoleOption[];
    }

    return ["ADMIN", "EDITOR", "REVIEWER"] as RoleOption[];
  }, [currentUserRole]);

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword("");
    setError("");
  }, [user]);

  if (!isOpen || !user) {
    return null;
  }

  const isEditingSelf = user.id === currentUserId;
  const roleLocked =
    (user.role === "MASTER" && currentUserRole !== "MASTER") ||
    (isEditingSelf && user.role === "MASTER");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/studio/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
          password: password || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao editar usuário.");
        setLoading(false);
        return;
      }

      onSaved(data.user);
      onClose();
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-zinc-900">Editar usuário</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Atualize nome, e-mail, perfil e senha, se necessário.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Perfil
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as RoleOption)}
              disabled={roleLocked}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500 disabled:bg-zinc-100"
            >
              {availableRoles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption === "MASTER"
                    ? "Master"
                    : roleOption === "ADMIN"
                    ? "Admin"
                    : roleOption === "EDITOR"
                    ? "Editor"
                    : "Revisor"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nova senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              placeholder="Deixe em branco para manter"
            />
          </div>

          {error ? (
            <div className="md:col-span-2">
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            </div>
          ) : null}

          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}