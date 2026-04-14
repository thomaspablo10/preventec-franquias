import Link from "next/link";
import { Shield, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0f2260] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/images/logo-white.png"
                alt="Preventec Franquias"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Especialistas em Medicina e Segurança do Trabalho. Construa um negócio sólido com o suporte de quem entende do setor.
            </p>            
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Links Rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/modalidades", label: "Modalidades" },
                { href: "/como-funciona", label: "Como Funciona" },
                { href: "/studio/login", label: "Studio", studio: true },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={link.studio ? false : undefined}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Serviços</h3>
            <ul className="space-y-3">
              {[
                "Medicina do Trabalho",
                "Segurança do Trabalho",
                "Gestão de SST",
                "Normas Regulamentadoras",
                "Palestras",
                "Treinamentos",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/70 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contato</h3>
            <ul className="space-y-4">              
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+556635311590"
                  className="text-white/70 text-sm hover:text-white transition"
                >
                  (66) 3531-1590
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:comercial@preventecfranquias.com.br"
                  className="text-white/70 text-sm hover:text-white transition"
                >
                  comercial@preventecfranquias.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="https://maps.app.goo.gl/V8UeNhd9YMhqspxr7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 text-sm hover:text-white transition"
                >
                  Av das Embaúbas, 2065, Setor Comercial, CEP 78550-108, Sinop, MT - Brasil
                </a>
              </li>
            </ul>
            <div className="flex items-center justify-center gap-3 mt-4">
              <a
                href="https://wa.me/5566992025805"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" 
                aria-label="Whatsapp"
              >
                <i className="bi bi-whatsapp text-base"></i>
              </a>
              <a 
                href="https://www.instagram.com/preventecsinop" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" 
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/preventecsinop" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" 
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Preventec Franquias. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}