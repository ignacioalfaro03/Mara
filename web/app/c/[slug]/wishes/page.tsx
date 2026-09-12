import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, readWorld, readWorldOffers } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import { publicRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

type GoalRow = {
  id: string;
  slug: string;
  offer_id: string;
  title: string;
  description: string;
  target_amount_minor: number;
  funded_amount_minor: number;
  currency: string;
  status: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
};

function isWishMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return (value as Record<string, unknown>).mechanism === "WISH";
}

export default async function CreatorWishesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await readWorld(slug);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const enabled = productCapability("wishes");
  const offers = enabled ? await readWorldOffers(profile.id) : [];
  const wishes = offers.filter((offer) => offer.type === "open_contribution" && isWishMetadata(offer.metadata));
  const offerIds = wishes.map((offer) => offer.id);
  const goalResult = offerIds.length
    ? await publicRest<GoalRow[]>(`commerce_goals?select=*&offer_id=in.(${offerIds.map(encodeURIComponent).join(",")})&status=in.(funding,funded,fulfillment,canonicalized)&order=created_at.desc`)
    : null;
  const goals = goalResult?.ok ? goalResult.data : [];
  const goalsByOffer = new Map(goals.map((goal) => [goal.offer_id, goal]));

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href={`/c/${slug}`}>← {profile.display_name}</Link>
          <Link className={styles.secondary} href="/auth">Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>DESEOS · CAPRICHOS</p>
          <h1>Apoya algo que {profile.display_name} quiere hacer realidad.</h1>
          <p>La creadora define la meta y el rango de aporte. Mara cuenta únicamente pagos confirmados y mantiene cada aporte unido a la relación comercial del mismo cliente.</p>
        </header>

        {!enabled ? (
          <section className={styles.grid}>
            <article className={`${styles.card} ${styles.wide}`}>
              <p className={styles.empty}>Deseos todavía no están activados en este entorno.</p>
            </article>
          </section>
        ) : wishes.length === 0 ? (
          <section className={styles.grid}>
            <article className={`${styles.card} ${styles.wide}`}>
              <p className={styles.empty}>Esta creadora todavía no tiene deseos activos.</p>
            </article>
          </section>
        ) : (
          <section className={styles.grid}>
            {wishes.map((offer) => {
              const goal = goalsByOffer.get(offer.id);
              const target = goal?.target_amount_minor ?? 0;
              const funded = Math.min(goal?.funded_amount_minor ?? 0, target || Number.MAX_SAFE_INTEGER);
              const progress = target > 0 ? Math.min(100, Math.round((funded / target) * 100)) : 0;
              return (
                <article className={styles.card} key={offer.id}>
                  <p className={styles.eyebrow}>WISH · {goal?.status ?? "funding"}</p>
                  <h2>{offer.title}</h2>
                  <p>{offer.description}</p>
                  {goal ? (
                    <>
                      <p className={styles.metric}>{progress}%</p>
                      <p className={styles.muted}>{formatMoney(funded, goal.currency)} de {formatMoney(target, goal.currency)}</p>
                    </>
                  ) : (
                    <p className={styles.muted}>Meta pendiente de sincronización.</p>
                  )}
                  <Link className={styles.button} href={`/c/${slug}/offers/${offer.slug}`}>Aportar</Link>
                </article>
              );
            })}
          </section>
        )}

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>CLARIDAD</p>
            <h2>Aporte confirmado ≠ promesa.</h2>
            <p className={styles.muted}>La barra de progreso no usa likes, intención declarada ni checkouts fallidos. Solo debe reflejar aportes realmente confirmados por el flujo de pagos.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
