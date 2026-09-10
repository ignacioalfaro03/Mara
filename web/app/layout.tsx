import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./platform-reinvention.css";
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
  title: "Mara — Creator Worlds",
  description: "Mara conecta Creator Worlds, convierte deseo en demanda útil y ayuda a transformar esa demanda en comercio, memoria y retorno con privacidad primero.",
  openGraph: {
    title: "Mara — Creator Worlds",
    description: "Creator Worlds, demanda, comercio y memoria. Mara conecta lo que la gente quiere con lo que una creadora puede hacer realidad.",
    images: [{
      url: "/mara/mara-v2-reference.webp",
      width: 384,
      height: 576,
      alt: "Mara Vera — Creator Zero",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mara — Creator Worlds",
    description: "Creator Worlds, demanda, comercio y memoria con privacidad primero.",
    images: ["/mara/mara-v2-reference.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PublicPageTracker />
        <AgeGate />
        <header className="siteHeader">
          <Link href="/" className="wordmark" aria-label="Mara, para ti">MARA</Link>
          <nav aria-label="Navegación principal">
            <Link href="/">Para ti</Link>
            <Link href="/make-it-happen">Haz que pase</Link>
            <Link href="/activity">Actividad</Link>
            <Link href="/creators">Creadoras</Link>
          </nav>
        </header>
        {children}
        <footer className="siteFooter">
          <span>Mara conecta Creator Worlds, demanda y comercio. La plataforma y sus pilotos son solo para personas adultas.</span>
          <div className="footerLinks">
            <Link href="/creators">Crear un World</Link>
            <Link href="/legal">Privacidad · Términos · Divulgación IA</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}