import Link from "next/link";
import { StudioHeader } from "@/components/studio/header";
import { DeleteInvitationEventButton } from "@/components/studio/delete-invitation-event-button";
import { requireStudioRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Cuiaba",
  }).format(date);
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function StudioConvitesPage() {
  const session = await requireStudioRole(["MASTER", "ADMIN"]);

  const events = await prisma.invitationEvent.findMany({
    orderBy: {
      eventDate: "desc",
    },
    include: {
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  return (
    <main className="space-y-6">
      <StudioHeader
        title="Convites"
        description="Gerencie os eventos e acesse os links públicos de cada convite."
        name={session.name}
        role={session.role}
      />

      <div className="flex justify-end">
        <Link
          href="/studio/convites/new"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4169E1] px-6 text-sm font-semibold text-white transition hover:bg-[#3157c8]"
        >
          Novo evento
        </Link>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
        <div className="border-b border-[#e6eef8] px-6 py-5">
          <h2 className="text-xl font-semibold text-[#16324f]">Eventos</h2>
        </div>

        <div className="overflow-x-auto px-4 py-3">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#e8eef7] text-left">
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Evento
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Data
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Status
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Confirmações
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Link
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                    Nenhum evento criado ainda.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[#edf3fb] transition hover:bg-[#f8fbff]"
                  >
                    <td className="px-3 py-4 align-top">
                      <div className="font-semibold text-[#16324f]">{event.title}</div>
                      <div className="text-sm text-slate-500">{event.locationName}</div>
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-slate-600">
                      {formatDate(event.eventDate)}
                    </td>

                    <td className="px-3 py-4 align-top text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          event.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {event.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-slate-600">
                      {event._count.submissions}
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-slate-600">
                      <div className="max-w-[280px] truncate">{`${baseUrl}/convite/${event.slug}`}</div>
                    </td>

                    <td className="px-3 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/studio/convites/${event.id}`}
                          className="rounded-xl border border-[#d8e7f5] px-3 py-2 text-sm font-semibold text-[#16324f]"
                        >
                          Ver confirmações
                        </Link>

                        <Link
                          href={`/studio/convites/${event.id}/edit`}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700"
                        >
                          Editar evento
                        </Link>

                        <DeleteInvitationEventButton eventId={event.id} />

                        <a
                          href={`/convite/${event.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-[#4169E1] px-3 py-2 text-sm font-semibold text-white"
                        >
                          Abrir link
                        </a>
                      </div>
                    </td>
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