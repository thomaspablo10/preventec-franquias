import { StudioHeader } from "@/components/studio/header";
import { InvitationEventForm } from "@/components/studio/invitation-event-form";
import { requireStudioRole } from "@/lib/permissions";

export default async function StudioNovoConvitePage() {
  const session = await requireStudioRole(["MASTER", "ADMIN"]);

  return (
    <main className="space-y-6">
      <StudioHeader
        title="Novo evento"
        description="Crie um novo evento e gere o link público do convite."
        name={session.name}
        role={session.role}
      />

      <section className="rounded-[28px] border border-[#d8e7f5] bg-white p-6 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
        <InvitationEventForm />
      </section>
    </main>
  );
}