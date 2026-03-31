"use client";

import Image from "next/image";
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
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="rounded-[30px] border border-white/70 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center justify-center rounded-[24px] bg-transparent">
            <Image
              src="/images/logo-square.png"
              alt="Logo Preventec"
              width={214}
              height={214}
              className="h-[214px] w-[214px] object-contain"
            />
          </div>

          <h1 className="text-[2.2rem] font-semibold text-[#16324f]">Studio</h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Acesse o painel editorial da Preventec.
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
            placeholder="seuemail@dominio.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-[#cfe0ef] bg-[#f8fbfe] px-4 py-3 text-slate-800 outline-none transition focus:border-[#4169E1] focus:bg-white focus:ring-4 focus:ring-[#4169E1]/10"
            placeholder="Sua senha"
            autoComplete="current-password"
            required
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#4169E1] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#3157c8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar no Studio"}
        </button>
      </form>
    </div>
  );
}