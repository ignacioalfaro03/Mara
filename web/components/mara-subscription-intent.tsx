"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

const benefits = [
  ["CONTINUIDAD", "No partir de cero cada vez que vuelves."],
  ["MÁS MOMENTOS", "Más partes del día, clips, notas de voz y escenas cuando estén disponibles."],
  ["MEMORIA", "Que Mara pueda conservar elecciones concretas entre dispositivos."],
  ["PRIMERO", "Entrar antes a nuevas capas de la experiencia mientras siga en Alpha."],
] as const;

export function MaraSubscriptionIntent() {
  return (
    <section className="subscriptionIntent" aria-labelledby="subscription-intent-title">
      <div className="subscriptionIntentCopy">
        <p className="eyebrow">QUÉDATE MÁS CERCA</p>
        <h2 id="subscription-intent-title">No te quedes solo con lo que ve cualquiera.</h2>
        <p>
          Por ahora unirte a Mara es gratis. La idea es simple: crear continuidad, recordar mejor y darte más razones para volver. La monetización viene después, cuando sepamos qué parte realmente vale pagar.
        </p>
        <div className="ctaRow">
          <Link
            href="/auth?intent=stay-close"
            className="primaryCta"
            onClick={() => track("hero_cta_click", { target: "join_mara" })}
          >
            Quiero quedarme cerca
          </Link>
          <Link href="/premium" className="textCta">Qué significa unirme</Link>
        </div>
        <p className="subscriptionDisclosure">Sin cobro activo · 18+ · Personaje virtual generado con IA</p>
      </div>

      <div className="subscriptionBenefits">
        {benefits.map(([label, copy]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{copy}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
