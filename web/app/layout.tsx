import type { Metadata } from "next";
import "./globals.css";
import "./platform-reinvention.css";
import "./public-home.css";
import { AgeGate } from "@/components/age-gate";
import { PublicPageTracker } from "@/components/public-page-tracker";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

function resolveMetadataBase() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const siteUrl = explicitSiteUrl ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
  return new URL(siteUrl);
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "Mara — Creator commerce, made personal",
  description: "Mara ayuda a creadoras a entender a su audiencia y monetizar contenido, interacciones, solicitudes y experiencias desde un solo lugar.",
  openGraph: {
    title: "Mara",
    description: "Contenido, interacción, comercio, memoria y demanda entre creadoras y sus clientes.",
    images: [{
      url: "/mara/mara-v2-reference.webp",
      width: 384,
      height: 576,
      alt: "Mara Vera — identidad de referencia de Mara",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mara",
    description: "Creator commerce con contexto, memoria y demanda.",
    images: ["/mara/mara-v2-reference.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PublicPageTracker />
        <AgeGate />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
