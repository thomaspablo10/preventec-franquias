import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InvitationExperience } from "@/components/invite/invitation-experience";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const event = await prisma.invitationEvent.findFirst({
    where: {
        slug,
        isActive: true,
        eventDate: {
        gte: new Date(),
        },
    },
    select: {
      title: true,
    },
  });

  if (!event) {
    return {
      title: "Convite não encontrado",
    };
  }

  return {
    title: `Convite | ${event.title}`,
    description: `Confirmação de presença para ${event.title}.`,
  };
}

export default async function ConviteEventoPage({ params }: PageProps) {
  const { slug } = await params;

  const event = await prisma.invitationEvent.findFirst({
    where: {
      slug,
      isActive: true,
    },
    select: {
      slug: true,
      title: true,
      hostName: true,
      description: true,
      eventDate: true,
      locationName: true,
      address: true,
      mapsUrl: true,
    },
  });

  if (!event) {
    notFound();
  }

  const eventData = {
    slug: event.slug,
    title: event.title,
    hostName: event.hostName ?? null,
    description: event.description ?? null,
    eventDate: event.eventDate.toISOString(),
    locationName: event.locationName,
    address: event.address,
    mapsUrl: event.mapsUrl ?? null,
  };

  return <InvitationExperience event={eventData} />;
}