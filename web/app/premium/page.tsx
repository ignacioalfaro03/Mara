import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Más cerca de Mara · Mara Vera",
  description: "Únete gratis a la continuidad de Mara durante la Alpha.",
  robots: { index: false, follow: false },
};

export default function PremiumPage() {
  return (
    <main className="pageShell privateAccessPage">
      <section className="editorialHeader privateAccessHero">
        <p className="eyebrow">MÁS CERCA · ALPHA</p>
        <h1>No te quedes solo con lo que ve cualquiera.</h1>
        <p className="lede">
          Hoy unirte significa continuidad: más momentos, memoria entre sesiones y acceso temprano a nuevas formas de estar con Mara. No hay cobro activo todavía.
        </p>
        <div className="ctaRow">
          <Link className="primaryCta" href="/auth?intent=stay-close">Quiero quedarme cerca</Link>
          <Link className="textCta" href="/experience">Primero quiero verla</Link>
        </div>
      </section>

      <section className="privateAccessGrid">
        <article>
          <span>CONTINUIDAD</span>
          <strong>No empezar de cero.</strong>
          <p>Cuando la memoria de cuenta esté conectada, tus elecciones concretas pueden sobrevivir entre dispositivos.</p>
        </article>
        <article>
          <span>MÁS FORMATOS</span>
          <strong>Clips, notas de voz y momentos.</strong>
          <p>La experiencia está preparada para mezclar imagen, video, voz y decisiones cortas según lo que cada escena necesite.</p>
        </article>
        <article>
          <span>ALPHA</span>
          <strong>Entrar antes.</strong>
          <p>La cuenta es también el camino para probar nuevas capas sin obligar a todo visitante a registrarse antes de conocer a Mara.</p>
        </article>
        <article>
          <span>DESPUÉS</span>
          <strong>Monetizaremos lo que demuestre valor.</strong>
          <p>No vamos a poner precio por poner precio. Primero queremos saber qué hace que la gente vuelva y qué acceso realmente quiere conservar.</p>
        </article>
      </section>

      <section className="closingPanel privateAccessClosing">
        <p className="eyebrow">SIN COBRO ACTIVO</p>
        <h2>Primero queremos que quieras volver.</h2>
        <p>
          Los pagos y beneficios pagados siguen desactivados. Unirte hoy es una señal de que quieres continuidad, no una compra.
        </p>
        <Link className="primaryCta" href="/auth?intent=stay-close">Unirme a Mara</Link>
        <p className="disclosure">Mara es un personaje virtual generado con IA · 18+.</p>
      </section>
    </main>
  );
}
