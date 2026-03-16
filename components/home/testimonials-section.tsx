"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcos Oliveira",
    unit: "Franqueado - Belo Horizonte, MG",
    avatar: "MO",
    text: "Abrir minha unidade Preventec foi a melhor decisão da minha carreira. Em menos de 8 meses já estava no ponto de equilíbrio, e hoje faturamos acima da projeção inicial. O suporte da franqueadora é diferente de tudo que já vi.",
    rating: 5,
  },
  {
    name: "Carla Ferreira",
    unit: "Franqueada - Campinas, SP",
    avatar: "CF",
    text: "Sou fisioterapeuta e sempre quis ter meu próprio negócio na área da saúde. A Preventec me deu todo o know-how necessário, inclusive para a parte administrativa. Recomendo fortemente para profissionais da área.",
    rating: 5,
  },
  {
    name: "Roberto Nascimento",
    unit: "Franqueado - Fortaleza, CE",
    avatar: "RN",
    text: "O mercado de medicina do trabalho no Nordeste é enorme e ainda pouco explorado. Com a estrutura da Preventec e a demanda regional, conseguimos crescer rapidamente. A rentabilidade superou todas as expectativas.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-24 bg-[#0f2260] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">Depoimentos</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white text-balance">
            O que dizem nossos franqueados
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 relative">
            {/* Quote */}
            <div className="text-6xl text-primary/40 font-serif leading-none mb-6">"</div>

            <p className="text-white/90 text-lg leading-relaxed mb-8">
              {testimonials[current].text}
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {testimonials[current].avatar}
              </div>
              <div>
                <p className="font-semibold text-white">{testimonials[current].name}</p>
                <p className="text-white/60 text-sm">{testimonials[current].unit}</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === current ? "bg-white w-6" : "bg-white/30"}`}
                aria-label={`Ver depoimento ${idx + 1}`}
              />
            ))}
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
