import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl px-8 sm:px-16 py-16 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance mb-4">
              Pronto para abrir sua unidade Preventec?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Entre em contato agora e dê o primeiro passo para construir seu negócio no setor que mais cresce no Brasil.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-[#d42b2b] hover:bg-[#b01e1e] text-white h-14 px-8 text-base shadow-lg">
                <Link href="/contato">
                  Solicitar informações
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 h-14 px-8 text-base"
              >
                <Link href="/modalidades">Ver modalidades</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
