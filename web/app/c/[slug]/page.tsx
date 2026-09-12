import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTelemetry } from "@/components/product-telemetry";
import { formatMoney, readWorld, readWorldOffers } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function PublicCreatorStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await readWorld(slug);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const offers = await readWorldOffers(profile.id);
  const requestsEnabled = productCapability("requests");
  const wishesEnabled = productCapability("wishes");
  const auctionsEnabled = productCapability("auctions");
  const messagingEnabled = productCapability("messaging");

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <ProductTelemetry event="creator_viewed" surface={`/c/${slug}`} target={profile.creator_id} placement="creator_storefront" />

        <nav className={styles.nav}>
          <Link href="/">MARA</Link>
          <Link className={styles.secondary} href="/auth">Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR STOREFRONT</p>
          <h1>{profile.display_name}</h1>
          <p>{profile.description || "Ofertas disponibles directamente desde esta creadora."}</p>
          <div className={styles.actions}>
            {requestsEnabled ? <Link className={styles.secondary} href={`/c/${slug}/request`}>Pedir algo</Link> : null}
            {wishesEnabled ? <Link className={styles.secondary} href={`/c/${slug}/wishes`}>Deseos</Link> : null}
            {auctionsEnabled ? <Link className={styles.secondary} href={`/c/${slug}/auctions`}>Subastas</Link> : null}
            {messagingEnabled ? <Link className={styles.secondary} href={`/app/messages/${slug}`}>Mensaje</Link> : null}
            <Link className={styles.secondary} href={`/c/${slug}/taste`}>Esto o esto</Link>
          </div>
        </header>

        <h2 className={styles.sectionTitle}>Disponible</h2>
        <section className={styles.grid}>
          {offers.length === 0 ? (
            <article className={`${styles.card} ${styles.wide}`}>
              <p className={styles.empty}>Esta creadora todavía no tiene ofertas activas.</p>
            </article>
          ) : offers.map((offer) => {
            const customAmount = offer.price_mode === "custom_amount";
            return (
              <article className={styles.card} key={offer.id}>
                <p className={styles.eyebrow}>{customAmount ? "DESEO / APORTE" : offer.offer_family?.replaceAll("_", " ") || "OFERTA"}</p>
                <h2>{offer.title}</h2>
                <p className={styles.muted}>{offer.description}</p>
                <p className={styles.metric}>
                  {customAmount
                    ? `${formatMoney(offer.min_amount_minor, offer.currency)}–${formatMoney(offer.max_amount_minor, offer.currency)}`
                    : formatMoney(offer.amount_minor, offer.currency)}
                </p>
                <Link className={styles.button} href={`/c/${slug}/offers/${offer.slug}`}>{customAmount ? "Aportar" : "Ver oferta"}</Link>
              </article>
            );
          })}
        </section>

        <section className={styles.grid}>
          {requestsEnabled ? (
            <article className={styles.card}>
              <p className={styles.eyebrow}>SOLICITUD</p>
              <h2>¿No ves lo que buscas?</h2>
              <p className={styles.muted}>Dile a {profile.display_name} qué te gustaría recibir y cuánto pagarías si quieres. Enviar la solicitud no cobra nada.</p>
              <Link className={styles.secondary} href={`/c/${slug}/request`}>Crear solicitud</Link>
            </article>
          ) : null}

          {wishesEnabled ? (
            <article className={styles.card}>
              <p className={styles.eyebrow}>DESEOS</p>
              <h2>Ayuda a financiar una meta.</h2>
              <p className={styles.muted}>Ve el progreso confirmado y elige cuánto aportar dentro del rango definido por la creadora.</p>
              <Link className={styles.secondary} href={`/c/${slug}/wishes`}>Ver deseos</Link>
            </article>
          ) : null}

          {auctionsEnabled ? (
            <article className={styles.card}>
              <p className={styles.eyebrow}>SUBASTAS</p>
              <h2>Puja sin pagar por participar.</h2>
              <p className={styles.muted}>El precio emerge de pujas reales. Pujar es una señal comercial y no un cobro.</p>
              <Link className={styles.secondary} href={`/c/${slug}/auctions`}>Ver subastas</Link>
            </article>
          ) : null}

          {messagingEnabled ? (
            <article className={styles.card}>
              <p className={styles.eyebrow}>CONVERSACIÓN</p>
              <h2>Habla primero. Compra solo si quieres.</h2>
              <p className={styles.muted}>La creadora puede compartir una oferta dentro del chat, pero conversar por sí solo no genera ningún cobro.</p>
              <Link className={styles.secondary} href={`/app/messages/${slug}`}>Abrir conversación</Link>
            </article>
          ) : null}

          <article className={styles.card}>
            <p className={styles.eyebrow}>TASTE ENGINE</p>
            <h2>Cuatro elecciones rápidas.</h2>
            <p className={styles.muted}>Elige entre formatos y estilos para declarar preferencias dentro de esta relación con la creadora.</p>
            <Link className={styles.secondary} href={`/c/${slug}/taste`}>Jugar “esto o esto”</Link>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>MARA</p>
            <h2>Muchas interacciones. Una sola relación comercial.</h2>
            <p className={styles.muted}>Compras, aportes, solicitudes, pujas y preferencias se mantienen vinculadas al mismo cliente dentro del alcance de esta creadora, con límites de privacidad y evidencia explícita.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
