"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_20px_60px_rgba(15,46,95,0.22)]">
        <div className="flex items-start justify-between border-b border-[#e6eef8] bg-gradient-to-r from-[#f7fbff] to-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[#16324f]">Editar usuário</h2>
            <p className="mt-1 text-sm text-slate-600">
              Atualize nome, e-mail, perfil e senha, se necessário.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e7f5] bg-white text-slate-500 transition hover:bg-[#f5f9ff] hover:text-slate-700"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#16324f]">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#16324f]">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#16324f]">
              Perfil
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as RoleOption)}
              disabled={roleLocked}
              className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10 disabled:bg-slate-100"
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
            <label className="mb-2 block text-sm font-semibold text-[#16324f]">
              Nova senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
              placeholder="Deixe em branco para manter"
            />
          </div>

          {error ? (
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            </div>
          ) : null}

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#cfe0ef] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5f9ff]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#4169E1] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3157c8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}