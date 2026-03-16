import Link from "next/link";
import { Shield, Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0f2260] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-white tracking-tight">PREVENTEC</span>
                <span className="text-[10px] text-white/60 font-medium tracking-widest uppercase">Franquias</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Especialistas em Medicina e Segurança do Trabalho. Construa um negócio sólido com o suporte de quem entende do setor.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Links Rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/modalidades", label: "Modalidades" },
                { href: "/como-funciona", label: "Como Funciona" },
                { href: "/blog", label: "Blog" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Serviços</h3>
            <ul className="space-y-3">
              {[
                "Medicina do Trabalho",
                "PCMSO",
                "PGR / LTCAT",
                "Segurança do Trabalho",
                "Exames Ocupacionais",
                "Gestão de SST",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/70 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">(11) 9 9999-9999</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">contato@preventecfranquias.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">São Paulo, SP - Brasil</span>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Preventec Franquias. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/50 hover:text-white/70 text-sm transition-colors">Política de Privacidade</Link>
            <Link href="#" className="text-white/50 hover:text-white/70 text-sm transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
