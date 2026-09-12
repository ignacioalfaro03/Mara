import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { readOwnCreator } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

const mechanisms = [
  {
    name: "Ventas",
    code: "FIXED_PRICE",
    status: "Disponible sobre el commerce spine actual",
    body: "Productos, contenido y entregables con precio definido por la creadora. Checkout y precio siguen siendo server-authoritative.",
  },
  {
    name: "Deseos / Caprichos",
    code: "WISH",
    status: "Arquitectura reutiliza goals + contributions",
    body: "Metas financiadas por aportes de la audiencia. Cada aporte se convierte en una señal del mismo cliente dentro del CRM.",
  },
  {
    name: "Subastas",
    code: "AUCTION",
    status: "Domain engine + DB draft preparados",
    body: "Pujas gratuitas, incremento mínimo y anti-sniping. Solo el ganador deberá pasar a checkout cuando pagos reales sean autorizados.",
  },
  {
    name: "Solicitudes",
    code: "CUSTOM_REQUEST",
    status: "Backbone existente reutilizado",
    body: "El usuario propone qué quiere y cuánto pagaría; la creadora puede revisar, aceptar, rechazar o contraofertar sin confundir intención con compra.",
  },
  {
    name: "Chat y media",
    code: "PAID_INTERACTION",
    status: "Mensajería/contenido existente; monetización avanzada pendiente",
    body: "La creadora controla qué deja gratis y qué convierte en acceso, mensaje, audio, foto, video o interacción pagada.",
  },
  {
    name: "Taste Engine",
    code: "TASTE_CHOICE",
    status: "Contrato y persistencia draft preparados",
    body: "Elecciones rápidas tipo A/B o swipe para entretener y guardar preferencias declaradas, no para perfilar vulnerabilidades.",
  },
] as const;

export default async function CreatorMonetizationPage() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>MARA · MONETIZACIÓN</p>
            <h1>Decide qué cobras. Mara organiza el negocio detrás.</h1>
            <p>Entra a tu Creator OS para administrar las formas de monetización que alimentan el mismo CRM e inteligencia comercial.</p>
            <Link className={styles.button} href="/auth?returnTo=/creator/monetization">Entrar</Link>
          </section>
        </div>
      </main>
    );
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <nav className={styles.nav}><Link href="/creator">Creator OS</Link></nav>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>CREATOR ACTIVATION</p>
            <h1>Primero activa tu perfil de creadora.</h1>
            <p>La monetización vive sobre una relación creator-scoped. Vuelve al Creator OS para completar la activación disponible en este entorno.</p>
            <Link className={styles.button} href="/creator">Volver al Creator OS</Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/creator">MARA · CREATOR OS</Link>
          <div className={styles.actions}>
            <Link className={styles.secondary} href="/creator/customers">Clientes</Link>
            <Link className={styles.secondary} href="/auth">Cuenta</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR COMMERCE ENGINE · {creator.plan}</p>
          <h1>Una audiencia. Muchas formas de monetizar. Un solo cliente.</h1>
          <p>Ventas, deseos, subastas, solicitudes, chat y preferencias deben alimentar la misma relación comercial. La creadora decide qué es gratis y qué cobra; Mara convierte la actividad en CRM y siguientes acciones.</p>
        </header>

        <section className={styles.grid}>
          {mechanisms.map((mechanism) => (
            <article className={styles.card} key={mechanism.code}>
              <p className={styles.eyebrow}>{mechanism.code}</p>
              <h2>{mechanism.name}</h2>
              <p>{mechanism.body}</p>
              <p className={styles.muted}>{mechanism.status}</p>
            </article>
          ))}
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>REVENUE INTELLIGENCE</p>
            <h2>La monetización no termina en el pago.</h2>
            <p>Una puja perdida, una solicitud repetida o un segundo aporte pueden convertirse en oportunidades basadas en evidencia. Mara no debe inventar intención ni usar perfiles de vulnerabilidad.</p>
            <Link className={styles.button} href="/creator">Ver siguiente mejor acción</Link>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>PAYMENT SAFETY</p>
            <h2>Pagos reales siguen bloqueados.</h2>
            <p className={styles.muted}>Este hub no activa dinero real, payouts ni Mercado Pago en producción. Cada nuevo mecanismo deberá pasar por el mismo checkout, ledger, webhook, reconciliation y autorización del fundador.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
