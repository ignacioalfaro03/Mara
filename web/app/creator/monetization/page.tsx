import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { publicAuctionProjection, type CreatorAuctionRow } from "@/lib/commerce/auction-runtime";
import { formatMoney, readCreatorDashboard, readOwnCreator, readOwnWorlds } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import { serviceRest, userRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

type ThreadRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: "active" | "archived" | "blocked";
  last_message_at: string | null;
};

const mechanisms = [
  ["Ventas", "FIXED_PRICE", "Disponible sobre el commerce spine actual", "Productos, contenido y entregables con precio definido por la creadora. Checkout y precio siguen siendo server-authoritative."],
  ["Deseos / Caprichos", "WISH", "Producto creator-scoped sobre goals + contributions", "Metas financiadas por aportes de la audiencia. Cada aporte confirmado se convierte en una señal del mismo cliente dentro del CRM."],
  ["Subastas", "AUCTION", "Motor atómico + adjudicación privada", "Pujas gratuitas, incremento mínimo y anti-sniping. El ganador recibe una oferta privada separada de la puja y el pago."],
  ["Solicitudes", "CUSTOM_REQUEST", "Backbone existente reutilizado", "El usuario propone qué quiere y cuánto pagaría; la creadora puede revisar, aceptar, rechazar o contraofertar sin confundir intención con compra."],
  ["Chat y media", "PAID_INTERACTION", "Gratis por defecto; ofertas pagadas opcionales", "La creadora puede dejar el chat gratis y vender sesiones por tiempo, audios, fotos, videos, mensajes o packs con el precio que ella defina."],
  ["Taste Engine", "TASTE_CHOICE", "Persistencia creator-scoped reutilizada", "Elecciones rápidas tipo A/B para entretener y guardar preferencias declaradas, no para perfilar vulnerabilidades."],
] as const;

