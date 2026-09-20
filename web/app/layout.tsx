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
  description: "Mara ayuda a creadoras e influencers a operar su propio sitio, entender la demanda de su audiencia y convertirla en comercio cumplido.",
  openGraph: {
    title: "Mara",
    description: "Tu sitio en Mara. Tu audiencia, tu oferta y la inteligencia para operar un negocio mejor.",
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
            <Link href="/creators">Para creadoras</Link>
            <Link href="/creator">Creator OS</Link>
            <Link href="/me/history">Mi actividad</Link>
            <Link href="/auth">Entrar</Link>
          </nav>
        </header>
        {children}
        <footer className="siteFooter">
          <span>Mara es infraestructura web para creadoras, audiencia, demanda, comercio y continuidad. El Alpha actual mantiene sus límites de acceso vigentes.</span>
          <div>
            <Link href="/legal">Privacidad · Términos · Divulgación IA</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
