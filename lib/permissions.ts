import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export type StudioRole = "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";

export async function requireStudioSession() {
  const session = await getSession();

  if (!session) {
    redirect("/studio/login");
  }

  return session;
}

export async function requireStudioRole(allowedRoles: StudioRole[]) {
  const session = await requireStudioSession();

  if (session.role === "MASTER") {
    return session;
  }

  if (!allowedRoles.includes(session.role)) {
    redirect("/studio/dashboard");
  }

  return session;
}