export default async function CreatorMonetizationPage() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>MARA · MONETIZACIÓN</p>
            <h1>Decide qué cobras. Mara organiza el negocio detrás.</h1>
            <p>Entra a tu Creator OS para administrar las formas de monetización que alimentan el mismo CRM e inteligencia comercial.</p>
            <Link className={styles.button} href="/auth?returnTo=/creator/monetization">Entrar</Link>
          </section>
        </div>
      </main>
    );
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <nav className={styles.nav}><Link href="/creator">Creator OS</Link></nav>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>CREATOR ACTIVATION</p>
            <h1>Primero activa tu perfil de creadora.</h1>
            <p>La monetización vive sobre una relación creator-scoped. Vuelve al Creator OS para completar la activación disponible en este entorno.</p>
            <Link className={styles.button} href="/creator">Volver al Creator OS</Link>
          </section>
        </div>
      </main>
    );
  }

  const [worlds, dashboard] = await Promise.all([
    readOwnWorlds(session.accessToken, creator.id),
    readCreatorDashboard(session.accessToken, creator.id),
  ]);
  const wishesEnabled = productCapability("wishes");
  const paidInteractionsEnabled = productCapability("paid_interactions") && productCapability("messaging");
  const auctionsEnabled = productCapability("auctions");
  const [threadResult, auctionResult] = await Promise.all([
    paidInteractionsEnabled
      ? userRest<ThreadRow[]>(session.accessToken, `creator_threads?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&status=eq.active&order=last_message_at.desc.nullslast&limit=50`)
      : Promise.resolve(null),
    auctionsEnabled
      ? serviceRest<CreatorAuctionRow[]>(`creator_auctions?select=*&creator_id=eq.${encodeURIComponent(creator.id)}&order=created_at.desc&limit=50`)
      : Promise.resolve(null),
  ]);
  const threads = threadResult?.ok ? threadResult.data : [];
  const auctionRuntimeReady = Boolean(auctionsEnabled && auctionResult?.ok);
  const auctions = auctionResult?.ok ? auctionResult.data.map((row) => ({ row, public: publicAuctionProjection(row) })) : [];
  const customerAlias = new Map(dashboard.customers.map((customer) => [customer.user_id, customer.alias || "Cliente"]));
  const paidOffers = dashboard.offers.filter((offer) => offer.status === "active" && ["bounded_interaction", "personalized_digital"].includes(offer.offer_family ?? ""));
  const planLabel = creator.plan === "pro" ? "PLUS" : "FREE";

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/creator">MARA · CREATOR OS</Link>
          <div className={styles.actions}>
            <Link className={styles.secondary} href="/creator/customers">Clientes</Link>
            <Link className={styles.secondary} href="/auth">Cuenta</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR COMMERCE ENGINE · MARA {planLabel}</p>
          <h1>Una audiencia. Muchas formas de monetizar. Un solo cliente.</h1>
          <p>Ventas, deseos, subastas, solicitudes, chat y preferencias alimentan la misma relación comercial. La creadora decide qué es gratis y qué cobra; Mara convierte la actividad en CRM y siguientes acciones.</p>
        </header>

        <section className={styles.grid}>
          {mechanisms.map(([name, code, status, body]) => (
            <article className={styles.card} key={code}>
              <p className={styles.eyebrow}>{code}</p>
              <h2>{name}</h2>
              <p>{body}</p>
              <p className={styles.muted}>{status}</p>
            </article>
          ))}
        </section>

        <h2 className={styles.sectionTitle}>Deseos / Caprichos</h2>
        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>WISH</p>
            <h2>Crea una meta que tu audiencia pueda financiar.</h2>
            {!wishesEnabled ? (
              <p className={styles.empty}>El flujo está implementado pero permanece cerrado por feature flag en este entorno.</p>
            ) : worlds.length === 0 ? (
              <p className={styles.empty}>Primero necesitas un storefront activo.</p>
            ) : (
              <form className={styles.form} method="post" action="/api/creator/wishes">
                <input type="hidden" name="returnTo" value="/creator/monetization" />
                <label>Perfil<select name="worldId" required>{worlds.map((world) => <option key={world.id} value={world.id}>{world.display_name}</option>)}</select></label>
                <label>Deseo<input name="title" minLength={2} maxLength={140} required placeholder="Ej. Nuevo equipo para grabar" /></label>
                <label>Qué harás si se cumple<textarea name="description" minLength={2} maxLength={1200} required placeholder="Explica la meta con claridad y qué significa cumplirla." /></label>
                <div className={styles.twoCol}>
                  <label>Meta CLP<input name="target" type="number" min="1" step="1" required /></label>
                  <label>Aporte mínimo CLP<input name="minContribution" type="number" min="1" step="1" required /></label>
                </div>
                <label>Aporte máximo por checkout CLP<input name="maxContribution" type="number" min="1" step="1" required /></label>
                <input type="hidden" name="currency" value="CLP" />
                <button className={styles.button} type="submit">Publicar deseo</button>
              </form>
            )}
          </article>
        </section>

        <h2 className={styles.sectionTitle}>Paid Interaction</h2>
        <section className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>TU MENÚ</p>
            <h2>Tú decides qué dejas gratis y qué vendes.</h2>
            <p className={styles.muted}>El chat normal puede seguir gratis. Estas ofertas son productos opcionales: una sesión acotada por tiempo o un entregable personalizado.</p>
            {!paidInteractionsEnabled ? (
              <p className={styles.empty}>Paid Interaction permanece cerrado por feature flag en este entorno.</p>
            ) : worlds.length === 0 ? (
              <p className={styles.empty}>Primero necesitas un storefront activo.</p>
            ) : (
              <form className={styles.form} method="post" action="/api/creator/interaction-offers">
                <input type="hidden" name="returnTo" value="/creator/monetization" />
                <input type="hidden" name="currency" value="CLP" />
                <label>Perfil<select name="worldId" required>{worlds.map((world) => <option key={world.id} value={world.id}>{world.display_name}</option>)}</select></label>
                <label>Qué vas a cobrar<select name="interactionKind" defaultValue="time_boxed_chat"><option value="time_boxed_chat">Chat por tiempo</option><option value="audio">Audio personalizado</option><option value="photo">Foto personalizada</option><option value="video">Video personalizado</option><option value="message">Mensaje personalizado</option><option value="bundle">Pack personalizado</option></select></label>
                <label>Título<input name="title" minLength={2} maxLength={140} required placeholder="Ej. 30 minutos conmigo / Audio personalizado" /></label>
                <label>Qué recibe<textarea name="description" minLength={2} maxLength={1200} required placeholder="Define claramente qué incluye y qué no incluye." /></label>
                <label>Precio CLP<input name="price" type="number" min="1" max="10000000" step="1" required /></label>
                <div className={styles.twoCol}>
                  <label>Minutos si es chat<input name="durationMinutes" type="number" min="5" max="240" step="1" defaultValue="30" /></label>
                  <label>Horas de entrega si es media<input name="turnaroundHours" type="number" min="1" max="720" step="1" defaultValue="48" /></label>
                </div>
                <label>Estado<select name="status"><option value="active">Activo</option><option value="draft">Borrador</option></select></label>
                <button className={styles.button} type="submit">Crear oferta pagada</button>
              </form>
            )}
          </article>

          <article className={styles.card}>
            <p className={styles.eyebrow}>CHAT → OFERTA</p>
            <h2>Envía una opción pagada cuando tenga sentido.</h2>
            <p className={styles.muted}>El mensaje sigue siendo gratis. El cobro ocurre solo si el cliente abre una oferta, ve precio/alcance y completa checkout.</p>
            {!paidInteractionsEnabled ? (
              <p className={styles.empty}>Paid Interaction permanece cerrado por feature flag en este entorno.</p>
            ) : threads.length === 0 ? (
              <p className={styles.empty}>Todavía no hay conversaciones activas donde enviar una oferta.</p>
            ) : paidOffers.length === 0 ? (
              <p className={styles.empty}>Crea una oferta pagada en el formulario de al lado y luego podrás reutilizarla en conversaciones.</p>
            ) : (
              <form className={styles.form} method="post" action="/api/creator/paid-interactions">
                <input type="hidden" name="returnTo" value="/creator/monetization" />
                <label>Cliente<select name="threadId" required>{threads.map((thread) => <option key={thread.id} value={thread.id}>{customerAlias.get(thread.user_id) ?? `Cliente ${thread.user_id.slice(0, 8)}`}</option>)}</select></label>
                <label>Oferta<select name="offerId" required>{paidOffers.map((offer) => <option key={offer.id} value={offer.id}>{offer.title} · {formatMoney(offer.amount_minor, offer.currency)}</option>)}</select></label>
                <label>Mensaje opcional<textarea name="message" maxLength={1200} placeholder="Te preparé esta opción porque calza con lo que estábamos hablando." /></label>
                <button className={styles.button} type="submit">Enviar oferta en chat</button>
              </form>
            )}
          </article>
        </section>

        <h2 className={styles.sectionTitle}>Subastas</h2>
        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>AUCTION</p>
            <h2>{auctionRuntimeReady ? "Crea una subasta." : "Subastas no están disponibles en este entorno."}</h2>
            <p className={styles.muted}>Pujar es gratis. Mara bloquea autopujas, aplica incremento mínimo y anti-sniping; al cerrar, el ganador recibe una adjudicación privada separada del pago.</p>
            {auctionRuntimeReady && worlds.length > 0 ? (
              <form className={styles.form} method="post" action="/api/creator/auctions">
                <input type="hidden" name="action" value="create" />
                <input type="hidden" name="returnTo" value="/creator/monetization" />
                <label>Perfil<select name="worldId" required>{worlds.map((world) => <option key={world.id} value={world.id}>{world.display_name}</option>)}</select></label>
                <label>Título<input name="title" minLength={2} maxLength={180} required placeholder="Ej. Pieza única / cupo exclusivo" /></label>
                <label>Descripción<textarea name="description" maxLength={4000} placeholder="Qué gana exactamente quien termine con la puja más alta." /></label>
                <div className={styles.twoCol}>
                  <label>Puja inicial CLP<input name="startingBid" type="number" min="1" step="1" required /></label>
                  <label>Incremento mínimo CLP<input name="minimumIncrement" type="number" min="1" step="1" required /></label>
                </div>
                <div className={styles.twoCol}>
                  <label>Comienza en minutos<input name="startsInMinutes" type="number" min="0" max="43200" step="1" defaultValue="0" required /></label>
                  <label>Duración minutos<input name="durationMinutes" type="number" min="5" max="43200" step="1" defaultValue="60" required /></label>
                </div>
                <label>Anti-sniping minutos<input name="antiSnipingMinutes" type="number" min="0" max="60" step="1" defaultValue="2" required /></label>
                <button className={styles.button} type="submit">Crear subasta</button>
              </form>
            ) : null}
          </article>

          {auctionRuntimeReady ? auctions.map(({ row, public: auction }) => (
            <article className={styles.card} key={row.id}>
              <p className={styles.eyebrow}>AUCTION · {auction.status.toUpperCase()}</p>
              <h2>{auction.title}</h2>
              <p className={styles.metric}>{formatMoney(auction.currentBidMinor ?? auction.startingBidMinor, auction.currency)}</p>
              <p className={styles.muted}>{auction.bidCount} pujas · mínimo siguiente {formatMoney(auction.minimumNextBidMinor, auction.currency)}</p>
              <p className={styles.small}>Cierre: {new Date(auction.endsAt).toLocaleString("es-CL")}</p>
              {auction.status === "ended" && row.status !== "cancelled" ? (
                <form method="post" action="/api/creator/auctions">
                  <input type="hidden" name="action" value="finalize" />
                  <input type="hidden" name="auctionId" value={row.id} />
                  <input type="hidden" name="returnTo" value="/creator/monetization" />
                  <button className={styles.secondary} type="submit">Finalizar resultado</button>
                </form>
              ) : null}
              {worlds.find((world) => world.id === row.world_id) ? <p><Link className={styles.secondary} href={`/c/${worlds.find((world) => world.id === row.world_id)!.slug}/auctions`}>Ver como fan</Link></p> : null}
            </article>
          )) : null}
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>MARA FREE</p>
            <h2>Empieza a vender sin pagar por adelantado.</h2>
            <p className={styles.muted}>Storefront, ventas base, CRM básico, deseos, solicitudes, fulfillment y métricas esenciales deben permitir comprobar valor antes de exigir una suscripción.</p>
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>MARA PLUS</p>
            <h2>Paga por más inteligencia y menos trabajo manual.</h2>
            <p className={styles.muted}>Revenue Intelligence avanzado, segmentación, automatización, analytics, lifecycle y herramientas comerciales superiores. El precio definitivo sigue pendiente de validación.</p>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>REVENUE INTELLIGENCE</p>
            <h2>La monetización no termina en el pago.</h2>
            <p>Una puja perdida, una solicitud repetida o un segundo aporte pueden convertirse en oportunidades basadas en evidencia. Mara no debe inventar intención ni usar perfiles de vulnerabilidad.</p>
            <Link className={styles.button} href="/creator">Ver siguiente mejor acción</Link>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>PAYMENT SAFETY</p>
            <h2>Pagos reales siguen bloqueados.</h2>
            <p className={styles.muted}>Este hub no activa dinero real, payouts ni Mercado Pago en producción. Cada nuevo mecanismo pasa por el mismo checkout, ledger, webhook, reconciliation y autorización del fundador.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
