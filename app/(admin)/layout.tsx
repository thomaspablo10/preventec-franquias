'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const adminNav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Franqueados', href: '/admin/franqueados' },
  { label: 'Documentos', href: '/admin/documentos' },
  { label: 'Suporte', href: '/admin/suporte' },
  { label: 'Relatórios', href: '/admin/relatorios' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn || !user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/portal');
    }
  }, [loading, isLoggedIn, user, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-xl font-bold text-primary">
            Preventec Admin
          </Link>

          <div className="flex items-center gap-6">
            <div className="text-sm">
              <p className="font-semibold text-foreground">{user.full_name}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r border-border bg-white md:block">
          <nav className="space-y-2 p-6">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2 transition-colors ${
                  pathname === item.href
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-64px)]">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-border bg-white md:hidden">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
              pathname === item.href
                ? 'border-t-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}