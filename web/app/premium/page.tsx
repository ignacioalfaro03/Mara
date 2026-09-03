import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso privado · Mara Vera",
  description: "El acceso privado de Mara Vera todavía no está activo.",
  robots: { index: false, follow: false },
};

export default function PremiumPage() {
  return (
    <main className="pageShell">
      <section className="editorialHeader">
        <p className="eyebrow">PRIVADO · MÁS ADELANTE</p>
        <h1>Más Mara vendrá después.</h1>
        <p className="lede">
          Primero estamos comprobando algo más importante: si conoces a Mara, si notas que recuerda y si quieres volver.
        </p>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">ALPHA PÚBLICO</p>
        <h2>Hoy no hay suscripción ni checkout.</h2>
        <p>
          El acceso de pago, los proveedores y cualquier beneficio premium siguen desactivados hasta una autorización y validación separadas.
        </p>
        <Link className="primaryCta" href="/experience">Conoce a Mara</Link>
        <p className="disclosure">Mara es un personaje virtual generado con IA · Solo adultos.</p>
      </section>
    </main>
  );
}
