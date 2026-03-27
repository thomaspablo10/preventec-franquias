"use client";

import { useState } from "react";

type RoleOption = "ADMIN" | "EDITOR" | "REVIEWER";

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
};

export function CreateUserForm({ onCreated }: CreateUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleOption>("EDITOR");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-900">Novo usuário</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Crie administradores, editores ou revisores.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            placeholder="Nome completo"
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
            placeholder="email@dominio.com"
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
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
          >
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="REVIEWER">Revisor</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Senha inicial
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            placeholder="Digite a senha inicial"
            required
          />
        </div>

        {(error || message) && (
          <div className="md:col-span-2">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}