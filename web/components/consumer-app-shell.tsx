"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/app", label: "Inicio", glyph: "⌂" },
  { href: "/app/discover", label: "Descubrir", glyph: "◇" },
  { href: "/app/messages", label: "Mensajes", glyph: "◌" },
  { href: "/app/me", label: "Tú", glyph: "○" },
];

function activeFor(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ConsumerAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="consumerApp">
      <aside className="consumerRail" aria-label="Navegación de Mara">
        <Link className="consumerBrand" href="/app" aria-label="Mara, inicio">M</Link>
        <nav className="consumerRailNav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={activeFor(pathname, item.href) ? "isActive" : ""}>
              <span aria-hidden="true">{item.glyph}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </nav>
        <Link className="consumerRailAccount" href="/auth">Cuenta</Link>
      </aside>

      <div className="consumerViewport">
        <header className="consumerTopbar">
          <Link className="consumerTopWordmark" href="/app">MARA</Link>
          <Link className="consumerAvatarLink" href="/app/me" aria-label="Tu perfil">Tú</Link>
        </header>
        <div className="consumerContent">{children}</div>
      </div>

      <nav className="consumerBottomNav" aria-label="Navegación principal">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className={activeFor(pathname, item.href) ? "isActive" : ""}>
            <span aria-hidden="true">{item.glyph}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>
    </div>
  );
}
