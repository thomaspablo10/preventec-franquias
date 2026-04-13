"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteInvitationEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Deseja realmente apagar este evento?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/studio/invitation-events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível apagar o evento.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao apagar evento.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-70"
    >
      {isDeleting ? "Apagando..." : "Apagar evento"}
    </button>
  );
}