import { TrendingUp, Award, Users, HeadphonesIcon, BookOpen, Shield } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Mercado em Crescimento",
    description: "O setor de SST cresce 15% ao ano, com demanda crescente por conformidade legal e saúde preventiva.",
  },
  {
    icon: Shield,
    title: "Serviço Essencial e Recorrente",
    description: "Empresas são obrigadas legalmente a contratar nossos serviços, garantindo receita recorrente.",
  },
  {
    icon: Award,
    title: "Marca Reconhecida",
    description: "Leve vantagem imediata de uma marca estabelecida, com reputação sólida no setor.",
  },
  {
    icon: BookOpen,
    title: "Know-how Completo",
    description: "Acesso a processos, sistemas e metodologias desenvolvidos ao longo de mais de 15 anos.",
  },
  {
    icon: Users,
    title: "Suporte Total",
    description: "Equipe dedicada para apoio técnico, comercial, jurídico e operacional em todas as fases.",
  },
  {
    icon: HeadphonesIcon,
    title: "Treinamento Contínuo",
    description: "Capacitação constante para sua equipe manter a excelência e se atualizar com as normas.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Por que Preventec</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Benefícios da nossa franquia
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mais do que uma franquia, você recebe uma estrutura completa para construir um negócio de alto valor no setor de saúde e segurança ocupacional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
