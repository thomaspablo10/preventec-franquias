const steps = [
  {
    number: "01",
    title: "Cadastro de Interessado",
    description: "Preencha nosso formulário de interesse e nos conte mais sobre você e sua região.",
  },
  {
    number: "02",
    title: "Análise de Perfil",
    description: "Nossa equipe analisa seu perfil e avalia o potencial da sua região para uma unidade Preventec.",
  },
  {
    number: "03",
    title: "Apresentação do Modelo",
    description: "Apresentamos em detalhe a proposta comercial, investimento e projeções financeiras.",
  },
  {
    number: "04",
    title: "Implantação da Unidade",
    description: "Toda a infraestrutura, sistemas e certificações são configurados com apoio completo da matriz.",
  },
  {
    number: "05",
    title: "Treinamento e Suporte Contínuo",
    description: "Sua equipe recebe treinamento completo e você conta com suporte permanente em todas as áreas.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Processo</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Como se tornar um franqueado
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Do primeiro contato até sua unidade em pleno funcionamento, acompanhamos cada etapa da sua jornada.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center z-10 relative">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden absolute top-10 left-1/2 w-0.5 h-8 bg-primary/20" />
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
