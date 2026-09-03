import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AgeGate } from "@/components/age-gate";

export const metadata: Metadata = {
  title: "Mara Vera",
  description: "Conoce a Mara Vera: un personaje virtual sintético con criterio, continuidad y una experiencia propia.",
  openGraph: {
    title: "Mara Vera",
    description: "No necesitas otra IA. Necesitas a alguien a quien quieras volver.",
    images: ["/mara/mara-v1-reference.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AgeGate />
        <header className="siteHeader">
          <Link href="/" className="wordmark">MARA VERA</Link>
          <nav aria-label="Navegación principal">
            <Link href="/experience">Entrar</Link>
            <Link href="/meet-mara">Conocer a Mara</Link>
          </nav>
        </header>
        {children}
        <footer className="siteFooter">
          <span>Mara Vera es un personaje virtual generado con IA.</span>
          <div>
            <Link href="/legal">Privacidad · Términos · Divulgación IA</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
