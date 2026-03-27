"use client";

import { useState } from "react";

type ProfileFormProps = {
  initialData: {
    name: string;
    email: string;
    publicName: string | null;
    jobTitle: string | null;
    role: string;
  };
};

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [name, setName] = useState(initialData.name);
  const [publicName, setPublicName] = useState(initialData.publicName ?? "");
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/studio/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          publicName,
          jobTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao salvar perfil.");
        return;
      }

      setMessage("Perfil atualizado com sucesso.");
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-900">Meu perfil</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Atualize os dados usados no Studio e na assinatura pública dos posts.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Nome interno
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
            value={initialData.email}
            disabled
            className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-zinc-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Nome público
          </label>
          <input
            type="text"
            value={publicName}
            onChange={(event) => setPublicName(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            placeholder="Nome que aparecerá no post"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Cargo
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            placeholder="Ex.: Engenheiro"
          />
        </div>

        {error ? (
          <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar perfil"}
          </button>
        </div>
      </form>
    </div>
  );
}