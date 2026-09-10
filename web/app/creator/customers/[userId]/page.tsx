import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { creatorActionTitle, normalizeCreatorAction } from "@/lib/creator-actions";
import { formatMoney, readOwnCreator, type CustomerSummaryRow, type DeclaredPreferenceRow, type DemandRow, type DemandSignalRow, type NextBestActionRow, type PurchaseRow } from "@/lib/mara-real-data";
import { first, userRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) notFound();
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) notFound();

  const summary = first(await userRest<CustomerSummaryRow[]>(session.accessToken, `creator_customer_summary?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`));
  if (!summary) notFound();

  const [preferencesResult, purchasesResult, signalsResult, actionResult] = await Promise.all([
    userRest<DeclaredPreferenceRow[]>(session.accessToken, `user_declared_preferences?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&scope=eq.creator_world&creator_visible=eq.true&order=updated_at.desc`),
    userRest<PurchaseRow[]>(session.accessToken, `commerce_purchases?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`),
    userRest<DemandSignalRow[]>(session.accessToken, `demand_signals?select=*&user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc`),
    userRest<NextBestActionRow[]>(session.accessToken, `creator_next_best_actions?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`),
  ]);
  const preferences = preferencesResult.ok ? preferencesResult.data : [];
  const purchases = purchasesResult.ok ? purchasesResult.data : [];
  const signals = signalsResult.ok ? signalsResult.data : [];
  const demandIds = [...new Set(signals.map((signal) => signal.demand_request_id))];
  const demandResult = demandIds.length ? await userRest<DemandRow[]>(session.accessToken, `demand_requests?select=*&id=in.(${demandIds.map(encodeURIComponent).join(",")})&creator_id=eq.${encodeURIComponent(creator.id)}`) : null;
  const demands = demandResult?.ok ? demandResult.data : [];
  const action = actionResult.ok ? actionResult.data[0] : null;
  const normalizedAction = normalizeCreatorAction(action?.action);

  return (
    <main className={styles.shell}><div className={styles.container}>
      <nav className={styles.nav}><Link href="/creator">← Creator Home</Link><span className={styles.pill}>{summary.lifecycle_stage ?? "customer"}</span></nav>
      <header className={styles.hero}><p className={styles.eyebrow}>CUSTOMER · CREATOR-SCOPED ONLY</p><h1>{summary.alias || "Mara user"}</h1><p>Solo aparece contexto permitido dentro de tu relación comercial. Nada de compras de otras creadoras, identidad legal, preferencias network o demanda privada.</p></header>

      <section className={styles.grid}>
        <article className={styles.card}><p className={styles.eyebrow}>RELATIONSHIP</p><h2>{summary.purchase_count ?? 0} compras</h2><p className={styles.muted}>Primera actividad: {summary.first_seen_at ? new Date(summary.first_seen_at).toLocaleDateString("es-CL") : "—"}<br/>Última actividad: {summary.last_activity_at ? new Date(summary.last_activity_at).toLocaleDateString("es-CL") : "—"}</p><p className={styles.metric}>{formatMoney(summary.creator_gmv_minor)}</p></article>
        <article className={`${styles.card} ${styles.connection}`}><p className={styles.eyebrow}>NEXT BEST ACTION</p><h2>{creatorActionTitle(action?.action)}</h2><p>{action?.reason ?? "No hay una acción comercial clara ahora."}</p><span className={styles.pill}>{normalizedAction} · {action?.priority ?? "low"}</span></article>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}><p className={styles.eyebrow}>WHAT THEY LIKE</p><h2>Declarado y visible</h2>{preferences.length === 0 ? <p className={styles.empty}>No compartió preferencias con esta creadora.</p> : <ul className={styles.list}>{preferences.map((pref) => <li className={styles.item} key={pref.id}><strong>{pref.preference_type.replaceAll("_", " ")}</strong><p className={styles.muted}>{pref.value_text}</p></li>)}</ul>}</article>
        <article className={styles.card}><p className={styles.eyebrow}>WHAT THEY ASKED FOR</p><h2>Demanda no privada</h2>{signals.length === 0 ? <p className={styles.empty}>No hay demanda identificable visible para esta creadora.</p> : <ul className={styles.list}>{signals.map((signal) => { const demand = demands.find((item) => item.id === signal.demand_request_id); return demand ? <li className={styles.item} key={`${signal.demand_request_id}-${signal.user_id}`}><strong>{demand.title}</strong><p className={styles.muted}>{signal.signal_level.toUpperCase()} · {signal.wtp_amount_minor ? formatMoney(signal.wtp_amount_minor, signal.currency ?? "CLP") : "sin WTP"}</p></li> : null; })}</ul>}</article>
      </section>

      <h2 className={styles.sectionTitle}>Purchases</h2>
      <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>{purchases.length === 0 ? <p className={styles.empty}>No hay compras de esta creadora.</p> : <ul className={styles.list}>{purchases.map((purchase) => <li className={styles.item} key={purchase.id}><div className={styles.row}><div><strong>{formatMoney(purchase.amount_minor, purchase.currency)}</strong><p className={styles.muted}>{new Date(purchase.created_at).toLocaleString("es-CL")} · {purchase.provider}</p></div><span className={styles.pill}>{purchase.fulfilled_at ? "fulfilled" : "pending"}</span></div></li>)}</ul>}</article></section>
    </div></main>
  );
}
