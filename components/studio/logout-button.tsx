export function StudioLogoutButton() {
  return (
    <form action="/api/studio/logout" method="POST">
      <button
        type="submit"
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Sair
      </button>
    </form>
  );
}