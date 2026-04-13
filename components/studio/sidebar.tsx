"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  UserCircle2,
  Menu,
  X,
  Mailbox,
} from "lucide-react";

type StudioSidebarProps = {
  role: "MASTER" | "ADMIN" | "EDITOR" | "REVIEWER";
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
};

export function StudioSidebar({ role }: StudioSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const items: NavItem[] = [
    {
      href: "/studio/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      href: "/studio/posts",
      label: "Posts",
      icon: FileText,
      visible: true,
    },
    {
      href: "/studio/profile",
      label: "Meu perfil",
      icon: UserCircle2,
      visible: true,
    },
    {
      href: "/studio/users",
      label: "Usuários",
      icon: Users,
      visible: role === "MASTER" || role === "ADMIN",
    },
    {
      href: "/studio/convites",
      label: "Convites",
      icon: Mailbox,
      visible: role === "MASTER" || role === "ADMIN",
    },
    {
      href: "/studio/master",
      label: "Master",
      icon: Shield,
      visible: role === "MASTER",
    },
  ];

  const visibleItems = items.filter((item) => item.visible);

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-xl bg-[#4169E1] text-white shadow-md transition hover:bg-[#3157c8]"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-[#dbe4ff] bg-[#4169E1] text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/15 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Image
                  src="/images/logo-square.png"
                  alt="Logo Preventec"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-white">Studio</h2>
                <p className="text-sm text-white/85">Painel editorial</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <div className="space-y-2">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-[#4169E1]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}