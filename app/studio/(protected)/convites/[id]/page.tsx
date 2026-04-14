import { notFound } from "next/navigation";
import Link from "next/link";
import { StudioHeader } from "@/components/studio/header";
import { InvitationsExportActions } from "@/components/studio/invitations-export-actions";
import { DeleteInvitationEventButton } from "@/components/studio/delete-invitation-event-button";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Cuiaba",
  }).format(date);
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function StudioConviteEventoPage({ params }: PageProps) {
  const session = await requireStudioRole(["MASTER", "ADMIN"]);
  const { id } = await params;

  const event = await prisma.invitationEvent.findUnique({
    where: { id },
    include: {
      submissions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const totalPessoas = event.submissions.reduce((total, item) => {
    return total + 1 + (item.companionName ? 1 : 0);
  }, 0);

  const publicUrl = `${baseUrl}/convite/${event.slug}`;

  return (
    <main className="space-y-6">
      <StudioHeader
        title={event.title}
        description="Acompanhe as confirmações deste evento."
        name={session.name}
        role={session.role}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="text-sm font-semibold text-slate-500">Confirmações</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-[#16324f]">
            {event.submissions.length}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="text-sm font-semibold text-slate-500">Pessoas confirmadas</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-[#16324f]">
            {totalPessoas}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#d8e7f5] bg-white p-5 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
          <div className="text-sm font-semibold text-slate-500">Link público</div>
          <div className="mt-3 break-all text-sm text-slate-600">{publicUrl}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#4169E1] px-3 py-2 text-sm font-semibold text-white"
            >
                Abrir convite
            </a>

            <Link
                href={`/studio/convites/${event.id}/edit`}
                className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700"
            >
                Editar evento
            </Link>

            <DeleteInvitationEventButton eventId={event.id} />

            <Link
                href="/studio/convites"
                className="rounded-xl border border-[#d8e7f5] px-3 py-2 text-sm font-semibold text-[#16324f]"
            >
                Voltar
            </Link>
            </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#d8e7f5] bg-white p-6 shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-500">Data</div>
            <div className="mt-1 text-[#16324f]">{formatDate(event.eventDate)}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-500">Local</div>
            <div className="mt-1 text-[#16324f]">{event.locationName}</div>
          </div>

          <div className="md:col-span-2">
            <div className="text-sm font-semibold text-slate-500">Endereço</div>
            <div className="mt-1 text-[#16324f]">{event.address}</div>
          </div>
        </div>

        <div className="mt-6">
          <InvitationsExportActions
            title={event.title}
            rows={event.submissions.map((item) => ({
              id: item.id,
              name: item.name,
              phone: item.phone,
              company: item.company,
              companionName: item.companionName,
              createdAt: item.createdAt.toISOString(),
            }))}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
        <div className="border-b border-[#e6eef8] px-6 py-5">
          <h2 className="text-xl font-semibold text-[#16324f]">Lista de confirmações</h2>
        </div>

        <div className="overflow-x-auto px-4 py-3">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#e8eef7] text-left">
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Nome</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Telefone</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Empresa</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Acompanhante</th>
              </tr>
            </thead>

            <tbody>
              {event.submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-sm text-slate-500">
                    Nenhuma confirmação recebida ainda.
                  </td>
                </tr>
              ) : (
                event.submissions.map((item) => (
                  <tr key={item.id} className="border-b border-[#edf3fb] transition hover:bg-[#f8fbff]">
                    <td className="px-3 py-4 align-top">
                      <div className="font-semibold text-[#16324f]">{item.name}</div>
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-slate-600">{item.phone}</td>
                    <td className="px-3 py-4 align-top text-sm text-slate-600">{item.company}</td>
                    <td className="px-3 py-4 align-top text-sm text-slate-600">{item.companionName || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}