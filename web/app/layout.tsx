import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AgeGate } from "@/components/age-gate";
import { PublicPageTracker } from "@/components/public-page-tracker";

function resolveMetadataBase() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const siteUrl = explicitSiteUrl ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

  return new URL(siteUrl);
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "Mara Vera",
  description: "Llegaste justo. Mara ya estaba en medio de algo.",
  openGraph: {
    title: "Mara Vera",
    description: "Entraste en medio de algo. A ver qué haces.",
    images: ["/mara/mara-v1-reference.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PublicPageTracker />
        <AgeGate />
        <header className="siteHeader">
          <Link href="/" className="wordmark">MARA VERA</Link>
          <nav aria-label="Navegación principal">
            <Link href="/experience">Entrar</Link>
            <Link href="/meet-mara">Mara</Link>
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
