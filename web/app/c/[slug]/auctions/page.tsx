import Link from "next/link";
import { notFound } from "next/navigation";
import { AuctionBidForm } from "@/components/auction-bid-form";
import { publicAuctionProjection, type CreatorAuctionRow } from "@/lib/commerce/auction-runtime";
import { formatMoney, readWorld } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import { serviceRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function CreatorAuctionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await readWorld(slug);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const enabled = productCapability("auctions");
  const result = enabled
    ? await serviceRest<CreatorAuctionRow[]>(
        `creator_auctions?select=*&world_id=eq.${encodeURIComponent(profile.id)}&status=in.(scheduled,active,ended)&order=ends_at.asc&limit=50`,
      )
    : null;
  const auctions = result?.ok
    ? result.data.map((auction) => publicAuctionProjection(auction))
    : [];

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href={`/c/${slug}`}>← {profile.display_name}</Link>
          <Link className={styles.secondary} href="/auth">Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>SUBASTAS</p>
          <h1>La audiencia decide cuánto vale ganar.</h1>
          <p>Pujar es gratis. Cada puja es una señal de intención, no un cobro. La subasta puede extenderse automáticamente si aparece una puja en sus últimos minutos.</p>
        </header>

        {!enabled ? (
          <section className={styles.grid}>
            <article className={`${styles.card} ${styles.wide}`}><p className={styles.empty}>Subastas todavía no están activadas en este entorno.</p></article>
          </section>
        ) : auctions.length === 0 ? (
          <section className={styles.grid}>
            <article className={`${styles.card} ${styles.wide}`}><p className={styles.empty}>Esta creadora todavía no tiene subastas disponibles.</p></article>
          </section>
        ) : (
          <section className={styles.grid}>
            {auctions.map((auction) => {
              const returnTo = `/c/${slug}/auctions`;
              return (
                <article className={styles.card} key={auction.id}>
                  <p className={styles.eyebrow}>AUCTION · {auction.status.toUpperCase()}</p>
                  <h2>{auction.title}</h2>
                  <p>{auction.description}</p>
                  <p className={styles.metric}>{formatMoney(auction.currentBidMinor ?? auction.startingBidMinor, auction.currency)}</p>
                  <p className={styles.muted}>
                    {auction.currentBidMinor === null ? "Puja inicial" : "Puja líder actual"} · {auction.bidCount} pujas · incremento mínimo {formatMoney(auction.minimumIncrementMinor, auction.currency)}
                  </p>
                  <p className={styles.small}>
                    {auction.status === "scheduled" ? `Comienza ${new Date(auction.startsAt).toLocaleString("es-CL")}` : `Cierra ${new Date(auction.endsAt).toLocaleString("es-CL")}`}
                  </p>
                  {auction.status === "active" ? (
                    <AuctionBidForm
                      auctionId={auction.id}
                      currency={auction.currency}
                      minimumNextBidMinor={auction.minimumNextBidMinor}
                      minimumIncrementMinor={auction.minimumIncrementMinor}
                      returnTo={returnTo}
                    />
                  ) : auction.status === "ended" ? (
                    <p className={styles.empty}>Subasta cerrada. La puja ganadora todavía no equivale a un pago.</p>
                  ) : (
                    <p className={styles.empty}>Todavía no acepta pujas.</p>
                  )}
                </article>
              );
            })}
          </section>
        )}

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>REGLAS</p>
            <h2>Sin pay-per-bid. Sin cobros escondidos.</h2>
            <p className={styles.muted}>Mara no cobra por pujar. Si existe ganador, la conversión a checkout será un paso separado, explícito y server-authoritative cuando el sistema de pagos esté autorizado.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
