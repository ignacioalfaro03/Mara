"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export default function HomePage() {
  return (
    <main>
      <section className="hero firstContactHero">
        <div className="heroMedia" aria-label="Ejemplo de sitio de creadora en Mara">
          <div className="mediaFrame">
            <div>
              <p className="eyebrow">MARA.COM/TU-NOMBRE</p>
              <h2>Tu espacio. Tu audiencia. Tu negocio.</h2>
              <p>Una página propia dentro de Mara, con comercio e inteligencia debajo.</p>
            </div>
          </div>
        </div>
        <div className="heroCopy">
          <p className="eyebrow">MARA · CREATOR SITES</p>
          <h1>Convierte tu audiencia en un negocio mejor.</h1>
          <p className="lede">
            Tu sitio en Mara reúne lo que ofreces, lo que tu audiencia quiere y las acciones que pueden convertirse en ventas y relaciones de largo plazo.
          </p>          <div className="ctaRow">
            <Link
              href="/creators"
              className="primaryCta"
              onClick={() => track("hero_cta_click", { surface: "home", placement: "primary", target: "creator_site" })}
            >
              Crear mi sitio en Mara
            </Link>
            <Link
              href="/auth"
              className="textCta"
              onClick={() => track("hero_cta_click", { surface: "home", placement: "secondary", target: "account" })}
            >
              Entrar
            </Link>
          </div>
          <p className="disclosure">Web-first · Creator commerce · Demand intelligence · Audience memory</p>
        </div>
      </section>

      <section className="statementGrid" aria-label="Cómo funciona Mara">
        <article><span>01</span><h2>Tu sitio</h2><p>Un destino propio para enviar a tu audiencia desde Instagram, TikTok, X, YouTube u otros canales.</p></article>
        <article><span>02</span><h2>Entiende la demanda</h2><p>Mara detecta qué quiere tu audiencia, cuánto interés existe y qué oportunidades merecen convertirse en oferta.</p></article>        <article><span>03</span><h2>Opera mejor</h2><p>Ventas, clientes, fulfillment y próximas acciones viven en un Creator OS diseñado para decidir, no para decorar.</p></article>
      </section>
    </main>
  );
}
