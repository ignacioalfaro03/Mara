import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { ProductTelemetry } from "@/components/product-telemetry";
import { CreatorOperationsPanels } from "@/components/creator-operations-panels";
import { creatorActionTitle, isCreatorActionAcknowledgeable, normalizeCreatorAction } from "@/lib/creator-actions";
import { formatMoney, readCreatorDashboard, readOwnCreator, readOwnWorlds } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function CreatorHomePage({ searchParams }: { searchParams: Promise<{ demand?: string }> }) {
  const query = await searchParams;
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>CREATOR OS</p>
            <h1>Tu negocio vive detrás de tu World.</h1>
            <p>Entra para leer tus datos reales bajo RLS: clientes, ventas, solicitudes, demanda, ofertas y entregas.</p>
            <Link className={styles.button} href="/auth">Entrar</Link>
          </section>
        </div>
      </main>
    );
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) {
    const enabled = process.env.MARA_ALPHA_CREATOR_ONBOARDING_ENABLED === "true";
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <nav className={styles.nav}><Link href="/">MARA</Link><Link className={styles.secondary} href="/auth">Cuenta</Link></nav>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>PRIVATE ALPHA · CREATOR</p>
            <h1>Primero: algo que puedas vender.</h1>
            <p>La activación empieza pequeña: identidad pública, un World y una primera oferta. Mara añade inteligencia y operación después, sin obligarte a montar un sistema gigante antes de vender.</p>
          </section>
          <section className={styles.grid}>
            <article className={`${styles.card} ${styles.wide}`}>
              <p className={styles.eyebrow}>ACTIVATION</p>
              <h2>Activa la capa Creator.</h2>
              <p className={styles.muted}>La activación usa un endpoint server-side controlado. No abre una policy para que cualquier visitante pueda convertirse en creador desde el navegador.</p>
              {enabled ? (
                <form method="post" action="/api/creator/me">
                  <input type="hidden" name="returnTo" value="/creator" />
                  <button className={styles.button} type="submit">Activar Creator Alpha</button>
                </form>
              ) : (
                <p className={styles.notice}>Este entorno todavía no autoriza onboarding de creadoras.</p>
              )}
            </article>
          </section>
        </div>
      </main>
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
  const normalizedTopAction = normalizeCreatorAction(topAction?.action);
  const bestOpportunity = dashboard.opportunities[0];
  const canAcknowledgeTopAction = Boolean(topAction?.user_id && isCreatorActionAcknowledgeable(topAction.action));

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        {bestOpportunity ? <ProductTelemetry event="creator_opportunity_viewed" surface="/creator" target="best_opportunity" placement="creator_home" /> : null}
        {pending.length > 0 ? <ProductTelemetry event="fulfillment_viewed" surface="/creator" target="pending_fulfillment" placement="creator_home" /> : null}

        <nav className={styles.nav}>
          <Link href="/">MARA</Link>
          <div className={styles.actions}>
            {defaultWorld ? <Link className={styles.secondary} href={`/app/people/${defaultWorld.slug}`}>Ver perfil público</Link> : null}
            <Link className={styles.secondary} href="/auth">Cuenta</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR OS · {creator.status} · {creator.plan}</p>
          <h1>Qué pasó. Quién necesita atención. Qué vender ahora.</h1>
          <p>Mara reduce el negocio a decisiones: ingresos, clientes, solicitudes, ofertas, entregas y señales de lo que tu audiencia quiere.</p>
        </header>

        <section className={styles.grid}>
          <article className={styles.third}><p className={styles.eyebrow}>INGRESOS</p><p className={styles.metric}>{formatMoney(gmv)}</p><p className={styles.muted}>{dashboard.customers.length} clientes · {repeat} recurrentes</p></article>
          <article className={styles.third}><p className={styles.eyebrow}>POR ENTREGAR</p><p className={styles.metric}>{pending.length}</p><p className={styles.muted}>compras pagadas pendientes de entrega</p></article>
          <article className={styles.third}><p className={styles.eyebrow}>INTERÉS</p><p className={styles.metric}>{dashboard.opportunities.length}</p><p className={styles.muted}>oportunidades agregadas en tus Worlds</p></article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.connection}`}>
            <p className={styles.eyebrow}>QUÉ QUIEREN</p>
            {bestOpportunity ? (
              <>
                <h2>{bestOpportunity.title}</h2>
                <p>{bestOpportunity.want_count ?? 0} interesados · {bestOpportunity.pledge_count ?? 0} con intención seria · {bestOpportunity.commit_count ?? 0} comprometidos</p>
                <p className={styles.muted}>Avance {Math.round(bestOpportunity.progress_percent ?? 0)}% · demanda verificada {formatMoney(bestOpportunity.verified_demand_gmv_minor)}</p>
                <Link className={styles.button} href={`/creator?demand=${bestOpportunity.demand_request_id}`}>Convertir en oferta</Link>
              </>
            ) : (
              <p className={styles.empty}>Todavía no hay señal suficiente para recomendar una oferta desde demanda. No produzcas de más solo para llenar catálogo.</p>
            )}
          </article>

          <article className={styles.card}>
            <p className={styles.eyebrow}>QUÉ HACER AHORA</p>
            {topAction ? (
              <>
                <h2>{creatorActionTitle(topAction.action)}</h2>
                <p className={styles.muted}>{topAction.reason}</p>
                <span className={styles.pill}>{topAction.priority}</span>
                {normalizedTopAction === "fulfill" ? <p><a className={styles.secondary} href="#pending-fulfillment">Ir a la entrega pendiente</a></p> : null}
                {canAcknowledgeTopAction ? (
                  <form method="post" action="/api/creator/customers/action">
                    <input type="hidden" name="userId" value={topAction.user_id ?? ""} />
                    <input type="hidden" name="action" value={normalizedTopAction} />
                    <input type="hidden" name="returnTo" value="/creator" />
                    <button className={styles.secondary} type="submit">Marcar como realizada</button>
                  </form>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>Todavía no hay suficiente actividad para recomendar una acción concreta.</p>
            )}
          </article>
        </section>

        <h2 className={styles.sectionTitle}>Tu presencia y tus ofertas</h2>
        <section className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>PERFIL</p>
            <h2>{worlds.length ? "Tu espacio público y comercial." : "Crea tu primer World."}</h2>
            {worlds.length ? (
              <ul className={styles.list}>
                {worlds.map((world) => (
                  <li className={styles.item} key={world.id}>
                    <div className={styles.row}>
                      <div><Link className={styles.customerLink} href={`/app/people/${world.slug}`}>{world.display_name}</Link><p className={styles.muted}>{world.description || "Sin descripción"}</p></div>
                      <span className={styles.pill}>{world.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            <form className={styles.form} method="post" action="/api/creator/worlds">
              <input type="hidden" name="returnTo" value="/creator" />
              <label>Nombre público<input name="displayName" minLength={2} maxLength={80} required placeholder="Mi espacio" /></label>
              <label>URL<input name="slug" placeholder="mi-perfil" /></label>
              <label>Qué encontrará la gente<textarea name="description" maxLength={1200} placeholder="Quién eres, qué compartes y qué pueden conseguir aquí." /></label>
              <label>Visibilidad<select name="visibility"><option value="public">Público</option><option value="private">Privado</option></select></label>
              <button className={styles.secondary} type="submit">Crear perfil</button>
            </form>
          </article>

          <article className={styles.card}>
            <p className={styles.eyebrow}>{selectedDemand ? "INTERÉS → OFERTA" : "OFERTAS"}</p>
            <h2>{selectedDemand ? "La señal existe. Ahora hazla comprable." : "Pon algo a la venta."}</h2>
            <p className={styles.muted}>{selectedDemand ? "La audiencia ya te entrega contexto. Define claramente qué recibe y cuánto cuesta." : "Una oferta puede ser contenido, un producto digital, una interacción acotada o una membresía preparada para cuando el cobro recurrente exista."}</p>
            {worlds.length ? (
              <form className={styles.form} method="post" action="/api/creator/offers">
                <input type="hidden" name="returnTo" value="/creator" />
                <label>Perfil<select name="worldId" defaultValue={defaultWorld?.id}>{worlds.map((world) => <option value={world.id} key={world.id}>{world.display_name}</option>)}</select></label>
                <label>Título<input name="title" required minLength={2} maxLength={140} defaultValue={selectedDemand?.title ?? ""} /></label>
                <label>Qué recibe la persona<textarea name="description" required minLength={2} maxLength={1200} defaultValue={selectedDemand ? `Creado desde demanda validada: ${selectedDemand.title}` : ""} /></label>
                <div className={styles.twoCol}>
                  <label>Formato<select name="offerFamily" defaultValue={selectedDemand?.fulfillment_type === "membership" ? "membership" : "digital_product"}><option value="digital_product">Producto digital</option><option value="personalized_digital">Digital personalizado</option><option value="limited_drop">Drop limitado</option><option value="membership">Membresía</option><option value="bounded_interaction">Interacción acotada</option></select></label>
                  <label>Precio CLP<input name="price" type="number" min="1" step="1" required /></label>
                </div>
                <input type="hidden" name="currency" value="CLP" />
                <label>Entrega<input name="fulfillmentConcept" defaultValue="digital_delivery" /></label>
                <label>Estado<select name="status"><option value="active">Activo</option><option value="draft">Borrador</option></select></label>
                {selectedDemand?.demand_request_id ? <input type="hidden" name="demandRequestId" value={selectedDemand.demand_request_id} /> : null}
                <button className={styles.button} type="submit">Crear oferta</button>
              </form>
            ) : <p className={styles.empty}>Primero crea tu perfil público. No se crean ofertas huérfanas.</p>}
          </article>
        </section>

        <CreatorOperationsPanels accessToken={session.accessToken} creatorId={creator.id} worlds={worlds} offers={dashboard.offers} />

        <h2 className={styles.sectionTitle}>Clientes que merecen atención</h2>
        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            {dashboard.customers.length === 0 ? (
              <p className={styles.empty}>Todavía no hay relaciones comerciales reales. Cuando alguien interactúe o compre, Mara empieza a construir contexto.</p>
            ) : (
              <ul className={styles.list}>
                {dashboard.customers.map((customer) => {
                  const next = dashboard.nextActions.find((item) => item.user_id === customer.user_id);
                  return (
                    <li className={styles.item} key={customer.user_id ?? "unknown"}>
                      <div className={styles.row}>
                        <div><Link className={styles.customerLink} href={`/creator/customers/${customer.user_id}`}>{customer.alias || "Mara user"}</Link><p className={styles.muted}>{customer.lifecycle_stage} · {customer.purchase_count ?? 0} compras · {formatMoney(customer.creator_gmv_minor)}</p></div>
                        <div><span className={styles.pill}>{normalizeCreatorAction(next?.action)}</span><p className={styles.small}>{next?.reason ?? "Sin acción recomendada"}</p></div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        </section>

        <h2 className={styles.sectionTitle} id="pending-fulfillment">Por entregar</h2>
        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            {pending.length === 0 ? (
              <p className={styles.empty}>No hay entregas pendientes.</p>
            ) : (
              <ul className={styles.list}>
                {pending.map((purchase) => (
                  <li className={styles.item} key={purchase.id}>
                    <div className={styles.row}>
                      <div><strong>{formatMoney(purchase.amount_minor, purchase.currency)}</strong><p className={styles.muted}>Compra {purchase.id.slice(0, 8)} · {new Date(purchase.created_at).toLocaleDateString("es-CL")}</p></div>
                      <form method="post" action="/api/creator/fulfillment"><input type="hidden" name="purchaseId" value={purchase.id} /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.button} type="submit">Marcar entregado</button></form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
