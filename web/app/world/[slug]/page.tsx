import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { StorefrontCheckoutButton } from "@/components/storefront-checkout-button";
import {
  formatMoney,
  historyCopy,
  readDemandMetrics,
  readOwnCreator,
  readUserWorldHistory,
  readWeakness,
  readWorld,
  readWorldDemand,
  readWorldOffers,
} from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function CreatorWorldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getVerifiedSession();
  const accessToken = session.ok ? session.accessToken : undefined;
  const userId = session.ok ? session.user.id : undefined;
  const world = await readWorld(slug, accessToken);
  if (!world) notFound();

  const creator = session.ok && session.user.id ? await readOwnCreator(session.accessToken, session.user.id) : null;
  const owner = creator?.id === world.creator_id;
  const [offers, demands] = await Promise.all([
    readWorldOffers(world.id, accessToken, owner),
    readWorldDemand(world.id, accessToken),
  ]);
  const metrics = await readDemandMetrics(demands.map((item) => item.id), accessToken);
  const metricByDemand = new Map(metrics.map((item) => [item.demand_request_id, item]));
  const weakness = session.ok && userId ? await readWeakness(session.accessToken, userId, world) : null;
  const history = session.ok && userId ? await readUserWorldHistory(session.accessToken, userId, world.id) : [];
  const returnTo = `/world/${world.slug}`;

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/">MARA</Link>
          <div className={styles.actions}>
            {session.ok ? <Link className={styles.secondary} href="/me/history">Mi historia</Link> : <Link className={styles.secondary} href="/auth">Entrar</Link>}
            {owner ? <Link className={styles.secondary} href="/creator">Creator Home</Link> : null}
          </div>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR WORLD · {world.visibility}</p>
          <h1>{world.display_name}</h1>
          <p>{world.description || "Un espacio vivo que aprende de lo que te interesa y conecta demanda, ofertas e historia sin sentirse como un catálogo."}</p>
        </header>

        {history.length > 0 ? (
          <section className={`${styles.card} ${styles.wide} ${styles.connection}`} style={{ marginTop: 22 }}>
            <p className={styles.eyebrow}>MARA NOTÓ ALGO</p>
            <h2>Mientras no estabas…</h2>
            <ul className={styles.list}>
              {history.slice(0, 3).map((event, index) => <li className={styles.item} key={`${event.event_type}-${event.object_id}-${index}`}>{historyCopy(event.event_type)}</li>)}
            </ul>
          </section>
        ) : null}

        <section className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>MARA TE VA CONOCIENDO</p>
            <h2>Una elección pequeña</h2>
            <p className={styles.muted}>No es una encuesta. Solo una señal opcional para que lo que aparezca después tenga más sentido para ti.</p>
            {session.ok ? (
              <div className={styles.actions}>
                <form method="post" action="/api/preferences">
                  <input type="hidden" name="eventType" value="taste_choice" />
                  <input type="hidden" name="choiceGroup" value="world_format_v1" />
                  <input type="hidden" name="selectedOption" value="audio" />
                  <input type="hidden" name="alternativeOption" value="image" />
                  <input type="hidden" name="surface" value={returnTo} />
                  <input type="hidden" name="contextVersion" value="v1" />
                  <input type="hidden" name="signalScope" value="creator_world" />
                  <input type="hidden" name="creatorId" value={world.creator_id} />
                  <input type="hidden" name="worldId" value={world.id} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <button className={styles.button} type="submit">Audio</button>
                </form>
                <form method="post" action="/api/preferences">
                  <input type="hidden" name="eventType" value="taste_choice" />
                  <input type="hidden" name="choiceGroup" value="world_format_v1" />
                  <input type="hidden" name="selectedOption" value="image" />
                  <input type="hidden" name="alternativeOption" value="audio" />
                  <input type="hidden" name="surface" value={returnTo} />
                  <input type="hidden" name="contextVersion" value="v1" />
                  <input type="hidden" name="signalScope" value="creator_world" />
                  <input type="hidden" name="creatorId" value={world.creator_id} />
                  <input type="hidden" name="worldId" value={world.id} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <button className={styles.secondary} type="submit">Imagen</button>
                </form>
              </div>
            ) : <Link className={styles.secondary} href="/auth">Entrar para que Mara recuerde</Link>}
          </article>

          <article className={styles.card}>
            <p className={styles.eyebrow}>MY WEAKNESS</p>
            <h2>Díselo solo si quieres.</h2>
            <p className={styles.muted}>Es texto declarado por ti, no una inferencia psicológica. En este World tú decides si la creadora puede verlo.</p>
            {session.ok ? (
              <form className={styles.form} method="post" action="/api/weakness">
                <input type="hidden" name="scope" value="creator_world" />
                <input type="hidden" name="creatorId" value={world.creator_id} />
                <input type="hidden" name="worldId" value={world.id} />
                <input type="hidden" name="returnTo" value={returnTo} />
                <textarea name="valueText" maxLength={1000} defaultValue={weakness?.value_text ?? ""} placeholder="Algo que te encanta, te tienta o te cuesta ignorar…" />
                <label><span><input style={{ width: "auto" }} type="checkbox" name="creatorVisible" defaultChecked={weakness?.creator_visible ?? false} /> Compartir esta debilidad con la creadora de este World</span></label>
                <div className={styles.actions}>
                  <button className={styles.button} name="action" value="save" type="submit">Guardar</button>
                  {weakness ? <button className={styles.secondary} name="action" value="delete" type="submit">Eliminar</button> : null}
                </div>
              </form>
            ) : <Link className={styles.secondary} href="/auth">Entrar para guardar</Link>}
          </article>
        </section>

        <h2 className={styles.sectionTitle}>Qué está pasando aquí</h2>
        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <div className={styles.row}>
              <div><p className={styles.eyebrow}>WHAT PEOPLE WANT</p><h2>Ideas que pueden convertirse en algo real.</h2></div>
              <span className={styles.pill}>{demands.length} activas</span>
            </div>
            {demands.length === 0 ? <p className={styles.empty}>Todavía no hay demanda. La primera señal real puede nacer aquí.</p> : (
              <ul className={styles.list}>
                {demands.map((demand) => {
                  const metric = metricByDemand.get(demand.id);
                  const commitments = metric?.commit_count ?? 0;
                  const remaining = Math.max(0, demand.target_commitments - commitments);
                  return (
                    <li className={styles.item} key={demand.id}>
                      <div className={styles.row}>
                        <div>
                          <p className={styles.eyebrow}>{demand.category} · {demand.privacy_mode}</p>
                          <h3>{demand.title}</h3>
                          <p className={styles.muted}>{demand.description}</p>
                          <p>{metric?.want_count ?? 0} personas quieren esto · {metric?.pledge_count ?? 0} interés serio · {commitments} compromisos.</p>
                          <p className={styles.muted}>{remaining > 0 ? `${remaining} compromisos más podrían acercarlo al siguiente paso.` : "La demanda ya alcanzó su umbral inicial."}</p>
                        </div>
                        <span className={styles.pill}>{demand.status}</span>
                      </div>
                      {session.ok ? (
                        <form className={styles.form} method="post" action="/api/demand/signal">
                          <input type="hidden" name="demandId" value={demand.id} />
                          <input type="hidden" name="returnTo" value={returnTo} />
                          <div className={styles.twoCol}>
                            <label>Tu señal<select name="level" defaultValue="want"><option value="want">Quiero esto</option><option value="pledge">Me interesa seriamente</option><option value="commit">Me comprometo si se concreta</option></select></label>
                            <label>Privacidad<select name="privacyMode" defaultValue={demand.privacy_mode}><option value="public">Pública</option><option value="pseudonymous">Pseudónima</option><option value="private">Privada</option></select></label>
                          </div>
                          <label>Cuánto pagarías, opcional<input name="wtp" type="number" min="1" step="1" placeholder="Ej: 10000" /></label>
                          <input type="hidden" name="currency" value="CLP" />
                          <button className={styles.secondary} type="submit">Actualizar mi interés</button>
                        </form>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        </section>

        {session.ok ? (
          <section className={styles.grid}>
            <article className={`${styles.card} ${styles.wide}`}>
              <p className={styles.eyebrow}>PIDE ALGO</p>
              <h2>¿Qué te gustaría que existiera aquí?</h2>
              <form className={styles.form} method="post" action="/api/demand">
                <input type="hidden" name="worldId" value={world.id} />
                <input type="hidden" name="creatorId" value={world.creator_id} />
                <input type="hidden" name="returnTo" value={returnTo} />
                <label>Título<input name="title" required minLength={3} maxLength={160} placeholder="Ej: un audio personalizado corto" /></label>
                <label>Descripción<textarea name="description" maxLength={1600} placeholder="Lo justo para entender qué esperas." /></label>
                <div className={styles.twoCol}>
                  <label>Formato<select name="fulfillmentType"><option value="digital_product">Producto digital</option><option value="digital_experience">Experiencia digital</option><option value="membership">Membresía</option><option value="collab">Colaboración</option><option value="merch">Merch</option></select></label>
                  <label>Categoría<input name="category" defaultValue="Digital product" minLength={2} maxLength={80} /></label>
                  <label>Privacidad<select name="privacyMode" defaultValue="pseudonymous"><option value="public">Pública</option><option value="pseudonymous">Pseudónima</option><option value="private">Privada</option></select></label>
                  <label>Cuánto pagarías, opcional<input name="wtp" type="number" min="1" step="1" /></label>
                </div>
                <input type="hidden" name="currency" value="CLP" />
                <button className={styles.button} type="submit">Quiero que esto exista</button>
                <p className={styles.privacy}><strong>Privada:</strong> suma a los totales, pero la creadora no ve que fuiste tú. <strong>Pseudónima:</strong> puede ver tu alias/contexto permitido. <strong>Pública:</strong> tu participación puede mostrarse.</p>
              </form>
            </article>
          </section>
        ) : null}

        <h2 className={styles.sectionTitle}>Puedes desbloquear</h2>
        <section className={styles.grid}>
          {offers.filter((offer) => offer.status === "active" || owner).length === 0 ? <p className={`${styles.empty} ${styles.wide}`}>Todavía no hay una oferta activa. Este World puede empezar por escuchar antes de vender.</p> : offers.filter((offer) => offer.status === "active" || owner).map((offer) => (
            <article className={styles.card} key={offer.id}>
              <div className={styles.row}><p className={styles.eyebrow}>{offer.offer_family}</p><span className={styles.pill}>{offer.status}</span></div>
              <h2>{offer.title}</h2>
              <p className={styles.muted}>{offer.description}</p>
              <p className={styles.amount}>{formatMoney(offer.amount_minor, offer.currency)}</p>
              {offer.status === "active" ? (
                <div className={styles.checkout}>
                  <StorefrontCheckoutButton offerSlug={offer.slug} label="Probar desbloqueo" />
                  <p className={styles.small}>Private Alpha: una oferta de creadora solo puede pasar por el proveedor firmado de prueba. No cobra dinero real.</p>
                </div>
              ) : <span className={styles.pill}>Borrador de la creadora</span>}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
