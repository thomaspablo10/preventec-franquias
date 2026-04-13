import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ConviteIndexPage() {
  const event = await prisma.invitationEvent.findFirst({
    where: {
      isActive: true,
      eventDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      eventDate: "asc",
    },
    select: {
      slug: true,
    },
  });

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071a43] px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-semibold">
            Nenhum convite ativo no momento.
          </h1>
        </div>
      </main>
    );
  }

  redirect(`/convite/${event.slug}`);
}