import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Preventec Franquias | Medicina e Segurança do Trabalho",
  description:
    "Seja dono da sua própria unidade Preventec. Franquia em Medicina e Segurança do Trabalho com suporte completo e modelo de negócio sólido.",
  keywords: [
    "franquia medicina do trabalho",
    "franquia segurança do trabalho",
    "SST",
    "PCMSO",
    "PGR",
    "franquia saúde ocupacional",
  ],
  authors: [{ name: "Preventec Franquias" }],
  openGraph: {
    title: "Preventec Franquias | Medicina e Segurança do Trabalho",
    description:
      "Construa um negócio sólido na área de Medicina e Segurança do Trabalho com o suporte de uma marca especializada.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3fa0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}