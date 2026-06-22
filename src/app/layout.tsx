import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { siteUrl } from "@/lib/config";

// Títulos: serifada display de alto contraste (combina com as capas dos livros).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Corpo: sans humanista, legível.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ateliê Católico Digital — Livros de colorir católicos em PDF",
    template: "%s · Ateliê Católico Digital",
  },
  description:
    "Evangelizando com cor e arte. Livros de colorir católicos em PDF para " +
    "famílias, catequese e momentos de fé. Download imediato após o pagamento, " +
    "com Pix e cartão. Pagamento 100% seguro.",
  openGraph: {
    title: "Ateliê Católico Digital",
    description:
      "Evangelizando com cor e arte. Livros de colorir católicos em PDF, prontos para imprimir.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
