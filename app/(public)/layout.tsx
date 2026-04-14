import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
{/*import { FloatingButtons } from "@/components/layout/floating-buttons";*/}
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Footer />
      {/*<FloatingButtons />*/}
    </>
  );
}
