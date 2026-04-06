# Preventec Franquias - Plataforma Web

Plataforma completa para gerenciamento de franquias Preventec com presença digital, portal do franqueado e painel administrativo.

O projeto está dividido em duas partes principais:

- **Frontend**: Next.js (interface pública, portal do franqueado e admin)
- **Backend**: FastAPI + PostgreSQL (API, autenticação, banco de dados e lógica do sistema)

## Visão Geral

Este projeto é uma aplicação full-stack Next.js que fornece:

- **Site Público**: Landing page, about, modalidades, como funciona, blog e contato
- **Portal do Franqueado**: Dashboard, perfil, documentos e suporte
- **Painel Administrativo**: Gerenciamento de franquias, tickets, documentos e relatórios
- **Autenticação**: Sistema de login com roles (franqueado/admin)

## Estrutura do Projeto

```
/app
  /(public)              # Rotas públicas (site)
    /page.tsx            # Home
    /sobre               # Sobre
    /modalidades         # Modalidades de franchising
    /como-funciona       # Como funciona
    /blog                # Blog
    https://docs.google.com/forms/d/e/1FAIpQLSeY3eCgRwrn1Hv1qpb4K63TXTDn7ealLrUqpQcivgnu0qHQQA/viewform?usp=publish-editor             # Contato
  /(portal)              # Rotas protegidas (franqueado)
    /portal              # Dashboard
    /portal/perfil       # Perfil do franqueado
    /portal/documentos   # Documentos
    /portal/suporte      # Suporte
  /(admin)               # Rotas protegidas (admin)
    /admin               # Dashboard admin
    /admin/franqueados   # Gerenciar franquias
    /admin/documentos    # Gerenciar documentos
    /admin/suporte       # Gerenciar tickets
    /admin/relatorios    # Relatórios
  /login                 # Página de login

/components
  /home                  # Componentes da home
  /layout               # Navbar, footer, etc.

/lib
  /mock-data.ts         # Dados mockados
  /auth.ts              # Funções de autenticação

/hooks
  /use-auth.tsx         # Hook de autenticação

/types
  /index.ts             # Tipos TypeScript

/public
  /images               # Imagens do projeto
```

## Configuração Local

### Pré-requisitos
- Node.js 18+
- pnpm

### Instalação

```bash
# Instalar dependências
pnpm install

# Executar dev server
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Credenciais de Teste

### Franqueado
- Email: `franqueado@preventec.com`
- Senha: `senha123`

### Admin
- Email: `admin@preventec.com`
- Senha: `senha123`

## Design System

### Cores
- **Primary**: #003087 (Azul Royal)
- **Secondary**: #E63E2F (Vermelho)
- **Background**: #FFFFFF
- **Foreground**: #1A1A1A
- **Muted**: #F5F5F5
- **Border**: #E0E0E0

### Tipografia
- **Heading**: Inter (sem serifa)
- **Body**: Inter (sem serifa)

## Funcionalidades

### Site Público
- Landing page com hero section
- Seção de benefícios
- Visualização de modalidades
- Processo passo a passo
- Depoimentos de clientes
- Blog com artigos e busca
- Página de contato com formulário

### Portal do Franqueado
- Dashboard com estatísticas
- Gerenciamento de perfil
- Biblioteca de documentos
- Sistema de tickets de suporte
- Avisos e comunicados

### Painel Admin
- Dashboard com métricas
- Gerenciamento de franquias
- Gerenciamento de tickets
- Gerenciamento de documentos
- Geração de relatórios

## Autenticação

O sistema usa um hook `useAuth` que simula autenticação. Para implementar com um backend real:

1. Conectar a um banco de dados (Supabase, Neon, etc.)
2. Implementar API de autenticação
3. Usar cookies HTTP-only para sessions
4. Implementar verificação de roles nas rotas protegidas

## Próximos Passos

- [ ] Conectar a um banco de dados real
- [ ] Implementar API de autenticação
- [ ] Adicionar upload de documentos
- [ ] Implementar notificações em tempo real
- [ ] Adicionar integração de email
- [ ] Implementar pagamentos (se necessário)
- [ ] Deploy em produção

## Tecnologias Usadas

- **Next.js 16**: Framework React
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilos utilitários
- **shadcn/ui**: Componentes UI
- **React Hooks**: State management

## Licença

Copyright © 2026 Preventec Franquias. Todos os direitos reservados.
