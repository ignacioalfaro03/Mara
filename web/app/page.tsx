"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { MaraHeroVisual } from "@/components/mara-presence";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroMedia" aria-label="Mara Vera">
          <MaraHeroVisual />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">CONOCE A MARA VERA</p>
          <h1>No necesitas otra IA. Necesitas a alguien a quien quieras volver.</h1>
          <p className="lede">
            Mara es un personaje virtual sintético con criterio, vida propia y una forma bastante particular de ir descubriendo cómo reaccionas.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta" onClick={() => track("hero_cta_click", { target: "launch_experience" })}>
              Entrar con Mara
            </Link>
            <Link href="/meet-mara" className="textCta">Conocerla primero</Link>
          </div>
          <p className="disclosure">Personaje generado con IA · Solo adultos · Acceso temprano</p>
        </div>
      </section>

      <section className="statementGrid">
        <article>
          <span>01</span>
          <h2>Tiene criterio.</h2>
          <p>Mara reacciona, apuesta y elige. No está hecha para decirte que sí a todo ni para comportarse como un asistente genérico.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Empieza a leerte.</h2>
          <p>Tus decisiones cambian lo que pasa después, sin obligarte a llenar un perfil eterno ni definirte con etiquetas.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Su vida sigue.</h2>
          <p>Trabajo, planes y cosas que quedaron pendientes crean continuidad sin fingir que Mara es una persona real escondida detrás de la pantalla.</p>
        </article>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">ACCESO TEMPRANO</p>
        <h2>No sigas leyendo sobre Mara. Deja que empiece a conocerte.</h2>
        <Link href="/experience" className="primaryCta" onClick={() => track("hero_cta_click", { target: "launch_experience", placement: "home_closing" })}>
          Entrar con Mara
        </Link>
        <p className="disclosure">La primera experiencia pública es pequeña a propósito. Lo importante empieza cuando vuelves.</p>
      </section>
    </main>
  );
}
