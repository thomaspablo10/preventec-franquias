import { StudioLogoutButton } from "@/components/studio/logout-button";
import { ShieldCheck, UserRound } from "lucide-react";

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
    <div className="mb-6 rounded-[28px] border border-[#d8e7f5] bg-white shadow-[0_10px_30px_rgba(13,59,102,0.08)]">
      <div className="flex flex-col gap-5 px-5 py-5 md:px-7 md:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center rounded-full border border-[#d8e7f5] bg-[#eef6fd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0d5ea8]">
            Studio Preventec
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#16324f] md:text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#d8e7f5] bg-[#f7fbff] px-4 py-3 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-[#0d5ea8]" />
              <span className="font-medium text-slate-800">{name}</span>
            </div>

            <span className="hidden text-slate-300 md:inline">|</span>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#0d5ea8]" />
              <span className="font-medium text-slate-800">{role}</span>
            </div>
          </div>

          <StudioLogoutButton />
        </div>
      </div>
    </div>
  );
}