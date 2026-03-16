"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoggedIn, loading } = useAuth();

  const [accessCode, setAccessCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn && user) {
      if (user.role === "admin") {
        router.replace("/admin");
        return;
      }

      router.replace("/portal");
    }
  }, [loading, isLoggedIn, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const loggedUser = await login({
        access_code: accessCode,
        username,
        password,
      });

      if (loggedUser.role === "admin") {
        router.replace("/admin");
        return;
      }

      router.replace("/portal");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível entrar.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Entrar</h1>
        <p className="text-sm text-gray-600 mb-6">
          Acesse o portal Preventec Franquias.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access_code" className="mb-1 block text-sm font-medium">
              Código de acesso
            </label>
            <input
              id="access_code"
              type="text"
              className="w-full rounded-lg border px-3 py-2 outline-none"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Código da franquia"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              className="w-full rounded-lg border px-3 py-2 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border px-3 py-2 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}