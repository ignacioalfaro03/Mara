"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { MaraHeroVisual } from "@/components/mara-presence";

export default function HomePage() {
  return (
    <main>
      <section className="hero firstContactHero">
        <div className="heroMedia" aria-label="Mara Vera">
          <MaraHeroVisual />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">MARA · LA PRIMERA VEZ</p>
          <h1>Llegaste justo.</h1>
          <p className="lede">
            Estoy a punto de salir y ya cambié de idea dos veces. Necesito una decisión rápida.
          </p>
          <div className="ctaRow">
            <Link
              href="/experience"
              className="primaryCta"
              onClick={() => {
                track("hero_cta_click", { target: "launch_experience" });
                track("mara_entered", { surface: "home", target: "launch_experience" });
              }}
            >
              Métete.
            </Link>
            <Link href="/meet-mara" className="textCta">No. Primero quiero cacharte a ti.</Link>
          </div>
          <p className="disclosure">Personaje virtual generado con IA · Solo adultos · Alpha gratuito</p>
        </div>
      </section>
    </main>
  );
}
