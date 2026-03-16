import Link from 'next/link';
import Image from 'next/image';
import { mockBlogPosts as blogPosts } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      {/* Article */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <Link href="/blog" className="text-primary hover:underline text-sm font-semibold mb-4 inline-block">
              ← Voltar ao Blog
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground border-b border-border pb-6">
              <div className="flex items-center gap-2">
                <span className="inline-block w-8 h-8 rounded-full bg-primary/10"></span>
                <span className="font-semibold">{post.author}</span>
              </div>
              <time>
                {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                {post.category}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>

            <p className="text-foreground leading-relaxed mb-4">
              A saúde e segurança ocupacional é fundamental para o sucesso de qualquer organização. 
              Neste artigo, exploraremos os principais aspectos relacionados a {post.title.toLowerCase()} 
              e como implementar as melhores práticas em sua empresa.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              O Impacto da {post.category}
            </h2>

            <p className="text-foreground leading-relaxed mb-4">
              Empresas que investem em saúde ocupacional apresentam índices de produtividade 
              significativamente maiores e menores taxas de absenteísmo. A Preventec é especialista 
              em implementar soluções que transformam a cultura de segurança na sua organização.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Como Implementar
            </h2>

            <p className="text-foreground leading-relaxed mb-4">
              O primeiro passo é realizar uma diagnóstico completo da sua empresa. Nossa equipe 
              realiza uma avaliação detalhada de todos os riscos, identifica não-conformidades 
              regulatórias e propõe um plano de ação customizado para seu negócio.
            </p>

            <p className="text-foreground leading-relaxed mb-4">
              Em seguida, implementamos as medidas necessárias com suporte contínuo dos nossos 
              especialistas. Treinamentos, procedimentos e tecnologias são ajustados conforme 
              as necessidades específicas da sua organização.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Benefícios de Implementar
            </h2>

            <ul className="list-disc pl-6 text-foreground space-y-2 mb-4">
              <li>Redução de acidentes e doenças ocupacionais</li>
              <li>Conformidade com regulações e legislação</li>
              <li>Aumento de produtividade e engajamento</li>
              <li>Melhoria da imagem corporativa</li>
              <li>Redução de custos com ausências e afastamentos</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Quer implementar essas práticas na sua empresa?
            </h3>
            <p className="text-muted-foreground mb-6">
              Converse com um de nossos especialistas e descubra como a Preventec pode ajudar.
            </p>
            <Link
              href="/contato"
              className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-background border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Artigos Relacionados
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article className="group cursor-pointer">
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(relatedPost.publishedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
