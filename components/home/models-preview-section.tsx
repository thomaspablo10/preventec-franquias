import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const models = [
  {
    name: "Medicina do Trabalho",
    tag: "Modalidade 1",
    description: "Ideal para iniciar no setor com foco em saúde ocupacional e gestão médica dos trabalhadores.",
    color: "border-blue-200 bg-blue-50",
    tagColor: "bg-blue-100 text-blue-700",
    services: [
      "PCMSO (Programa de Controle Médico)",
      "ASO (Atestado de Saúde Ocupacional)",
      "Gestão de saúde ocupacional",
      "Acompanhamento médico ocupacional",
    ],
  },
  {
    name: "Medicina e Segurança do Trabalho",
    tag: "Modalidade 2",
    description: "Solução completa integrando medicina e segurança para empresas que buscam conformidade total.",
    color: "border-primary bg-primary",
    tagColor: "bg-white/20 text-white",
    highlight: true,
    services: [
      "Tudo da Modalidade 1, mais:",
      "PGR (Programa de Gerenciamento de Riscos)",
      "LTCAT (Laudo Técnico das Condições Ambientais)",
      "Consultoria em segurança do trabalho",
      "Gestão de SST",
      "Programas obrigatórios NR",
    ],
  },
  {
    name: "Medicina + Segurança + Exames",
    tag: "Modalidade 3",
    description: "A solução mais abrangente, com exames complementares completos e maior ticket médio.",
    color: "border-red-200 bg-red-50",
    tagColor: "bg-red-100 text-red-700",
    services: [
      "Tudo da Modalidade 2, mais:",
      "Coleta laboratorial",
      "Acuidade visual",
      "Raio-X ocupacional",
      "Eletrocardiograma",
      "Eletroencefalograma",
      "Dinamometria palmar",
      "Testes: Ishihara, Romberg, Epworth",
    ],
  },
];

export function ModelsPreviewSection() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Modalidades</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            As 3 modalidades de franquia
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Escolha o modelo que melhor se adapta ao seu perfil de investimento e ao mercado da sua região.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {models.map((model, idx) => (
            <div
              key={model.name}
              className={cn(
                "relative rounded-2xl border-2 p-8 flex flex-col",
                model.color,
                model.highlight && "scale-105 shadow-2xl z-10"
              )}
            >
              {model.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d42b2b] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              <div className={cn("text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider", model.tagColor)}>
                {model.tag}
              </div>

              <h3 className={cn("text-xl font-bold mb-3", model.highlight ? "text-white" : "text-foreground")}>
                {model.name}
              </h3>

              <p className={cn("text-sm leading-relaxed mb-6", model.highlight ? "text-white/80" : "text-muted-foreground")}>
                {model.description}
              </p>

              <ul className="space-y-3 flex-1">
                {model.services.map((service, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0", model.highlight ? "text-green-300" : "text-primary")} />
                    <span className={cn("text-sm", model.highlight ? "text-white/90" : "text-foreground/80")}>
                      {service}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className={cn(
                    "w-full",
                    model.highlight
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary hover:bg-primary/90 text-white"
                  )}
                >
                  <Link href="/modalidades">Ver detalhes</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/modalidades">
              Comparar todas as modalidades
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
