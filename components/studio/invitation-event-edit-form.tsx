"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EventFormData = {
  id: string;
  slug: string;
  title: string;
  hostName: string;
  description: string;
  eventDate: string;
  locationName: string;
  address: string;
  mapsUrl: string;
  isActive: boolean;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function InvitationEventEditForm({ event }: { event: EventFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>(event);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/studio/invitation-events/${form.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          hostName: form.hostName,
          description: form.description,
          eventDate: form.eventDate,
          locationName: form.locationName,
          address: form.address,
          mapsUrl: form.mapsUrl,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível atualizar o evento.");
      }

      setStatus({
        type: "success",
        message: data.message || "Evento atualizado com sucesso.",
      });

      router.push(`/studio/convites/${form.id}`);
      router.refresh();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Erro ao atualizar evento.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#16324f]">Título do evento</label>
          <input
            value={form.title}
            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
            className="h-12 w-full rounded-2xl border border-[#d8e7f5] px-4 outline-none focus:border-[#4169E1]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#16324f]">Slug</label>
          <div className="flex gap-2">
            <input
              value={form.slug}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  slug: slugify(e.target.value),
                }))
              }
              className="h-12 w-full rounded-2xl border border-[#d8e7f5] px-4 outline-none focus:border-[#4169E1]"
              required
            />
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  slug: slugify(current.title),
                }))
              }
              className="rounded-2xl border border-[#d8e7f5] px-4 text-sm font-semibold text-[#16324f]"
            >
              Gerar
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#16324f]">Data e horário</label>
          <input
            type="datetime-local"
            value={form.eventDate}
            onChange={(e) => setForm((current) => ({ ...current, eventDate: e.target.value }))}
            className="h-12 w-full rounded-2xl border border-[#d8e7f5] px-4 outline-none focus:border-[#4169E1]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#16324f]">Local</label>
          <input
            value={form.locationName}
            onChange={(e) =>
              setForm((current) => ({ ...current, locationName: e.target.value }))
            }
            className="h-12 w-full rounded-2xl border border-[#d8e7f5] px-4 outline-none focus:border-[#4169E1]"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#16324f]">Endereço</label>
        <input
          value={form.address}
          onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
          className="h-12 w-full rounded-2xl border border-[#d8e7f5] px-4 outline-none focus:border-[#4169E1]"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#16324f]">Link do Maps</label>
        <input
          value={form.mapsUrl}
          onChange={(e) => setForm((current) => ({ ...current, mapsUrl: e.target.value }))}
          className="h-12 w-full rounded-2xl border border-[#d8e7f5] px-4 outline-none focus:border-[#4169E1]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#16324f]">Descrição</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((current) => ({ ...current, description: e.target.value }))
          }
          rows={5}
          className="w-full rounded-2xl border border-[#d8e7f5] px-4 py-3 outline-none focus:border-[#4169E1]"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-[#16324f]">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm((current) => ({ ...current, isActive: e.target.checked }))}
        />
        Evento ativo
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4169E1] px-6 text-sm font-semibold text-white transition hover:bg-[#3157c8] disabled:opacity-70"
      >
        {isSubmitting ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
      </button>

      {status.type !== "idle" && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}