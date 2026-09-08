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
  title: "Mara",
  description: "Mara crea experiencias digitales y prepara una plataforma privada para creadoras adultas que quieren monetizar personajes bajo sus propios límites.",
  openGraph: {
    title: "Mara",
    description: "Tu personaje puede ser público. Tú no tienes que serlo.",
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
          <Link href="/" className="wordmark">MARA</Link>
          <nav aria-label="Navegación principal">
            <Link href="/shop">Experiencias</Link>
            <Link href="/creators">Para creadoras</Link>
            <Link href="/library">Biblioteca</Link>
            <Link href="/experience">Probar</Link>
          </nav>
        </header>
        {children}
        <footer className="siteFooter">
          <span>Mara Vera es el primer personaje virtual de Mara. El piloto de creadoras es solo para personas adultas.</span>
          <div>
            <Link href="/legal">Privacidad · Términos · Divulgación IA</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
