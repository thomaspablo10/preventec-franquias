import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const models = [
  {
    id: "mod1",
    tag: "Modalidade 1",
    name: "Medicina do Trabalho",
    description: "Ideal para quem quer iniciar no setor com foco exclusivo em saúde ocupacional. Atende empresas que buscam conformidade com a NR-7 e PCMSO.",
    color: "border-blue-200",
    headerColor: "bg-blue-600",
    services: [
      { name: "PCMSO", desc: "Programa de Controle Médico de Saúde Ocupacional" },
      { name: "ASO", desc: "Atestado de Saúde Ocupacional (admissional, periódico, demissional)" },
      { name: "Gestão de saúde ocupacional", desc: "Monitoramento e gestão dos indicadores de saúde da empresa" },
      { name: "Acompanhamento médico ocupacional", desc: "Consultas e avaliações periódicas com médico do trabalho" },
    ],
  },
  {
    id: "mod2",
    tag: "Modalidade 2",
    name: "Medicina e Segurança do Trabalho",
    description: "A solução completa para empresas que precisam de conformidade integral com todas as normas regulamentadoras de SST.",
    color: "border-primary",
    headerColor: "bg-primary",
    highlight: true,
    services: [
      { name: "Todos os serviços da Modalidade 1", desc: "PCMSO, ASO, gestão e acompanhamento médico" },
      { name: "PGR", desc: "Programa de Gerenciamento de Riscos (substitui o antigo PPRA)" },
      { name: "LTCAT", desc: "Laudo Técnico das Condições Ambientais do Trabalho" },
      { name: "Consultoria em segurança do trabalho", desc: "Análise de riscos, acidentes e conformidade com NRs" },
      { name: "Gestão de SST", desc: "Sistema integrado de gestão em Saúde e Segurança no Trabalho" },
      { name: "Programas obrigatórios NR", desc: "Implementação de todos os programas exigidos pelas normas" },
    ],
  },
  {
    id: "mod3",
    tag: "Modalidade 3",
    name: "Medicina + Segurança + Exames",
    description: "O portfólio mais completo da rede, com exames complementares que aumentam o ticket médio e a fidelização de clientes.",
    color: "border-red-300",
    headerColor: "bg-[#d42b2b]",
    services: [
      { name: "Todos os serviços da Modalidade 2", desc: "Medicina do trabalho + Segurança do trabalho completa" },
      { name: "Coleta laboratorial", desc: "Coleta e processamento de exames de sangue e outros fluidos" },
      { name: "Acuidade visual", desc: "Exame de visão para NRs que exigem aptidão visual" },
      { name: "Raio-X ocupacional", desc: "Radiografias para atividades com exposição a agentes físicos" },
      { name: "Eletrocardiograma (ECG)", desc: "Avaliação cardíaca para funções de maior exigência física" },
      { name: "Eletroencefalograma (EEG)", desc: "Avaliação neurológica para funções que exigem atenção plena" },
      { name: "Dinamometria palmar", desc: "Avaliação de força de preensão manual" },
      { name: "Teste de Ishihara", desc: "Avaliação de visão de cores (daltonismo)" },
      { name: "Teste de Romberg", desc: "Avaliação de equilíbrio e coordenação motora" },
      { name: "Escala de Epworth", desc: "Avaliação de sonolência diurna para motoristas e operadores" },
    ],
  },
];

export default function ModalidadesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0f2260] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Modelos de Negócio</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white text-balance">
            Modalidades de Franquia
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
            Escolha o modelo que melhor se adequa ao seu perfil de investimento, ao mercado da sua região e à sua experiência.
          </p>
        </div>
      </section>

      {/* Progression Banner */}
      <section className="py-10 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Medicina do Trabalho
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
              + Segurança do Trabalho
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
              <span className="w-5 h-5 rounded-full bg-[#d42b2b] text-white text-xs flex items-center justify-center font-bold">3</span>
              + Exames Complementares
            </div>
          </div>
        </div>
      </section>

      {/* Models Detail */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {models.map((model, idx) => (
            <div
              key={model.id}
              className={cn(
                "rounded-2xl border-2 overflow-hidden shadow-sm",
                model.color
              )}
            >
              {/* Card Header */}
              <div className={cn("px-8 py-6 text-white", model.headerColor)}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-sm font-medium text-white/70 uppercase tracking-wider">{model.tag}</span>
                    <h2 className="text-2xl font-bold mt-1">{model.name}</h2>
                  </div>
                  {model.highlight && (
                    <span className="bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full self-start sm:self-auto">
                      Mais Completa
                    </span>
                  )}
                </div>
                <p className="mt-3 text-white/80 text-sm max-w-2xl">{model.description}</p>
              </div>

              {/* Services Grid */}
              <div className="p-8 bg-card">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                  Serviços incluídos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {model.services.map((service) => (
                    <div key={service.name} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/contato">
                      Tenho interesse nesta modalidade
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/como-funciona">Como funciona</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Não sabe qual modalidade escolher?</h2>
          <p className="text-muted-foreground mb-8">
            Nossa equipe de consultores pode ajudá-lo a identificar a melhor opção com base no perfil do seu mercado local e no seu investimento disponível.
          </p>
          <Button asChild size="lg">
            <Link href="/contato">Falar com um consultor</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
