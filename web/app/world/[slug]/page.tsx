import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { ProductTelemetry } from "@/components/product-telemetry";
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
  const activeOffers = offers.filter((offer) => offer.status === "active" || owner);
  const returnTo = `/world/${world.slug}`;

  return (
    <main className={`${styles.shell} ${styles.worldShell}`}>
      <ProductTelemetry event="world_viewed" surface={returnTo} target={owner ? "owner" : "visitor"} />
      {history.length > 0 ? <ProductTelemetry event="returning_user" surface={returnTo} target="world_history" /> : null}

      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/">MARA</Link>
          <div className={styles.actions}>
            <Link className={styles.secondary} href="/make-it-happen">Haz que pase</Link>
            {session.ok ? <Link className={styles.secondary} href="/activity">Actividad</Link> : <Link className={styles.secondary} href="/auth">Entrar</Link>}
            {owner ? <Link className={styles.secondary} href="/creator">Creator OS</Link> : null}
          </div>
        </nav>

        <header className={styles.worldHero}>
          <div className={styles.worldHeroMain}>
            <p className={styles.eyebrow}>CREATOR WORLD · {world.visibility}</p>
            <h1>{world.display_name}</h1>
            <p className={styles.worldLead}>
              {world.description || "Un World reúne identidad, actividad, demanda y acceso en un solo lugar. Lo que hagas aquí puede dejar una consecuencia para la próxima vez."}
            </p>
          </div>
          <aside className={styles.worldHeroRail}>
            <div>
              <p className={styles.eyebrow}>AHORA</p>
              <strong>
                {demands.length > 0
                  ? `${demands.length} ${demands.length === 1 ? "idea se está moviendo" : "ideas se están moviendo"}.`
                  : activeOffers.length > 0
                    ? "Hay algo disponible en este World."
                    : "Este World está escuchando."}
              </strong>
            </div>
            <p>
              {history.length > 0
                ? "Ya dejaste una señal aquí. Mira qué cambió antes de empezar otra cosa."
                : "No necesitas comprar para participar. Una señal real ya cambia lo que la creadora puede entender de su comunidad."}
            </p>
          </aside>
        </header>

        {history.length > 0 ? (
          <section className={styles.worldSection} aria-labelledby="since-left-title">
            <div className={styles.worldSectionHeader}>
              <div>
                <p className={styles.eyebrow}>SINCE YOU LEFT</p>
                <h2 id="since-left-title">Esto ya tiene historia.</h2>
              </div>
              <p>No te mostramos actividad por llenar espacio. Solo cosas que realmente quedaron asociadas a tu cuenta dentro de este World.</p>
            </div>
            <article className={`${styles.card} ${styles.wide} ${styles.connection}`}>
              <ul className={styles.list}>
                {history.slice(0, 4).map((event, index) => (
                  <li className={styles.item} key={`${event.event_type}-${event.object_id}-${index}`}>
                    {historyCopy(event.event_type)}
                  </li>
                ))}
              </ul>
              <div className={styles.actions}><Link className={styles.secondary} href="/activity">Ver toda mi actividad</Link></div>
            </article>
          </section>
        ) : null}

        <section className={styles.worldSection} aria-labelledby="world-demand-title">
          <div className={styles.worldSectionHeader}>
            <div>
              <p className={styles.eyebrow}>WHAT THIS WORLD WANTS</p>
              <h2 id="world-demand-title">Lo que la gente quiere empieza a pesar.</h2>
            </div>
            <p>WANT no es lo mismo que PLEDGE. PLEDGE no es COMMIT. Mara conserva esa diferencia para que una creadora sepa cuándo una idea realmente merece convertirse en oferta.</p>
          </div>

          {demands.length === 0 ? (
            <div className={styles.empty}>
              Todavía no hay demanda activa en este World. No vamos a inventar actividad: la primera señal real puede empezar abajo.
            </div>
          ) : (
            <div className={styles.demandStack}>
              {demands.map((demand) => {
                const metric = metricByDemand.get(demand.id);
                const wants = metric?.want_count ?? 0;
                const pledges = metric?.pledge_count ?? 0;
                const commits = metric?.commit_count ?? 0;
                const remaining = Math.max(0, demand.target_commitments - commits);
                const progress = demand.target_commitments > 0 ? Math.min(100, Math.round((commits / demand.target_commitments) * 100)) : 0;

                return (
                  <article className={styles.demandCard} key={demand.id}>
                    <div className={styles.row}>
                      <div>
                        <p className={styles.eyebrow}>{demand.category} · {demand.privacy_mode}</p>
                        <h3>{demand.title}</h3>
                        {demand.description ? <p className={styles.muted}>{demand.description}</p> : null}
                      </div>
                      <span className={styles.pill}>{demand.status}</span>
                    </div>

                    <div className={styles.demandStats} aria-label="Fuerza de la demanda">
                      <div><strong>{wants}</strong><span>WANT</span></div>
                      <div><strong>{pledges}</strong><span>PLEDGE</span></div>
                      <div><strong>{commits}</strong><span>COMMIT</span></div>
                    </div>
                    <div className={styles.progressTrack} aria-label={`${progress}% del umbral inicial`}>
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <p className={styles.muted}>
                      {remaining > 0 ? `${remaining} ${remaining === 1 ? "commit" : "commits"} más para alcanzar el umbral inicial.` : "El umbral inicial ya se alcanzó. La creadora puede decidir qué hacer con esta señal."}
                    </p>

                    {session.ok ? (
                      <form className={styles.form} method="post" action="/api/demand/signal">
                        <input type="hidden" name="demandId" value={demand.id} />
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <div className={styles.signalChoice}>
                          <label>
                            <input type="radio" name="level" value="want" defaultChecked />
                            <span><strong>Quiero esto</strong>WANT · señal ligera</span>
                          </label>
                          <label>
                            <input type="radio" name="level" value="pledge" />
                            <span><strong>Iría en serio</strong>PLEDGE · puedo decir cuánto</span>
                          </label>
                          <label>
                            <input type="radio" name="level" value="commit" />
                            <span><strong>Me comprometo</strong>COMMIT · si se concreta</span>
                          </label>
                        </div>
                        <div className={styles.twoCol}>
                          <label>Cuánto pagarías, opcional<input name="wtp" type="number" min="1" step="1" placeholder="CLP" /></label>
                          <label>Tu privacidad<select name="privacyMode" defaultValue={demand.privacy_mode}><option value="private">Privada</option><option value="pseudonymous">Pseudónima</option><option value="public">Pública</option></select></label>
                        </div>
                        <input type="hidden" name="currency" value="CLP" />
                        <button className={styles.button} type="submit">Dejar mi señal</button>
                      </form>
                    ) : (
                      <div className={styles.actions}><Link className={styles.secondary} href="/auth">Entrar para sumarme</Link></div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.makeSection} id="make-it-happen" aria-labelledby="make-world-title">
          <div className={styles.makeIntro}>
            <p className={styles.eyebrow}>MAKE IT HAPPEN</p>
            <h2 id="make-world-title">Pide lo que todavía no existe.</h2>
            <p>No tienes que pensar como productor ni saber qué formato vendería mejor. Empieza por lo que quieres. Mara guarda la señal dentro de este World y la creadora ve la oportunidad agregada.</p>
            <p className={styles.privacy}>Una señal privada suma a los totales sin mostrarle a la creadora que fuiste tú. Pseudónima comparte solo el contexto permitido. Pública puede mostrar tu participación.</p>
          </div>
          <div className={styles.makeForm}>
            {session.ok ? (
              <form className={styles.form} method="post" action="/api/demand">
                <input type="hidden" name="worldId" value={world.id} />
                <input type="hidden" name="creatorId" value={world.creator_id} />
                <input type="hidden" name="returnTo" value={returnTo} />
                <input type="hidden" name="fulfillmentType" value="digital_product" />
                <input type="hidden" name="category" value="Community request" />
                <textarea className={styles.rawWant} name="title" required minLength={3} maxLength={160} placeholder="Quiero que en este World pase…" />
                <label>Si quieres, agrega contexto<textarea name="description" maxLength={1600} placeholder="Solo lo necesario para entender qué imaginas." /></label>
                <div className={styles.twoCol}>
                  <label>Privacidad<select name="privacyMode" defaultValue="private"><option value="private">Privada</option><option value="pseudonymous">Pseudónima</option><option value="public">Pública</option></select></label>
                  <label>Cuánto pagarías si se hiciera, opcional<input name="wtp" type="number" min="1" step="1" placeholder="CLP" /></label>
                </div>
                <input type="hidden" name="currency" value="CLP" />
                <button className={styles.button} type="submit">Quiero que pase</button>
              </form>
            ) : (
              <div>
                <p className={styles.muted}>Para que una señal tenga continuidad y no dependa de este dispositivo, necesita quedar asociada a una cuenta.</p>
                <Link className={styles.button} href="/auth">Entrar y pedir algo</Link>
              </div>
            )}
          </div>
        </section>

        <section className={styles.worldSection} aria-labelledby="world-access-title">
          <div className={styles.worldSectionHeader}>
            <div>
              <p className={styles.eyebrow}>ACCESS</p>
              <h2 id="world-access-title">Lo que ya se puede abrir.</h2>
            </div>
            <p>Las ofertas aparecen dentro del contexto de este World. Si llega el momento de pagar, el precio y lo que recibes deben quedar completamente claros.</p>
          </div>

          <section className={styles.grid}>
            {activeOffers.length === 0 ? (
              <p className={`${styles.empty} ${styles.wide}`}>Todavía no hay una oferta activa. Un World puede escuchar antes de vender.</p>
            ) : activeOffers.map((offer) => (
              <article className={styles.card} key={offer.id}>
                {offer.status === "active" ? <ProductTelemetry event="offer_viewed" surface={returnTo} target="creator_offer" offerSlug={offer.slug} offerType={offer.offer_family} currency={offer.currency} /> : null}
                <div className={styles.row}><p className={styles.eyebrow}>{offer.offer_family}</p><span className={styles.pill}>{offer.status}</span></div>
                <h2>{offer.title}</h2>
                <p className={styles.muted}>{offer.description}</p>
                <p className={styles.amount}>{formatMoney(offer.amount_minor, offer.currency)}</p>
                {offer.status === "active" ? (
                  <div className={styles.checkout}>
                    <StorefrontCheckoutButton offerSlug={offer.slug} label="Ver acceso" />
                    <p className={styles.small}>Private Alpha: el proveedor firmado de prueba no cobra dinero real.</p>
                  </div>
                ) : <span className={styles.pill}>Borrador</span>}
              </article>
            ))}
          </section>
        </section>

        <section className={styles.personalSignals} aria-labelledby="personal-signals-title">
          <div className={styles.worldSectionHeader}>
            <div>
              <p className={styles.eyebrow}>YOUR SIGNALS</p>
              <h2 id="personal-signals-title">Lo que decides contar.</h2>
            </div>
            <p>Estas señales son opcionales. Mara no debería inventar intimidad: solo puede recordar lo que realmente elegiste revelar.</p>
          </div>

          <section className={styles.grid}>
            <article className={styles.card}>
              <p className={styles.eyebrow}>TASTE</p>
              <h2>¿Audio o imagen?</h2>
              <p className={styles.muted}>Una señal pequeña para entender mejor qué formato prefieres dentro de este World.</p>
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
              ) : <Link className={styles.secondary} href="/auth">Entrar para que quede conmigo</Link>}
            </article>

            <article className={styles.card}>
              <p className={styles.eyebrow}>MY WEAKNESS</p>
              <h2>Solo si tú quieres.</h2>
              <p className={styles.muted}>Texto declarado por ti. No es una inferencia psicológica ni autoriza a nadie a presionarte. Tú eliges si la creadora de este World puede verlo.</p>
              {session.ok ? (
                <form className={styles.form} method="post" action="/api/weakness">
                  <input type="hidden" name="scope" value="creator_world" />
                  <input type="hidden" name="creatorId" value={world.creator_id} />
                  <input type="hidden" name="worldId" value={world.id} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <textarea name="valueText" maxLength={1000} defaultValue={weakness?.value_text ?? ""} placeholder="Algo que te encanta, te tienta o te cuesta ignorar…" />
                  <label><span><input style={{ width: "auto" }} type="checkbox" name="creatorVisible" defaultChecked={weakness?.creator_visible ?? false} /> Compartirlo con la creadora de este World</span></label>
                  <div className={styles.actions}>
                    <button className={styles.button} name="action" value="save" type="submit">Guardar</button>
                    {weakness ? <button className={styles.secondary} name="action" value="delete" type="submit">Eliminar</button> : null}
                  </div>
                </form>
              ) : <Link className={styles.secondary} href="/auth">Entrar para guardar</Link>}
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}