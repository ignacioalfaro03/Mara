"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isAppSurface(pathname: string) {
  return pathname === "/app" || pathname.startsWith("/app/") || pathname === "/creator" || pathname.startsWith("/creator/") || pathname === "/experience" || pathname.startsWith("/experience/");
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isAppSurface(pathname)) return null;
  return (
    <header className="siteHeader">
      <Link href="/" className="wordmark" aria-label="Mara">MARA</Link>
      <nav aria-label="Navegación pública">
        <Link href="/app">Entrar</Link>
        <Link href="/creators">Para creadoras</Link>
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
      <span>Mara conecta creadoras y clientes para vender contenido, interacciones, solicitudes y experiencias con controles de privacidad y comercio claros.</span>
      <div className="footerLinks">
        <Link href="/creators">Crear en Mara</Link>
        <Link href="/legal">Privacidad · Términos · Divulgación IA</Link>
      </div>
    </footer>
  );
}
