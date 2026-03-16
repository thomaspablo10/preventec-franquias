"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn || !user) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        router.replace("/admin");
        return;
      }

      router.replace("/portal");
    }
  }, [loading, isLoggedIn, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}