import { notFound } from "next/navigation";
import { StudioHeader } from "@/components/studio/header";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { InvitationEventEditForm } from "@/components/studio/invitation-event-edit-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudioEditarConvitePage({ params }: PageProps) {
  const session = await requireStudioRole(["MASTER", "ADMIN"]);
  const { id } = await params;

  const event = await prisma.invitationEvent.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <StudioHeader
        title="Editar evento"
        description="Atualize as informações do evento."
        name={session.name}
        role={session.role}
      />

      <section className="rounded-[28px] border border-[#d8e7f5] bg-white p-6 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
        <InvitationEventEditForm
          event={{
            id: event.id,
            slug: event.slug,
            title: event.title,
            hostName: event.hostName ?? "",
            description: event.description ?? "",
            eventDate: new Intl.DateTimeFormat("sv-SE", {
              timeZone: "America/Cuiaba",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
              .format(event.eventDate)
              .replace(" ", "T"),
            locationName: event.locationName,
            address: event.address,
            mapsUrl: event.mapsUrl ?? "",
            isActive: event.isActive,
          }}
        />
      </section>
    </main>
  );
}