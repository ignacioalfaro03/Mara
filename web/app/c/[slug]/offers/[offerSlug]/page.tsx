import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTelemetry } from "@/components/product-telemetry";
import { StorefrontCheckoutButton } from "@/components/storefront-checkout-button";
import { getVerifiedSession } from "@/lib/auth-session";
import { formatMoney, readWorld, readWorldOffers } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function PublicCreatorOfferPage({ params }: { params: Promise<{ slug: string; offerSlug: string }> }) {
  const { slug, offerSlug } = await params;
  const profile = await readWorld(slug);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const session = await getVerifiedSession();
  const offers = await readWorldOffers(profile.id, session.ok ? session.accessToken : undefined);
  const offer = offers.find((candidate) => candidate.slug === offerSlug);
  if (!offer) notFound();
  const returnTo = `/c/${slug}/offers/${offerSlug}`;
  const customAmount = offer.price_mode === "custom_amount";
  const auctionScoped = Boolean(
    offer.metadata &&
    typeof offer.metadata === "object" &&
    !Array.isArray(offer.metadata) &&
    typeof (offer.metadata as Record<string, unknown>).auction_id === "string",
  );

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <ProductTelemetry event="offer_viewed" surface={returnTo} target={offer.slug} placement="creator_storefront" />

        <nav className={styles.nav}>
          <Link href={`/c/${slug}`}>← {profile.display_name}</Link>
          <Link className={styles.secondary} href={`/auth?returnTo=${encodeURIComponent(returnTo)}`}>Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>{auctionScoped ? "ADJUDICACIÓN PRIVADA" : customAmount ? "DESEO / APORTE" : offer.offer_family?.replaceAll("_", " ") || "OFERTA"}</p>
          <h1>{offer.title}</h1>
          <p>{offer.description}</p>
        </header>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.connection}`}>
            <p className={styles.eyebrow}>{customAmount ? "APORTE" : auctionScoped ? "PUJA GANADORA" : "PRECIO"}</p>
            <p className={styles.metric}>
              {customAmount
                ? `${formatMoney(offer.min_amount_minor, offer.currency)}–${formatMoney(offer.max_amount_minor, offer.currency)}`
                : formatMoney(offer.amount_minor, offer.currency)}
            </p>
            <p className={styles.muted}>
              {auctionScoped
                ? "Este monto viene de la puja ganadora registrada en servidor. Antes de crear el checkout Mara vuelve a verificar ganador, subasta, oferta y monto."
                : customAmount
                  ? "Tú eliges un monto dentro del rango definido por la creadora. El aporte solo se convierte en compra cuando el checkout confirma el pago."
                  : "El checkout usa el precio registrado en servidor. El navegador no define el monto final."}
            </p>
            <StorefrontCheckoutButton
              offerSlug={offer.slug}
              offerType={offer.type}
              currency={offer.currency}
              returnTo={returnTo}
              priceMode={offer.price_mode}
              minAmountMinor={offer.min_amount_minor}
              maxAmountMinor={offer.max_amount_minor}
            />
          </article>

          <article className={styles.card}>
            <p className={styles.eyebrow}>{customAmount ? "QUÉ ESTÁS APOYANDO" : auctionScoped ? "QUÉ ADJUDICASTE" : "QUÉ RECIBES"}</p>
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            {customAmount ? (
              <p className={styles.muted}>El progreso de la meta se construye únicamente con aportes confirmados; intentos fallidos o reembolsados no cuentan.</p>
            ) : auctionScoped ? (
              <p className={styles.muted}>La adjudicación no es un pago por sí sola. En el entorno actual el checkout de creadoras sigue restringido a `signed_test`; pagos reales permanecen bloqueados.</p>
            ) : (
              <p className={styles.muted}>Entrega: {offer.fulfillment_key?.replaceAll("_", " ") || "definida por el creador"}.</p>
            )}
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>COMPRA CLARA</p>
            <p className={styles.muted}>Antes de completar una compra, Mara mantiene explícitos el creador, la oferta, el monto y el estado del checkout. Los pagos reales permanecen cerrados mientras el proveedor no esté autorizado para el modelo operativo vigente.</p>
          </article>
        </section>
      </div>
    </main>
  );
}