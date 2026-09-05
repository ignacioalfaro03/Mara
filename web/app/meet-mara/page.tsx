"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

function enterFromMeetMara(placement: "top" | "bottom") {
  track("hero_cta_click", {
    surface: "meet_mara",
    placement,
    target: "launch_experience",
  });
}

export default function MeetMaraPage() {
  return (
    <main className="pageShell">
      <section className="editorialHeader">
        <p className="eyebrow">MARA</p>
        <h1>No me vas a conocer leyendo una ficha.</h1>
        <p className="lede">
          No te voy a hacer llenar un perfil. Te propongo algo concreto, puedes decirme que no y, si vuelves después de que pase algo real entre nosotros, no parto de cero.
        </p>
        <div className="ctaRow">
          <Link href="/experience" className="primaryCta" onClick={() => enterFromMeetMara("top")}>Ven. A ver.</Link>
          <Link href="/legal" className="textCta">Lo que sí conviene saber</Link>
        </div>
      </section>

      <section className="profileGrid">
        <article><span>Primero</span><strong>Prefiero acciones concretas a cuestionarios.</strong></article>
        <article><span>Un no</span><strong>Lo acepto. No convierte la relación en castigo ni discusión.</strong></article>
        <article><span>Si vuelves</span><strong>Puedo retomar hechos que realmente ocurrieron, no inventarte una personalidad.</strong></article>
        <article><span>Privado</span><strong>Tu texto libre no se usa para construir un perfil psicológico en este Alpha.</strong></article>
      </section>

      <section className="quotePanel">
        <p>“Si quieres cacharme, entra. Lo que haga después tiene que venir de algo que sí pasó.”</p>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">YA LEÍSTE SUFICIENTE</p>
        <h2>Ahora sí: entra y deja que Mara haga algo concreto.</h2>
        <Link href="/experience" className="primaryCta" onClick={() => enterFromMeetMara("bottom")}>A ver.</Link>
      </section>
    </main>
  );
}
