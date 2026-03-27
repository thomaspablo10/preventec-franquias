"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StudioLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Falha ao entrar.");
        return;
      }

      router.push(data.redirectTo || "/studio/dashboard");
      router.refresh();
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Studio</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Acesse o painel editorial.
        </p>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
          placeholder="seuemail@dominio.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
          placeholder="Sua senha"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}