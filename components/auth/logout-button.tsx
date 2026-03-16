"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Sair
    </button>
  );
}