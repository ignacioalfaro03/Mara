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
  title: "Mara — Creator Revenue OS",
  description: "Mara ayuda a creadores a convertir audiencia en clientes recurrentes con commerce, CRM, oportunidades e inteligencia de revenue.",
  openGraph: {
    title: "Mara — Creator Revenue OS",
    description: "Audience → Customers → Intelligence → Revenue.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mara — Creator Revenue OS",
    description: "Convierte seguidores en clientes recurrentes y encuentra tu siguiente oportunidad de revenue.",
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
