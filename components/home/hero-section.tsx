import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const experienceYears = new Date().getFullYear() - 1998

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Medicina e Segurança do Trabalho"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2260]/90 via-[#1a3fa0]/80 to-[#1a3fa0]/40" />
      </div>

      {/* Decorative */}
      <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
        <div className="absolute top-1/4 right-16 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute top-1/3 right-24 w-48 h-48 rounded-full border border-white/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Oportunidade de Franquia Disponível
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6">
            Seja dono da sua própria unidade{" "}
            <span className="text-[#f97272]">Preventec</span>
          </h1>

          <p className="text-lg text-white/80 leading-relaxed mb-10 text-pretty max-w-xl">
            Construa um negócio sólido na área de Medicina e Segurança do
            Trabalho com o suporte de uma marca especializada e modelo comprovado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#d42b2b] hover:bg-[#b01e1e] text-white text-base h-14 px-8 shadow-lg"
            >
              <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeY3eCgRwrn1Hv1qpb4K63TXTDn7ealLrUqpQcivgnu0qHQQA/viewform?usp=publish-editor">
                Quero ser franqueado
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/50 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-base h-14 px-8"
            >
              <a href="https://wa.me/5566992605476" target="_blank" rel="noopener noreferrer">
                <Phone className="w-5 h-5 mr-2" />
                Falar com consultor
              </a>
            </Button>
          </div>

          {/* Stats */}
          {/* Números na página inicial */}
          {/*<div className="mt-16 grid grid-cols-3 gap-6 max-w-sm">
            {[
              { value: "50+", label: "Unidades ativas" },
              { value: `${experienceYears}+`, label: "Anos de mercado" },
              { value: "98%", label: "Satisfação" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>*/}
        </div>
      </div>
    </section>
  );
}
