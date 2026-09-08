import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { ProductTelemetry } from "@/components/product-telemetry";
import { formatMoney, readCreatorDashboard, readOwnCreator, readOwnWorlds } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

function actionTitle(action: string | null) {
  const map: Record<string, string> = {
    FULFILL: "Fulfill this first.",
    POST_PURCHASE_FOLLOWUP: "Cuida esta primera compra.",
    COMPLETE_COLLECTION: "Hay una compra siguiente relevante.",
    OFFER_MEMBERSHIP: "Puede tener sentido ofrecer recurrencia.",
    REACTIVATE_WITH_FREE_PREVIEW: "Reactiva con valor, no presión.",
    WAIT: "No vendas nada ahora.",
    NO_ACTION: "No hay una acción comercial clara.",
  };
  return map[action ?? ""] ?? action ?? "Sin acción";
}

export default async function CreatorHomePage({ searchParams }: { searchParams: Promise<{ demand?: string }> }) {
  const query = await searchParams;
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return <main className={styles.shell}><div className={styles.container}><section className={styles.hero}><p className={styles.eyebrow}>CREATOR OS</p><h1>Tu World empieza después de entrar.</h1><p>No hay dashboard sintético aquí. Necesitas una sesión real para leer tus datos bajo RLS.</p><Link className={styles.button} href="/auth">Entrar</Link></section></div></main>;
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) {
    const enabled = process.env.MARA_ALPHA_CREATOR_ONBOARDING_ENABLED === "true";
    return (
      <main className={styles.shell}><div className={styles.container}>
        <nav className={styles.nav}><Link href="/">MARA</Link><Link className={styles.secondary} href="/auth">Cuenta</Link></nav>
        <section className={styles.hero}><p className={styles.eyebrow}>PRIVATE ALPHA · CREATOR</p><h1>Crea tu World.</h1><p>La activación es deliberadamente pequeña: una cuenta de creadora, un World y una primera oferta. Sin CRM gigante ni configuración innecesaria.</p></section>
        <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}><h2>Become Creator</h2><p className={styles.muted}>La activación usa un endpoint server-side controlado. No abre una policy que permita a cualquier usuario convertirse en creador desde el navegador.</p>
          {enabled ? <form method="post" action="/api/creator/me"><input type="hidden" name="returnTo" value="/creator" /><button className={styles.button} type="submit">Activar Creator Alpha</button></form> : <p className={styles.notice}>Blocker de entorno: define <code>MARA_ALPHA_CREATOR_ONBOARDING_ENABLED=true</code> en un entorno Alpha autorizado. Opcionalmente usa <code>MARA_ALPHA_CREATOR_EMAIL_ALLOWLIST</code>.</p>}
        </article></section>
      </div></main>
    );
  }

  const worlds = await readOwnWorlds(session.accessToken, creator.id);
  const dashboard = await readCreatorDashboard(session.accessToken, creator.id);
  const selectedDemand = query.demand ? dashboard.opportunities.find((item) => item.demand_request_id === query.demand) : null;
  const defaultWorld = selectedDemand?.world_id ? worlds.find((world) => world.id === selectedDemand.world_id) : worlds[0];
  const pending = dashboard.purchases.filter((purchase) => !purchase.fulfilled_at);
  const gmv = dashboard.customers.reduce((sum, customer) => sum + (customer.creator_gmv_minor ?? 0), 0);
  const repeat = dashboard.customers.filter((customer) => (customer.purchase_count ?? 0) >= 2).length;
  const topAction = dashboard.nextActions.find((item) => item.priority === "high") ?? dashboard.nextActions[0];
  const bestOpportunity = dashboard.opportunities[0];
  const canAcknowledgeTopAction = Boolean(
    topAction?.user_id && topAction.action && !["FULFILL", "WAIT", "NO_ACTION"].includes(topAction.action),
  );

  return (
    <main className={styles.shell}><div className={styles.container}>
      {bestOpportunity ? <ProductTelemetry event="creator_opportunity_viewed" surface="/creator" target="best_opportunity" placement="creator_home" /> : null}
      {pending.length > 0 ? <ProductTelemetry event="fulfillment_viewed" surface="/creator" target="pending_fulfillment" placement="creator_home" /> : null}
      <nav className={styles.nav}><Link href="/">MARA</Link><div className={styles.actions}>{defaultWorld ? <Link className={styles.secondary} href={`/world/${defaultWorld.slug}`}>Ver World</Link> : null}<Link className={styles.secondary} href="/auth">Cuenta</Link></div></nav>
      <header className={styles.hero}><p className={styles.eyebrow}>CREATOR OS · {creator.status} · {creator.plan}</p><h1>Lo importante hoy.</h1><p>Mara reduce datos a decisiones: qué quiere tu World, quién merece atención, qué vendiste y qué conviene hacer después.</p></header>

      <section className={styles.grid}>
        <article className={styles.third}><p className={styles.eyebrow}>SALES</p><p className={styles.metric}>{formatMoney(gmv)}</p><p className={styles.muted}>{dashboard.customers.length} clientes · {repeat} recurrentes</p></article>
        <article className={styles.third}><p className={styles.eyebrow}>FULFILLMENT</p><p className={styles.metric}>{pending.length}</p><p className={styles.muted}>compras pagadas pendientes de entrega</p></article>
        <article className={styles.third}><p className={styles.eyebrow}>DEMAND</p><p className={styles.metric}>{dashboard.opportunities.length}</p><p className={styles.muted}>oportunidades reales en tus Worlds</p></article>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>BEST OPPORTUNITY</p>
          {bestOpportunity ? <><h2>{bestOpportunity.title}</h2><p>{bestOpportunity.want_count ?? 0} quieren · {bestOpportunity.pledge_count ?? 0} pledge · {bestOpportunity.commit_count ?? 0} commit.</p><p className={styles.muted}>Avance: {Math.round(bestOpportunity.progress_percent ?? 0)}% · demanda verificada {formatMoney(bestOpportunity.verified_demand_gmv_minor)}</p><Link className={styles.button} href={`/creator?demand=${bestOpportunity.demand_request_id}`}>Create offer from this demand</Link></> : <p className={styles.empty}>No hay demanda todavía. Comparte tu World para empezar a descubrir qué quiere la gente.</p>}
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>NEXT ACTION</p>
          {topAction ? <><h2>{actionTitle(topAction.action)}</h2><p className={styles.muted}>{topAction.reason}</p><span className={styles.pill}>{topAction.priority}</span>
            {topAction.action === "FULFILL" ? <p><a className={styles.secondary} href="#pending-fulfillment">Ir a la entrega pendiente</a></p> : null}
            {canAcknowledgeTopAction ? <form method="post" action="/api/creator/customers/action"><input type="hidden" name="userId" value={topAction.user_id ?? ""} /><input type="hidden" name="action" value={topAction.action ?? ""} /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.secondary} type="submit">Marcar acción realizada</button></form> : null}
          </> : <p className={styles.empty}>Todavía no hay suficiente actividad para recomendar una acción.</p>}
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>YOUR WORLD</p><h2>{worlds.length ? "Tus Worlds" : "Crea tu primer World"}</h2>
          {worlds.length ? <ul className={styles.list}>{worlds.map((world) => <li className={styles.item} key={world.id}><div className={styles.row}><div><Link className={styles.customerLink} href={`/world/${world.slug}`}>{world.display_name}</Link><p className={styles.muted}>{world.description || "Sin descripción"}</p></div><span className={styles.pill}>{world.status}</span></div></li>)}</ul> : null}
          <form className={styles.form} method="post" action="/api/creator/worlds"><input type="hidden" name="returnTo" value="/creator" /><label>Nombre<input name="displayName" minLength={2} maxLength={80} required placeholder="Mi World" /></label><label>Slug<input name="slug" placeholder="mi-world" /></label><label>Descripción<textarea name="description" maxLength={1200} placeholder="Qué encontrará la gente aquí." /></label><label>Visibilidad<select name="visibility"><option value="public">Público</option><option value="private">Privado</option></select></label><button className={styles.secondary} type="submit">Crear World</button></form>
        </article>

        <article className={styles.card}>
          <p className={styles.eyebrow}>{selectedDemand ? "DEMAND → OFFER" : "FIRST OFFER"}</p><h2>{selectedDemand ? "Convierte intención en algo comprable." : "Crea una oferta simple."}</h2>
          {worlds.length ? <form className={styles.form} method="post" action="/api/creator/offers"><input type="hidden" name="returnTo" value="/creator" />
            <label>World<select name="worldId" defaultValue={defaultWorld?.id}>{worlds.map((world) => <option value={world.id} key={world.id}>{world.display_name}</option>)}</select></label>
            <label>Título<input name="title" required minLength={2} maxLength={140} defaultValue={selectedDemand?.title ?? ""} /></label>
            <label>Descripción<textarea name="description" required minLength={2} maxLength={1200} defaultValue={selectedDemand ? `Creado desde demanda validada: ${selectedDemand.title}` : ""} /></label>
            <div className={styles.twoCol}><label>Familia<select name="offerFamily" defaultValue={selectedDemand?.fulfillment_type === "membership" ? "membership" : "digital_product"}><option value="digital_product">Digital product</option><option value="personalized_digital">Personalized digital</option><option value="limited_drop">Limited drop</option><option value="membership">Membership</option><option value="bounded_interaction">Bounded interaction</option></select></label><label>Precio CLP<input name="price" type="number" min="1" step="1" required /></label></div>
            <input type="hidden" name="currency" value="CLP" /><label>Fulfillment<input name="fulfillmentConcept" defaultValue="digital_delivery" /></label><label>Status<select name="status"><option value="active">Activo</option><option value="draft">Borrador</option></select></label>{selectedDemand?.demand_request_id ? <input type="hidden" name="demandRequestId" value={selectedDemand.demand_request_id} /> : null}<button className={styles.button} type="submit">Crear oferta</button></form> : <p className={styles.empty}>Primero crea un World. No se crean ofertas huérfanas.</p>}
        </article>
      </section>

      <h2 className={styles.sectionTitle}>Customers to pay attention to</h2>
      <section className={styles.grid}>
        <article className={`${styles.card} ${styles.wide}`}>
          {dashboard.customers.length === 0 ? <p className={styles.empty}>No customers yet. Share your World to start learning what people want.</p> : <ul className={styles.list}>{dashboard.customers.map((customer) => {
            const next = dashboard.nextActions.find((item) => item.user_id === customer.user_id);
            return <li className={styles.item} key={customer.user_id ?? "unknown"}><div className={styles.row}><div><Link className={styles.customerLink} href={`/creator/customers/${customer.user_id}`}>{customer.alias || "Mara user"}</Link><p className={styles.muted}>{customer.lifecycle_stage} · {customer.purchase_count ?? 0} compras · {formatMoney(customer.creator_gmv_minor)}</p></div><div><span className={styles.pill}>{next?.action ?? "NO_ACTION"}</span><p className={styles.small}>{next?.reason ?? "Sin acción recomendada"}</p></div></div></li>;
          })}</ul>}
        </article>
      </section>

      <h2 className={styles.sectionTitle} id="pending-fulfillment">Pending fulfillment</h2>
      <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>
        {pending.length === 0 ? <p className={styles.empty}>No hay entregas pendientes.</p> : <ul className={styles.list}>{pending.map((purchase) => <li className={styles.item} key={purchase.id}><div className={styles.row}><div><strong>{formatMoney(purchase.amount_minor, purchase.currency)}</strong><p className={styles.muted}>Compra {purchase.id.slice(0, 8)} · {new Date(purchase.created_at).toLocaleDateString("es-CL")}</p></div><form method="post" action="/api/creator/fulfillment"><input type="hidden" name="purchaseId" value={purchase.id} /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.button} type="submit">Marcar entregado</button></form></div></li>)}</ul>}
      </article></section>
    </div></main>
  );
}
