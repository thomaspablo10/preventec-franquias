import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Globe, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Target, title: "Missão", text: "Promover a saúde e a segurança dos trabalhadores por meio de serviços padronizados, com foco na prevenção e no cumprimento da legislação." },
  { icon: Globe, title: "Visão", text: "Ser referência nacional como rede de franquias em Medicina e Segurança do Trabalho, reconhecida pela qualidade, confiabilidade e inovação." },
  { icon: Heart, title: "Valores", text: "Ética, responsabilidade, excelência técnica, padronização dos serviços, foco na prevenção, compromisso com o cliente e valorização das pessoas." },
];

{/*const stats = [
  { value: "50+", label: "Unidades ativas" },
  { value: "15+", label: "Anos de expertise" },
  { value: "10k+", label: "Empresas atendidas" },
  { value: "98%", label: "Satisfação dos clientes" },
];*/}

export default function SobrePage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-[#0f2260] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Sobre a Preventec</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white text-balance">
            Quem somos
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
            Conheça a história, os valores e a visão por trás da Preventec® Franquias.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">
                Nossa história começa...
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A PREVENTEC® iniciou suas atividades na região Norte do Mato Grosso 
                com o propósito de oferecer soluções completas em Medicina e Segurança do Trabalho, 
                atendendo empresas de pequeno, médio e grande porte com responsabilidade 
                técnica e excelência no cuidado à saúde ocupacional.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Começando com uma estrutura enxuta e atendimentos reduzidos, 
                a empresa rapidamente conquistou a confiança do mercado pela 
                qualidade dos serviços prestados. O crescimento contínuo da 
                demanda impulsionou a ampliação das instalações, a modernização 
                dos processos e a expansão de sua capacidade operacional.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao longo dos anos, a PREVENTEC® fortaleceu sua presença regional com a abertura de novas unidades, ampliando o alcance dos 
                serviços e garantindo atendimento mais próximo e ágil aos clientes. Esse desenvolvimento culminou, em 2011, na inauguração d
                e sua sede própria em Sinop-MT, com estrutura ampla, moderna e planejada para oferecer mais conforto, eficiência e qualidade nos atendimentos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A PREVENTEC® consolidou-se com um modelo de atendimento eficiente, incluindo serviços in-loco com realização de exames complementares, 
                como o raio-X ocupacional. A busca constante por excelência e qualificação das equipes mantém a empresa atualizada com as normas regulamentadoras 
                e legislações, garantindo um serviço de alta qualidade e liderança no mercado.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mediante a crescente demanda de atendimentos e procura constante pela prestação dos serviços de segurança e medicina do trabalho nos estados 
                do Mato Grosso e Pará, a PREVENTEC®, decidiu inovar mais uma vez, sendo pioneira na venda de franquias de serviços dos setores de medicina e 
                segurança do trabalho para a região Norte do Mato Grosso e estado do Pará, mas não para por aí muitas novidades serão divulgadas em breve. 
              </p>
              <Button asChild>
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeY3eCgRwrn1Hv1qpb4K63TXTDn7ealLrUqpQcivgnu0qHQQA/viewform?usp=publish-editor">
                  Fale com nossa equipe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/about.jpg"
                  alt="Equipe Preventec em reunião"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats }
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-muted/40 rounded-2xl p-8 text-center">
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>*/}

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">
              Nossos valores e propósito
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-6">
            Por que o mercado de SST é uma oportunidade única?
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            Com mais de 42 milhões de trabalhadores formais no Brasil e obrigatoriedade legal para todas as empresas, o mercado de Saúde e Segurança no Trabalho movimenta R$ 12 bilhões por ano — com previsão de crescimento de 15% ao ano.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Demanda crescente", text: "Fiscalização mais rígida do Ministério do Trabalho aumenta a busca por serviços especializados." },
              { title: "Serviço obrigatório", text: "Todas as empresas com CLT são obrigadas por lei a manter programas de SST ativos." },
              { title: "Alto ticket médio", text: "Contratos recorrentes com empresas garantem previsibilidade de receita e margens atrativas." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-foreground mb-3 text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
