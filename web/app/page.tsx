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
            Necesito que elijas algo por mí. No lo pienses demasiado.
          </p>
          <div className="ctaRow">
            <Link
              href="/experience"
              className="primaryCta"
              onClick={() => track("hero_cta_click", { target: "launch_experience" })}
            >
              Ya.
            </Link>
            <Link href="/meet-mara" className="textCta">Antes quiero cacharte un poco</Link>
          </div>
          <p className="disclosure">Personaje virtual generado con IA · Solo adultos · Alpha gratuito</p>
        </div>
      </section>
    </main>
  );
}
