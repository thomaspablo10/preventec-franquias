import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Cadastro de Interessado",
    description:
      "Preencha o formulário de interesse em nosso site. Informe seus dados, região de interesse e o modelo de franquia que chamou sua atenção. Esse primeiro passo é simples e gratuito.",
    details: [
      "Formulário online disponível 24h",
      "Nenhum custo para se cadastrar",
      "Resposta em até 2 dias úteis",
    ],
  },
  {
    number: "02",
    title: "Análise de Perfil",
    description:
      "Nossa equipe analisa seu perfil profissional, financeiro e a viabilidade da sua região para receber uma unidade Preventec. Verificamos o potencial de mercado e a concorrência local.",
    details: [
      "Análise de viabilidade da região",
      "Avaliação do perfil do investidor",
      "Estudo do mercado local de SST",
    ],
  },
  {
    number: "03",
    title: "Apresentação do Modelo",
    description:
      "Você recebe uma apresentação detalhada com o modelo de negócio, estrutura de investimento, projeções financeiras e a proposta comercial da franquia escolhida.",
    details: [
      "Reunião com consultor especializado",
      "Projeção financeira detalhada",
      "Esclarecimento de todas as dúvidas",
    ],
  },
  {
    number: "04",
    title: "Implantação da Unidade",
    description:
      "Após a formalização, nossa equipe acompanha toda a implantação: adequação do espaço, configuração dos sistemas, obtenção de licenças e credenciamento com os órgãos competentes.",
    details: [
      "Apoio na adequação do espaço físico",
      "Configuração do sistema de gestão",
      "Suporte jurídico e para licenças",
    ],
  },
  {
    number: "05",
    title: "Treinamento e Suporte Contínuo",
    description:
      "Sua equipe recebe treinamento presencial e online completo. Após a abertura, você conta com suporte permanente nas áreas técnica, comercial, marketing e jurídica.",
    details: [
      "Treinamento técnico e operacional",
      "Suporte comercial e de marketing",
      "Atualizações regulatórias contínuas",
    ],
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0f2260] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Processo</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white text-balance">
            Como funciona
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
            Do primeiro contato até sua unidade em pleno funcionamento — acompanhamos cada etapa da sua jornada.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

            <div className="space-y-12">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  {/* Step indicator */}
                  <div className="flex-shrink-0 flex sm:flex-col items-center gap-4 sm:gap-0">
                    <div className="w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg flex-shrink-0">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4 sm:pb-0">
                    <h2 className="text-xl font-bold text-foreground mb-3">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-5">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Pronto para começar sua jornada?</p>
            <Button asChild size="lg">
              <Link href="/contato">
                Iniciar meu cadastro
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Brief */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Perguntas frequentes</h2>
          <div className="space-y-6">
            {[
              {
                q: "Preciso ter formação em saúde para ser franqueado?",
                a: "Não necessariamente. Muitos de nossos franqueados são empreendedores de outras áreas. O modelo é completo e inclui toda a estrutura técnica necessária.",
              },
              {
                q: "Qual é o investimento inicial?",
                a: "O investimento varia conforme a modalidade escolhida e a região. Entre em contato para receber uma proposta personalizada com projeções detalhadas.",
              },
              {
                q: "Em quanto tempo começo a ter retorno?",
                a: "O tempo médio de retorno do investimento entre nossos franqueados é de 18 a 24 meses, dependendo da modalidade e do mercado local.",
              },
              {
                q: "A Preventec ajuda na busca de clientes?",
                a: "Sim. Fornecemos materiais de marketing, treinamento comercial e suporte para prospecção de clientes empresariais na sua região.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
