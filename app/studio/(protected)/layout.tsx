import { ReactNode } from "react";
import { requireStudioSession } from "@/lib/permissions";
import { StudioSidebar } from "@/components/studio/sidebar";

export default async function StudioProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireStudioSession();

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <StudioSidebar role={session.role} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}