"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/modalidades", label: "Modalidades" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md"
          : "bg-white/95 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Preventec Franquias"
              width={140}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/8"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link
                href="https://app.centraldofranqueado.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acesso Restrito
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#d42b2b] hover:bg-[#b01e1e] text-white">
              <Link href="/contato">Quero ser franqueado</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/8"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="w-full border-primary text-primary"
              >
                <Link href="/login">Login do Franqueado</Link>
              </Button>
              <Button asChild className="w-full bg-[#d42b2b] hover:bg-[#b01e1e] text-white">
                <Link href="/contato">Quero ser franqueado</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
