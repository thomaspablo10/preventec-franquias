import type {
  BlogPost,
  Material,
  ContentItem,
  Training,
  Announcement,
} from "@/types";

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Por que investir em Medicina do Trabalho é um diferencial competitivo",
    slug: "investir-medicina-trabalho-diferencial",
    excerpt:
      "Empresas que priorizam a saúde ocupacional reduzem custos, aumentam produtividade e fortalecem sua marca empregadora.",
    content: `
      <p>A Medicina do Trabalho deixou de ser apenas uma obrigação legal para se tornar um verdadeiro diferencial competitivo no mundo corporativo moderno. Empresas que investem na saúde de seus colaboradores colhem frutos em diversas frentes.</p>
      <h2>Redução de custos com afastamentos</h2>
      <p>Programas preventivos bem estruturados como o PCMSO (Programa de Controle Médico de Saúde Ocupacional) identificam riscos antes que se tornem problemas sérios, evitando afastamentos longos e custosos.</p>
      <h2>Aumento de produtividade</h2>
      <p>Colaboradores saudáveis são mais produtivos, criativos e engajados. Estudos demonstram que empresas com programas de saúde ocupacional robustos apresentam até 25% menos absenteísmo.</p>
      <h2>Conformidade legal</h2>
      <p>Além dos benefícios operacionais, manter conformidade com as normas regulamentadoras protege a empresa de multas e processos trabalhistas.</p>
    `,
    coverImage: "/images/blog/blog-1.jpg",
    author: "Dr. Carlos Mendes",
    category: "Medicina do Trabalho",
    publishedAt: "2025-01-15",
  },
  {
    id: "2",
    title: "NR-7 e PCMSO: guia completo para empresas em 2025",
    slug: "nr7-pcmso-guia-completo-2025",
    excerpt:
      "Entenda os requisitos atualizados da NR-7 e como implementar um PCMSO eficiente na sua empresa.",
    content: `
      <p>A NR-7 (Norma Regulamentadora 7) estabelece os requisitos mínimos para elaboração e implementação do Programa de Controle Médico de Saúde Ocupacional — o PCMSO.</p>
      <h2>O que é o PCMSO?</h2>
      <p>O PCMSO é um programa que visa promover e preservar a saúde dos trabalhadores, através de ações de prevenção, rastreamento e diagnóstico precoce dos agravos à saúde relacionados ao trabalho.</p>
      <h2>Quem é obrigado?</h2>
      <p>Todas as empresas que admitam trabalhadores como empregados são obrigadas a elaborar e implementar o PCMSO, independentemente do grau de risco ou número de funcionários.</p>
    `,
    coverImage: "/images/blog/blog-2.jpg",
    author: "Dra. Ana Paula Costa",
    category: "Normas Regulamentadoras",
    publishedAt: "2025-02-03",
  },
  {
    id: "3",
    title: "Como o mercado de Segurança do Trabalho está crescendo no Brasil",
    slug: "mercado-seguranca-trabalho-crescendo-brasil",
    excerpt:
      "O setor de SST cresce acima da média da economia brasileira e apresenta oportunidades únicas para empreendedores.",
    content: `
      <p>O mercado de Saúde e Segurança no Trabalho (SST) no Brasil tem apresentado crescimento consistente nos últimos anos, impulsionado pela maior fiscalização e pela conscientização das empresas.</p>
      <h2>Números do setor</h2>
      <p>Segundo dados do Ministério do Trabalho, o setor movimenta mais de R$ 12 bilhões por ano no Brasil, com previsão de crescimento de 15% ao ano para a próxima década.</p>
      <h2>Oportunidade para franqueados</h2>
      <p>Para empreendedores, o setor representa uma oportunidade única: alta demanda, serviço essencial e recorrente, com ticket médio elevado.</p>
    `,
    coverImage: "/images/blog/blog-3.jpg",
    author: "Ricardo Alves",
    category: "Mercado",
    publishedAt: "2025-02-20",
  },
  {
    id: "4",
    title: "PGR: o que mudou com a nova NR-1 e como se adaptar",
    slug: "pgr-nova-nr1-como-se-adaptar",
    excerpt:
      "A atualização da NR-1 trouxe importantes mudanças para o PGR. Saiba como sua empresa deve se adequar.",
    content: `
      <p>O Programa de Gerenciamento de Riscos (PGR) substituiu o antigo PPRA e trouxe uma abordagem mais abrangente para a gestão de riscos ocupacionais.</p>
      <h2>Principais mudanças</h2>
      <p>A nova NR-1 ampliou o escopo do PGR para incluir não apenas riscos físicos, químicos e biológicos, mas também riscos ergonômicos e psicossociais.</p>
    `,
    coverImage: "/images/blog/blog-4.jpg",
    author: "Eng. Paulo Santos",
    category: "Segurança do Trabalho",
    publishedAt: "2025-03-01",
  },
];

