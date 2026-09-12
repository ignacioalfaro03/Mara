"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isAppSurface(pathname: string) {
  return pathname === "/app"
    || pathname.startsWith("/app/")
    || pathname === "/creator"
    || pathname.startsWith("/creator/")
    || pathname === "/c"
    || pathname.startsWith("/c/")
    || pathname === "/experience"
    || pathname.startsWith("/experience/");
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isAppSurface(pathname)) return null;
  return (
    <header className="siteHeader">
      <Link href="/" className="wordmark" aria-label="Mara">MARA</Link>
      <nav aria-label="Navegación pública">
        <Link href="/creators">Para creadores</Link>
        <Link href="/creator">Creator OS</Link>
        <Link href="/auth">Cuenta</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isAppSurface(pathname)) return null;
  return (
    <footer className="siteFooter">
      <span>Mara ayuda a creadores a convertir audiencia en clientes recurrentes mediante commerce, CRM, oportunidades e inteligencia de revenue.</span>
      <div className="footerLinks">
        <Link href="/creators">Vender con Mara</Link>
        <Link href="/legal">Privacidad · Términos</Link>
      </div>
    </footer>
  );
}
