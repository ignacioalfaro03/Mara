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
          <p className="eyebrow">MARA · EXPERIENCIAS PRIVADAS</p>
          <h1>No tienes que hablar conmigo todo el día.</h1>
          <p className="lede">
            Entra, prueba una escena y quédate con lo que te guste. Hay experiencias, audios y colecciones privadas que puedes volver a abrir cuando quieras.
          </p>
          <div className="ctaRow">
            <Link
              href="/shop"
              className="primaryCta"
              onClick={() => {
                track("hero_cta_click", { surface: "home", placement: "primary", target: "storefront" });
              }}
            >
              Explorar experiencias
            </Link>
            <Link
              href="/experience"
              className="textCta"
              onClick={() => {
                track("hero_cta_click", { surface: "home", placement: "secondary", target: "free_sample" });
                track("mara_entered", { surface: "home", target: "free_sample" });
              }}
            >
              Probar a Mara gratis
            </Link>
          </div>
          <p className="disclosure">Personaje virtual generado con IA · Solo adultos · Productos digitales y experiencias</p>
        </div>
      </section>
    </main>
  );
}
