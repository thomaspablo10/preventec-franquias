'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockBlogPosts as blogPosts } from '@/lib/mock-data';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog Preventec
            </h1>
            <p className="text-lg text-muted-foreground">
              Artigos e insights sobre saúde e segurança ocupacional
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="h-full group cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 md:h-56 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col h-48 md:h-52">
                      <div className="flex gap-2 mb-2">
                        <span className="text-sm font-semibold text-primary">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <time className="text-xs text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                        </time>
                        <span className="text-sm font-semibold text-primary">
                          Ler mais →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
