import { StudioLogoutButton } from "@/components/studio/logout-button";

type StudioHeaderProps = {
  title: string;
  description?: string;
  name: string;
  role: string;
};

export function StudioHeader({
  title,
  description,
  name,
  role,
}: StudioHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-zinc-600">{description}</p>
        ) : null}
        <p className="mt-3 text-sm text-zinc-500">
          Usuário: <span className="font-medium text-zinc-800">{name}</span> · Perfil:{" "}
          <span className="font-medium text-zinc-800">{role}</span>
        </p>
      </div>

      <StudioLogoutButton />
    </div>
  );
}