export const mockMaterials: Material[] = [
  {
    id: "1",
    title: "Logo Preventec - Versões Completas",
    description: "Pacote com todas as versões do logo em PNG, SVG e PDF.",
    type: "logo",
    fileUrl: "#",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    title: "Arte para Instagram - Janeiro 2025",
    description: "Posts prontos para redes sociais com identidade visual.",
    type: "redes-sociais",
    fileUrl: "#",
    createdAt: "2025-01-05",
  },
  {
    id: "3",
    title: "Campanha Semana da Saúde",
    description: "Material completo para divulgação da campanha.",
    type: "campanha",
    fileUrl: "#",
    createdAt: "2025-02-14",
  },
  {
    id: "4",
    title: "Flyer Serviços - Versão Digital",
    description: "Arte digital para distribuição via WhatsApp e email.",
    type: "arte",
    fileUrl: "#",
    createdAt: "2025-02-20",
  },
  {
    id: "5",
    title: "Banner Fachada Unidade",
    description: "Template para banner de fachada da unidade franqueada.",
    type: "arte",
    fileUrl: "#",
    createdAt: "2025-03-01",
  },
  {
    id: "6",
    title: "Kit Redes Sociais - Março 2025",
    description: "Stories, posts e capas para redes sociais.",
    type: "redes-sociais",
    fileUrl: "#",
    createdAt: "2025-03-05",
  },
];

export const mockContentItems: ContentItem[] = [
  {
    id: "1",
    title: "Manual Operacional Preventec",
    description: "Guia completo de operação da unidade franqueada.",
    type: "guia",
    fileUrl: "#",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    title: "Protocolo de Atendimento Médico",
    description: "Procedimentos padronizados para atendimento de pacientes.",
    type: "tecnico",
    fileUrl: "#",
    createdAt: "2025-01-15",
  },
  {
    id: "3",
    title: "Checklist de Conformidade NR",
    description: "Lista de verificação para conformidade com normas regulamentadoras.",
    type: "documento",
    fileUrl: "#",
    createdAt: "2025-02-01",
  },
  {
    id: "4",
    title: "Guia de Gestão Financeira",
    description: "Orientações para gestão financeira da unidade.",
    type: "guia",
    fileUrl: "#",
    createdAt: "2025-02-10",
  },
];

export const mockTrainings: Training[] = [
  {
    id: "1",
    title: "Introdução ao Sistema Preventec",
    description: "Treinamento inicial sobre a plataforma e processos da franquia.",
    type: "video",
    duration: "45 min",
    videoUrl: "#",
    createdAt: "2025-01-05",
  },
  {
    id: "2",
    title: "PCMSO na Prática",
    description: "Como elaborar e implementar o PCMSO na sua unidade.",
    type: "curso",
    duration: "3 horas",
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    title: "Gestão de Clientes e CRM",
    description: "Técnicas de gestão de relacionamento com clientes.",
    type: "video",
    duration: "1h 20min",
    videoUrl: "#",
    createdAt: "2025-02-05",
  },
  {
    id: "4",
    title: "Apresentação Comercial Preventec",
    description: "Slides e materiais para apresentação comercial.",
    type: "apresentacao",
    createdAt: "2025-02-15",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Atualização do Sistema de Agendamento",
    content:
      "Informamos que o sistema de agendamento será atualizado no dia 15/03. Haverá uma janela de manutenção das 2h às 4h da manhã.",
    priority: "important",
    createdAt: "2025-03-05",
    author: "Equipe Preventec",
  },
  {
    id: "2",
    title: "Novos materiais de marketing disponíveis",
    content:
      "Foram disponibilizados novos artes e campanhas para o mês de março. Acesse a seção Materiais de Marketing.",
    priority: "normal",
    createdAt: "2025-03-03",
    author: "Marketing Preventec",
  },
  {
    id: "3",
    title: "Reunião de franqueados - Março 2025",
    content:
      "Confirmamos a reunião mensal de franqueados para o dia 20/03 às 14h via videoconferência. Link será enviado por email.",
    priority: "urgent",
    createdAt: "2025-03-01",
    author: "Diretoria Preventec",
  },
  {
    id: "4",
    title: "Treinamento obrigatório: Nova NR-1",
    content:
      "Todos os franqueados devem completar o treinamento sobre a nova NR-1 até 30/03. Disponível na seção Treinamentos.",
    priority: "important",
    createdAt: "2025-02-25",
    author: "Equipe Técnica",
  },
];
