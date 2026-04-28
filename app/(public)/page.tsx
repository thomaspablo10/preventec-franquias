import { HeroSection } from "@/components/home/hero-section";
import { AboutPreviewSection } from "@/components/home/about-preview-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { ModelsPreviewSection } from "@/components/home/models-preview-section";
import { ProcessSection } from "@/components/home/process-section";
{/*import { TestimonialsSection } from "@/components/home/testimonials-section";*/} {/* Sessão de comentários de Franqueados */}
import { CtaSection } from "@/components/home/cta-section";
import { NewsCarouselSection } from "@/components/home/news-carousel-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ModelsPreviewSection />
      <ProcessSection />
      <NewsCarouselSection />
      <AboutPreviewSection />
      {/*<TestimonialsSection />*/} {/* Sessão de comentários de Franqueados */}
      <CtaSection />
    </>
  );
}
