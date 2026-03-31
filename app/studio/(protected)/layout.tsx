import { ReactNode } from "react";
import { requireStudioSession } from "@/lib/permissions";
import { StudioSidebar } from "@/components/studio/sidebar";
import { StudioSessionGuard } from "@/components/studio/session-guard";

export default async function StudioProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireStudioSession();

  return (
    <div className="min-h-screen bg-[#f4f8fb]">
      <StudioSessionGuard />

      <div className="relative min-h-screen">
        <StudioSidebar role={session.role} />

        <main className="min-h-screen w-full px-4 py-4 md:px-6 md:py-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}