import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { creatorActionTitle, normalizeCreatorAction } from "@/lib/creator-actions";
import { formatMoney, readOwnCreator, type CustomerSummaryRow, type DeclaredPreferenceRow, type DemandRow, type DemandSignalRow, type NextBestActionRow, type PurchaseRow } from "@/lib/mara-real-data";
import type { CreatorCustomerNoteRow, CreatorCustomerPrivateContextRow } from "@/lib/product-realization";
import { first, userRest } from "@/lib/supabase/server-rest";
import { ProductTelemetry } from "@/components/product-telemetry";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

function daysSince(value: string | null | undefined) {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.floor((Date.now() - parsed) / 86_400_000));
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) notFound();
  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) notFound();

  const summary = first(await userRest<CustomerSummaryRow[]>(session.accessToken, `creator_customer_summary?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`));
  if (!summary) notFound();

  const crmEnabled = process.env.MARA_CRM_SYSTEM_ENABLED === "true";
  const [preferencesResult, purchasesResult, signalsResult, actionResult, contextResult, notesResult] = await Promise.all([
    userRest<DeclaredPreferenceRow[]>(session.accessToken, `user_declared_preferences?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&scope=eq.creator_world&creator_visible=eq.true&order=updated_at.desc`),
    userRest<PurchaseRow[]>(session.accessToken, `commerce_purchases?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`),
    userRest<DemandSignalRow[]>(session.accessToken, `demand_signals?select=*&user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc`),
    userRest<NextBestActionRow[]>(session.accessToken, `creator_next_best_actions?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`),
    crmEnabled
      ? userRest<CreatorCustomerPrivateContextRow[]>(session.accessToken, `creator_customer_private_context?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`)
      : Promise.resolve({ ok: true as const, data: [] as CreatorCustomerPrivateContextRow[], status: 200 }),
    crmEnabled
      ? userRest<CreatorCustomerNoteRow[]>(session.accessToken, `creator_customer_notes?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=30`)
      : Promise.resolve({ ok: true as const, data: [] as CreatorCustomerNoteRow[], status: 200 }),
  ]);

  const preferences = preferencesResult.ok ? preferencesResult.data : [];
  const purchases = purchasesResult.ok ? purchasesResult.data : [];
  const signals = signalsResult.ok ? signalsResult.data : [];
  const privateContext = contextResult.ok ? contextResult.data[0] ?? null : null;
  const notes = notesResult.ok ? notesResult.data : [];
  const demandIds = [...new Set(signals.map((signal) => signal.demand_request_id))];
  const demandResult = demandIds.length ? await userRest<DemandRow[]>(session.accessToken, `demand_requests?select=*&id=in.(${demandIds.map(encodeURIComponent).join(",")})&creator_id=eq.${encodeURIComponent(creator.id)}`) : null;
  const demands = demandResult?.ok ? demandResult.data : [];
  const action = actionResult.ok ? actionResult.data[0] : null;
  const normalizedAction = normalizeCreatorAction(action?.action);
  const totalSpent = purchases.filter((purchase) => purchase.status === "succeeded").reduce((sum, purchase) => sum + purchase.amount_minor, 0);
  const paidCount = purchases.filter((purchase) => purchase.status === "succeeded").length;
  const averageOrder = paidCount ? Math.round(totalSpent / paidCount) : 0;
  const lastPurchase = purchases.find((purchase) => purchase.status === "succeeded") ?? null;
  const daysSinceLast = daysSince(lastPurchase?.created_at);

  return (
    <main className={styles.shell}><div className={styles.container}>
      <ProductTelemetry event="customer_viewed" surface={`/creator/customers/${userId}`} target="customer_profile" placement="creator_crm" />
      {action ? <ProductTelemetry event="next_best_action_viewed" surface={`/creator/customers/${userId}`} target={normalizedAction} placement="creator_crm" /> : null}

      <nav className={styles.nav}><Link href="/creator">← Clientes</Link><span className={styles.pill}>{summary.lifecycle_stage ?? "customer"}</span></nav>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>CLIENTE · RELACIÓN COMERCIAL</p>
        <h1>{summary.alias || "Cliente Mara"}</h1>
        <p>Qué ha comprado, qué ha declarado que le interesa y qué conviene hacer ahora. No incluye identidad legal, compras con otros creadores ni señales privadas fuera de tu relación comercial.</p>
      </header>

      <section className={styles.grid}>
        <article className={styles.third}><p className={styles.eyebrow}>TOTAL GASTADO</p><p className={styles.metric}>{formatMoney(totalSpent)}</p><p className={styles.muted}>{paidCount} compras</p></article>
        <article className={styles.third}><p className={styles.eyebrow}>COMPRA PROMEDIO</p><p className={styles.metric}>{formatMoney(averageOrder)}</p><p className={styles.muted}>{lastPurchase ? `última hace ${daysSinceLast ?? 0} días` : "sin compras"}</p></article>
        <article className={styles.third}><p className={styles.eyebrow}>ÚLTIMA ACTIVIDAD</p><p className={styles.metric}>{summary.last_activity_at ? new Date(summary.last_activity_at).toLocaleDateString("es-CL") : "—"}</p><p className={styles.muted}>{summary.attribution_source ?? "unknown"}</p></article>
      </section>

      <section className={styles.grid}>
        <article className={`${styles.card} ${styles.connection}`}>
          <p className={styles.eyebrow}>SIGUIENTE MEJOR ACCIÓN</p>
          <h2>{creatorActionTitle(action?.action)}</h2>
          <p>{action?.reason ?? "Todavía no hay suficiente evidencia para recomendar una acción comercial."}</p>
          <span className={styles.pill}>{normalizedAction} · {action?.priority ?? "low"}</span>
          {action && normalizedAction !== "none" ? (
            <form method="post" action="/api/creator/customers/action" style={{ marginTop: 14 }}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="action" value={normalizedAction} />
              <input type="hidden" name="returnTo" value={`/creator/customers/${userId}`} />
              <button className={styles.secondary} type="submit">Marcar como realizada</button>
            </form>
          ) : null}
        </article>

        <article className={styles.card}>
          <p className={styles.eyebrow}>CONTEXTO PRIVADO</p>
          <h2>Lo que te sirve recordar para atender mejor.</h2>
          {crmEnabled ? (
            <form className={styles.form} method="post" action={`/api/creator/customers/${userId}/context`}>
              <input type="hidden" name="returnTo" value={`/creator/customers/${userId}`} />
              <label>Contexto comercial<textarea name="weaknessNote" maxLength={2000} defaultValue={privateContext?.weakness_note ?? ""} placeholder="Ej. Prefiere productos personalizados; suele comprar cerca del fin de semana." /></label>
              <p className={styles.small}>Solo tú puedes verlo. No aparece para el cliente ni para otros creadores.</p>
              <button className={styles.secondary} type="submit">Guardar</button>
            </form>
          ) : <p className={styles.empty}>El contexto privado queda oculto hasta activar la migración/flag CRM en este entorno.</p>}
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>PREFERENCIAS DECLARADAS</p>
          <h2>Señales visibles y permitidas para tu relación</h2>
          {preferences.length === 0 ? <p className={styles.empty}>Aún no compartió preferencias contigo.</p> : <ul className={styles.list}>{preferences.map((pref) => <li className={styles.item} key={pref.id}><strong>{pref.preference_type.replaceAll("_", " ")}</strong><p className={styles.muted}>{pref.value_text}</p><p className={styles.small}>{pref.source === "user_free_text" || pref.source === "user_edit" ? "Explícito" : "Señal"}</p></li>)}</ul>}
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>SEÑALES DE INTERÉS</p>
          <h2>Demanda visible dentro de tu relación</h2>
          {signals.length === 0 ? <p className={styles.empty}>No hay señales de demanda identificables para ti.</p> : <ul className={styles.list}>{signals.map((signal) => { const demand = demands.find((item) => item.id === signal.demand_request_id); return demand ? <li className={styles.item} key={`${signal.demand_request_id}-${signal.user_id}`}><strong>{demand.title}</strong><p className={styles.muted}>{signal.signal_level.toUpperCase()} · {signal.wtp_amount_minor ? formatMoney(signal.wtp_amount_minor, signal.currency ?? "CLP") : "sin precio declarado"}</p></li> : null; })}</ul>}
        </article>
      </section>

      <section className={styles.grid}>
        <article className={`${styles.card} ${styles.wide}`}>
          <p className={styles.eyebrow}>NOTAS PRIVADAS</p>
          <h2>Contexto que te sirve para atender mejor.</h2>
          {crmEnabled ? (
            <>
              <form className={styles.form} method="post" action={`/api/creator/customers/${userId}/notes`}>
                <input type="hidden" name="returnTo" value={`/creator/customers/${userId}`} />
                <label>Nueva nota<textarea name="body" minLength={1} maxLength={4000} placeholder="Qué prometiste, qué prefiere o qué conviene recordar." required /></label>
                <button className={styles.secondary} type="submit">Agregar nota</button>
              </form>
              {notes.length ? <ul className={styles.list}>{notes.map((note) => <li className={styles.item} key={note.id}><p>{note.body}</p><div className={styles.row}><span className={styles.small}>{new Date(note.created_at).toLocaleString("es-CL")}</span><form method="post" action={`/api/creator/customers/${userId}/notes`}><input type="hidden" name="action" value="delete" /><input type="hidden" name="noteId" value={note.id} /><input type="hidden" name="returnTo" value={`/creator/customers/${userId}`} /><button className={styles.secondary} type="submit">Eliminar</button></form></div></li>)}</ul> : <p className={styles.empty}>Sin notas todavía.</p>}
            </>
          ) : <p className={styles.empty}>Las notas quedan ocultas hasta activar la capa CRM persistente.</p>}
        </article>
      </section>

      <h2 className={styles.sectionTitle}>Compras con este perfil</h2>
      <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>{purchases.length === 0 ? <p className={styles.empty}>No hay compras registradas con este perfil.</p> : <ul className={styles.list}>{purchases.map((purchase) => <li className={styles.item} key={purchase.id}><div className={styles.row}><div><strong>{formatMoney(purchase.amount_minor, purchase.currency)}</strong><p className={styles.muted}>{new Date(purchase.created_at).toLocaleString("es-CL")} · {purchase.provider}</p></div><span className={styles.pill}>{purchase.status === "refunded" ? "refunded" : purchase.fulfilled_at ? "fulfilled" : "pending"}</span></div></li>)}</ul>}</article></section>
    </div></main>
  );
}
