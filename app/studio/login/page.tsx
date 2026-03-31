import { StudioLoginForm } from "@/components/studio/login-form";

export default function StudioLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#4169E1] via-[#6f8df0] to-[#ffffff] px-4 py-10">
      <div className="relative z-10 w-full">
        <StudioLoginForm />
      </div>
    </main>
  );
}