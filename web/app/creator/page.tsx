import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { CreatorSiteActions } from "@/components/creator-site-actions";
import { ProductTelemetry } from "@/components/product-telemetry";
import { creatorSiteConfig } from "@/lib/creator-site";
import { creatorActionTitle, isCreatorActionAcknowledgeable, normalizeCreatorAction } from "@/lib/creator-actions";
import { formatMoney, readCreatorDashboard, readOwnCreator, readOwnWorlds } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

type Query = { demand?: string; site?: string; saved?: string; created?: string; error?: string };

export default async function CreatorHomePage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const session = await getVerifiedSession();

  if (!session.ok || !session.user.id) {
    return <main className={styles.shell}><div className={styles.container}><section className={styles.hero}><p className={styles.eyebrow}>CREATOR OS</p><h1>Tu sitio en Mara empieza después de entrar.</h1><p>Necesitas una sesión real para leer y operar tus datos bajo RLS.</p><Link className={styles.button} href="/auth">Entrar</Link></section></div></main>;
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) {
    const enabled = process.env.MARA_ALPHA_CREATOR_ONBOARDING_ENABLED === "true";
    return <main className={styles.shell}><div className={styles.container}>
      <nav className={styles.nav}><Link href="/">MARA</Link><Link className={styles.secondary} href="/auth">Cuenta</Link></nav>
      <section className={styles.hero}><p className={styles.eyebrow}>CREATOR ALPHA</p><h1>Crea tu sitio en Mara.</h1><p>Activa una cuenta de creadora y empieza con un sitio. Sin CRM gigante ni configuración innecesaria.</p></section>
      <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}><h2>Activar Creator Alpha</h2><p className={styles.muted}>La activación usa un endpoint server-side controlado; no abre auto-registro de creadoras sin autorización.</p>
        {enabled ? <form method="post" action="/api/creator/me"><input type="hidden" name="returnTo" value="/creator" /><button className={styles.button} type="submit">Activar Creator Alpha</button></form> : <p className={styles.notice}>Entorno cerrado: habilita <code>MARA_ALPHA_CREATOR_ONBOARDING_ENABLED=true</code> solo para el piloto autorizado.</p>}
      </article></section>
    </div></main>;
  }

  const sites = await readOwnWorlds(session.accessToken, creator.id);
  const dashboard = await readCreatorDashboard(session.accessToken, creator.id);
  const selectedDemand = query.demand ? dashboard.opportunities.find((item) => item.demand_request_id === query.demand) : null;
  const demandSite = selectedDemand?.world_id ? sites.find((site) => site.id === selectedDemand.world_id) : null;
  const selectedSite = (query.site ? sites.find((site) => site.id === query.site) : null) ?? demandSite ?? sites[0] ?? null;
  const config = selectedSite ? creatorSiteConfig(selectedSite) : null;

  const pending = dashboard.purchases.filter((purchase) => !purchase.fulfilled_at);
  const gmv = dashboard.customers.reduce((sum, customer) => sum + (customer.creator_gmv_minor ?? 0), 0);
  const repeat = dashboard.customers.filter((customer) => (customer.purchase_count ?? 0) >= 2).length;
  const topAction = dashboard.nextActions.find((item) => item.priority === "high") ?? dashboard.nextActions[0];
  const normalizedTopAction = normalizeCreatorAction(topAction?.action);
  const bestOpportunity = dashboard.opportunities[0];
  const siteAction = !selectedSite
    ? { title: "Crea tu sitio", reason: "Sin un sitio publicado no existe un destino directo para tu audiencia.", href: "#creator-site" }
    : selectedSite.status !== "active"
      ? { title: "Publica tu sitio", reason: "Tu sitio sigue en borrador. Revísalo y publícalo cuando la identidad y oferta estén listas.", href: "#creator-site" }
      : selectedSite.visibility !== "public"
        ? { title: "Haz público tu sitio", reason: "Tu sitio está activo pero privado; tu audiencia todavía no puede descubrirlo.", href: "#creator-site" }
        : null;
  const suggestedPriceMajor = selectedDemand?.average_commit_wtp_minor ? Math.max(1, Math.round(selectedDemand.average_commit_wtp_minor / 100)) : undefined;
  const canAcknowledgeTopAction = Boolean(topAction?.user_id && isCreatorActionAcknowledgeable(topAction.action));

  return <main className={styles.shell}><div className={styles.container}>
    {bestOpportunity ? <ProductTelemetry event="creator_opportunity_viewed" surface="/creator" target="best_opportunity" placement="creator_home" /> : null}
    {pending.length > 0 ? <ProductTelemetry event="fulfillment_viewed" surface="/creator" target="pending_fulfillment" placement="creator_home" /> : null}

    <nav className={styles.nav}>
      <Link href="/">MARA</Link>
      <div className={styles.actions}><Link className={styles.secondary} href="/auth">Cuenta</Link></div>
    </nav>

    <header className={styles.hero}><p className={styles.eyebrow}>CREATOR OS · {creator.status} · {creator.plan}</p><h1>Lo importante hoy.</h1><p>Qué quiere tu audiencia, qué vendiste, qué debes entregar y qué conviene hacer después.</p></header>

    {query.created ? <p className={styles.notice}>Sitio creado como borrador. Revísalo y publícalo cuando esté listo.</p> : null}
    {query.saved ? <p className={styles.notice}>Cambios guardados.</p> : null}
    {query.error ? <p className={styles.notice}>No pude guardar el sitio: {query.error === "handle_taken" ? "ese handle ya está ocupado." : query.error === "reserved_handle" ? "ese handle está reservado por Mara." : "revisa los datos e inténtalo de nuevo."}</p> : null}

    <section className={styles.grid}>
      <article className={styles.third}><p className={styles.eyebrow}>VENTAS</p><p className={styles.metric}>{formatMoney(gmv)}</p><p className={styles.muted}>{dashboard.customers.length} clientes · {repeat} recurrentes</p></article>
      <article className={styles.third}><p className={styles.eyebrow}>ENTREGAS</p><p className={styles.metric}>{pending.length}</p><p className={styles.muted}>compras pagadas pendientes</p></article>
      <article className={styles.third}><p className={styles.eyebrow}>DEMANDA</p><p className={styles.metric}>{dashboard.opportunities.length}</p><p className={styles.muted}>oportunidades reales</p></article>
    </section>

    <section className={styles.grid}>
      <article className={styles.card}>
        <p className={styles.eyebrow}>MEJOR OPORTUNIDAD</p>
        {bestOpportunity ? <><h2>{bestOpportunity.title}</h2><p>{bestOpportunity.want_count ?? 0} quieren · {bestOpportunity.pledge_count ?? 0} interés serio · {bestOpportunity.commit_count ?? 0} compromisos.</p><p className={styles.muted}>Demanda verificada {formatMoney(bestOpportunity.verified_demand_gmv_minor)}{bestOpportunity.average_commit_wtp_minor ? ` · WTP medio ${formatMoney(bestOpportunity.average_commit_wtp_minor)}` : ""}</p><Link className={styles.button} href={`/creator?demand=${bestOpportunity.demand_request_id}`}>Crear oferta desde esta demanda</Link></> : <p className={styles.empty}>No hay demanda todavía. Publica y comparte tu sitio para empezar a aprender.</p>}
      </article>
      <article className={styles.card}>
        <p className={styles.eyebrow}>QUÉ HACER AHORA</p>
        {siteAction ? <><h2>{siteAction.title}</h2><p className={styles.muted}>{siteAction.reason}</p><a className={styles.button} href={siteAction.href}>Ir al sitio</a></> : topAction ? <><h2>{creatorActionTitle(topAction.action)}</h2><p className={styles.muted}>{topAction.reason}</p><span className={styles.pill}>{topAction.priority}</span>{normalizedTopAction === "fulfill" ? <p><a className={styles.secondary} href="#pending-fulfillment">Ir a fulfillment</a></p> : null}{canAcknowledgeTopAction ? <form method="post" action="/api/creator/customers/action"><input type="hidden" name="userId" value={topAction.user_id ?? ""} /><input type="hidden" name="action" value={normalizedTopAction} /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.secondary} type="submit">Marcar acción realizada</button></form> : null}</> : <p className={styles.empty}>Todavía no hay suficiente actividad para recomendar una acción.</p>}
      </article>
    </section>

    <h2 className={styles.sectionTitle} id="creator-site">Tu sitio en Mara</h2>
    <section className={styles.grid}>
      <article className={styles.card}>
        <p className={styles.eyebrow}>TU SITIO</p>
        {sites.length ? <ul className={styles.list}>{sites.map((site) => <li className={styles.item} key={site.id}><div className={styles.row}><div><Link className={styles.customerLink} href={`/creator?site=${site.id}`}>{site.display_name}</Link><p className={styles.muted}>mara.com/{site.slug}</p></div><div className={styles.actions}><span className={styles.pill}>{site.status}</span><span className={styles.pill}>{site.visibility}</span></div></div></li>)}</ul> : <p className={styles.empty}>Todavía no tienes un sitio.</p>}

        {!sites.length ? <><div className={styles.onboardingSteps}><div className={styles.onboardingStep}><strong>1 · Identidad</strong>Nombre, handle y bio.</div><div className={styles.onboardingStep}><strong>2 · Personaliza</strong>Foto, portada y estilo.</div><div className={styles.onboardingStep}><strong>3 · Revisa</strong>Previsualiza antes de publicar.</div><div className={styles.onboardingStep}><strong>4 · Comparte</strong>Copia tu enlace y llévalo a tu audiencia.</div></div><form className={styles.form} method="post" action="/api/creator/worlds"><input type="hidden" name="returnTo" value="/creator" /><label>Nombre público<input name="displayName" minLength={2} maxLength={80} required placeholder="Tu nombre o marca" /></label><label>Handle<input name="slug" required placeholder="tu-nombre" /></label><label>Bio<textarea name="description" maxLength={1200} placeholder="Qué encontrará tu audiencia aquí." /></label><label>Visibilidad<select name="visibility"><option value="public">Público al publicar</option><option value="private">Privado</option></select></label><button className={styles.button} type="submit">Crear mi sitio</button></form></> : null}
      </article>

      <article className={styles.card}>
        <p className={styles.eyebrow}>ESTADO DEL SITIO</p>
        {selectedSite && config ? <><h2>{selectedSite.display_name}</h2><p className={styles.muted}>mara.com/{selectedSite.slug} · {selectedSite.status} · {selectedSite.visibility}</p><CreatorSiteActions slug={selectedSite.slug} published={selectedSite.status === "active" && selectedSite.visibility === "public"} /></> : <p className={styles.empty}>Crea tu primer sitio para habilitar preview, edición y publicación.</p>}
      </article>
    </section>

    {selectedSite && config ? <section className={styles.grid}>
      <article className={`${styles.card} ${styles.wide}`}>
        <p className={styles.eyebrow}>EDITAR SITIO</p><h2>Haz que se sienta tuyo.</h2>
        <form className={styles.form} method="post" action={`/api/creator/sites/${selectedSite.id}`}>
          <input type="hidden" name="returnTo" value="/creator" />
          <div className={styles.twoCol}><label>Nombre público<input name="displayName" defaultValue={selectedSite.display_name} minLength={2} maxLength={80} required /></label><label>Handle<input name="slug" defaultValue={selectedSite.slug} minLength={2} maxLength={80} required /></label></div>
          <label>Bio<textarea name="description" defaultValue={selectedSite.description} maxLength={1200} /></label>
          <div className={styles.twoCol}><label>Foto de perfil <span className={styles.small}>(enlace de imagen por ahora)</span><input name="avatarUrl" type="url" defaultValue={config.avatarUrl ?? ""} placeholder="https://..." /></label><label>Portada <span className={styles.small}>(enlace de imagen por ahora)</span><input name="coverUrl" type="url" defaultValue={config.coverUrl ?? ""} placeholder="https://..." /></label></div>
          <div className={styles.twoCol}><label>Estilo<select name="theme" defaultValue={config.theme}><option value="clean">Clean · editorial</option><option value="bold">Bold · creadora primero</option><option value="dark">Dark · premium</option></select></label><label>Color de acento<input name="accent" type="text" defaultValue={config.accent} pattern="#[0-9A-Fa-f]{6}" /></label></div><div className={styles.twoCol}><label>Visibilidad<select name="visibility" defaultValue={selectedSite.visibility}><option value="public">Público</option><option value="private">Privado</option></select></label></div>
          <div className={styles.twoCol}><label>CTA principal<input name="primaryCtaLabel" defaultValue={config.primaryCtaLabel} maxLength={60} /></label><label>URL del CTA<input name="primaryCtaUrl" type="url" defaultValue={config.primaryCtaUrl ?? ""} placeholder="https://..." /></label></div>
          <div className={styles.twoCol}><label>Instagram<input name="instagram" type="url" defaultValue={config.socials.instagram ?? ""} placeholder="https://instagram.com/..." /></label><label>TikTok<input name="tiktok" type="url" defaultValue={config.socials.tiktok ?? ""} placeholder="https://tiktok.com/@..." /></label><label>X<input name="x" type="url" defaultValue={config.socials.x ?? ""} placeholder="https://x.com/..." /></label><label>YouTube<input name="youtube" type="url" defaultValue={config.socials.youtube ?? ""} placeholder="https://youtube.com/..." /></label></div>
          <fieldset className={styles.modulePicker}><legend>Módulos visibles</legend><label><input type="checkbox" name="moduleDemand" defaultChecked={config.modules.demand} /> Demanda</label><label><input type="checkbox" name="moduleOffers" defaultChecked={config.modules.offers} /> Ofertas</label><label><input type="checkbox" name="moduleMemory" defaultChecked={config.modules.memory} /> Continuidad</label></fieldset>
          <div className={styles.actions}><button className={styles.secondary} name="action" value="save" type="submit">Guardar cambios</button>{selectedSite.status === "active" ? <button className={styles.secondary} name="action" value="unpublish" type="submit">Pasar a borrador</button> : <button className={styles.button} name="action" value="publish" type="submit">Publicar sitio</button>}</div>
        </form>
      </article>
    </section> : null}

    <h2 className={styles.sectionTitle}>Ofertas</h2>
    <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>
      <p className={styles.eyebrow}>{selectedDemand ? "DEMANDA → OFERTA" : "NUEVA OFERTA"}</p><h2>{selectedDemand ? "Convierte intención en algo comprable." : "Crea una oferta simple."}</h2>
      {sites.length ? <form className={styles.form} method="post" action="/api/creator/offers"><input type="hidden" name="returnTo" value="/creator" />{selectedDemand ? <p className={styles.notice}>Contexto: {selectedDemand.want_count ?? 0} quieren · {selectedDemand.commit_count ?? 0} compromisos · {formatMoney(selectedDemand.verified_demand_gmv_minor)} de demanda verificada{suggestedPriceMajor ? ` · precio sugerido por WTP: ${formatMoney(suggestedPriceMajor * 100)}` : ""}.</p> : null}<label>Sitio<select name="worldId" defaultValue={demandSite?.id ?? selectedSite?.id}>{sites.map((site) => <option value={site.id} key={site.id}>{site.display_name}</option>)}</select></label><label>Título<input name="title" required minLength={2} maxLength={140} defaultValue={selectedDemand?.title ?? ""} /></label><label>Descripción<textarea name="description" required minLength={2} maxLength={1200} defaultValue={selectedDemand ? `Creado desde demanda validada: ${selectedDemand.title}` : ""} /></label><div className={styles.twoCol}><label>Familia<select name="offerFamily" defaultValue={selectedDemand?.fulfillment_type === "membership" ? "membership" : "digital_product"}><option value="digital_product">Digital product</option><option value="personalized_digital">Personalized digital</option><option value="limited_drop">Limited drop</option><option value="membership">Membership</option><option value="bounded_interaction">Bounded interaction</option></select></label><label>Precio CLP<input name="price" type="number" min="1" step="1" required defaultValue={suggestedPriceMajor} /></label></div><input type="hidden" name="currency" value="CLP" /><label>Cómo se entrega<input name="fulfillmentConcept" defaultValue="digital_delivery" /></label><label>Estado<select name="status"><option value="draft">Borrador</option><option value="active">Activo</option></select></label>{selectedDemand?.demand_request_id ? <input type="hidden" name="demandRequestId" value={selectedDemand.demand_request_id} /> : null}<button className={styles.button} type="submit">Crear oferta</button></form> : <p className={styles.empty}>Primero crea un sitio.</p>}
    </article></section>

    <h2 className={styles.sectionTitle}>Clientes a los que mirar</h2>
    <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>{dashboard.customers.length === 0 ? <p className={styles.empty}>Tus primeros clientes aparecerán aquí cuando alguien compre o deje una señal útil. Comparte tu sitio para empezar a aprender.</p> : <ul className={styles.list}>{dashboard.customers.map((customer) => { const next = dashboard.nextActions.find((item) => item.user_id === customer.user_id); return <li className={styles.item} key={customer.user_id ?? "unknown"}><div className={styles.row}><div><Link className={styles.customerLink} href={`/creator/customers/${customer.user_id}`}>{customer.alias || "Mara user"}</Link><p className={styles.muted}>{customer.lifecycle_stage} · {customer.purchase_count ?? 0} compras · {formatMoney(customer.creator_gmv_minor)}</p></div><div><span className={styles.pill}>{normalizeCreatorAction(next?.action)}</span><p className={styles.small}>{next?.reason ?? "Sin acción recomendada"}</p></div></div></li>; })}</ul>}</article></section>

    <h2 className={styles.sectionTitle} id="pending-fulfillment">Entregas pendientes</h2>
    <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>{pending.length === 0 ? <p className={styles.empty}>No hay entregas pendientes.</p> : <ul className={styles.list}>{pending.map((purchase) => <li className={styles.item} key={purchase.id}><div className={styles.row}><div><strong>{formatMoney(purchase.amount_minor, purchase.currency)}</strong><p className={styles.muted}>Compra {purchase.id.slice(0, 8)} · {new Date(purchase.created_at).toLocaleDateString("es-CL")}</p></div><form method="post" action="/api/creator/fulfillment"><input type="hidden" name="purchaseId" value={purchase.id} /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.button} type="submit">Marcar entregado</button></form></div></li>)}</ul>}</article></section>
  </div></main>;
}
