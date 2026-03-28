import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const experienceYears = new Date().getFullYear() - 1998

const differentials = [
  "Metodologia proprietária e processos auditados",
  "Sistema de gestão exclusivo para unidades",
  "Central de relacionamento com clientes",
  "Equipe de marketing e comunicação dedicada",
  "Atualização constante com mudanças na legislação",
];

export function AboutPreviewSection() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/about-team.jpg"
                alt="Equipe Preventec"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-xl hidden sm:block">
              <p className="text-3xl font-bold">{`${experienceYears}`}+</p>
              <p className="text-sm text-white/80 mt-1">Anos de<br />experiência</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Sobre a Preventec</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance mb-6">
              Uma rede construída sobre expertise e confiança
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A Preventec Franquias nasceu da experiência acumulada de mais de {`${experienceYears}`} anos no setor de Medicina e Segurança do Trabalho. Fundada em 1998, desenvolvemos um modelo de franquia robusto que permite empreendedores de todo o Brasil oferecer serviços de alta qualidade com processos padronizados.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nossa rede atende empresas de todos os portes, de startups a grandes corporações, cumprindo todas as exigências legais e promovendo ambientes de trabalho mais seguros e saudáveis.
            </p>

            <ul className="space-y-3 mb-10">
              {differentials.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-foreground/80 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild>
              <Link href="/sobre">
                Conhecer nossa história
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
