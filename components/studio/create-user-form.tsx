"use client";

import { useMemo, useState } from "react";

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

type CreateUserFormProps = {
  onCreated: (user: UserItem) => void;
  currentUserRole: RoleOption;
  onClose?: () => void;
};

export function CreateUserForm({
  onCreated,
  currentUserRole,
  onClose,
}: CreateUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleOption>("EDITOR");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const availableRoles = useMemo(() => {
    if (currentUserRole === "MASTER") {
      return ["MASTER", "ADMIN", "EDITOR", "REVIEWER"] as RoleOption[];
    }

    return ["ADMIN", "EDITOR", "REVIEWER"] as RoleOption[];
  }, [currentUserRole]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/studio/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar usuário.");
        return;
      }

      onCreated(data.user);

      setName("");
      setEmail("");
      setRole("EDITOR");
      setPassword("");
      setMessage("Usuário criado com sucesso.");

      setTimeout(() => {
        onClose?.();
      }, 400);
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#16324f]">
          Nome
        </label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
          placeholder="Nome completo"
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
          placeholder="email@dominio.com"
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
          className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
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
          Senha inicial
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
          placeholder="Digite a senha inicial"
          required
        />
      </div>

      {(error || message) && (
        <div className="md:col-span-2">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}
        </div>
      )}

      <div className="md:col-span-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-2xl border border-[#cfe0ef] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5f9ff]"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-[#4169E1] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3157c8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar usuário"}
        </button>
      </div>
    </form>
  );
}