import Link from "next/link";

type StudioSidebarProps = {
  role: "ADMIN" | "EDITOR" | "REVIEWER";
};

export function StudioSidebar({ role }: StudioSidebarProps) {
  return (
    <aside className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:w-64">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-900">Studio</h2>
        <p className="text-sm text-zinc-500">Painel editorial</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href="/studio/dashboard"
          className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          Dashboard
        </Link>

        <Link
          href="/studio/posts"
          className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          Posts
        </Link>

        {(role === "ADMIN" || role === "REVIEWER") && (
          <Link
            href="/studio/review"
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Revisão
          </Link>
        )}

        <Link
          href="/studio/profile"
          className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          Meu perfil
        </Link>

        {role === "ADMIN" && (
          <Link
            href="/studio/users"
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Usuários
          </Link>
        )}
      </nav>
    </aside>
  );
}