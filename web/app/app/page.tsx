import Link from "next/link";
import { ProductTelemetry } from "@/components/product-telemetry";
import { getVerifiedSession } from "@/lib/auth-session";
import { formatMoney, type OfferRow } from "@/lib/mara-real-data";
import { readCreatorFeed, readPublicCreators } from "@/lib/product-realization";
import { publicRest } from "@/lib/supabase/server-rest";

export const dynamic = "force-dynamic";

function personaImage(persona: Record<string, unknown>) {
  for (const key of ["portrait_url", "image_url", "avatar_url"]) {
    const value = persona[key];
    if (typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"))) return value;
  }
  return null;
}

export default async function ConsumerHomePage() {
  const session = await getVerifiedSession();
  const accessToken = session.ok ? session.accessToken : undefined;
  const [creators, feed, offersResult] = await Promise.all([
    readPublicCreators(8),
    readCreatorFeed(accessToken, undefined, 12),
    publicRest<OfferRow[]>("commerce_offers?select=*&status=eq.active&order=created_at.desc&limit=6"),
  ]);
  const offers = offersResult.ok ? offersResult.data : [];

  return (
    <main className="consumerScreenFlush">
      <ProductTelemetry event="app_entered" surface="/app" placement="consumer_home" />

      <section className="maraAnchor" aria-label="Mara Vera">
        <img src="/mara/mara-v2-reference.webp" alt="Mara Vera" width="384" height="576" fetchPriority="high" />
        <div className="maraAnchorCopy">
          <p className="consumerKicker">MARA · 18+</p>
          <h1>Abre Mara.</h1>
          <p>Mara Vera es la primera presencia. Entra, recibe valor y deja que el resto aparezca cuando tenga una razón para aparecer.</p>
          <div className="consumerActions">
            <Link className="consumerPrimary" href="/experience">Entrar con Mara</Link>
            <Link className="consumerSecondary" href="/app/discover">Descubrir</Link>
          </div>
        </div>
      </section>

      <section className="consumerSection" aria-labelledby="home-creators">
        <div className="consumerScreen">
          <div className="consumerSectionHeader">
            <h2 id="home-creators">Personas</h2>
            <Link href="/app/discover">Ver todas</Link>
          </div>
        </div>
        {creators.length ? (
          <div className="creatorStrip">
            {creators.map((creator) => {
              const image = personaImage(creator.persona);
              return (
                <Link className="creatorStripItem" href={`/app/people/${creator.slug}`} key={creator.worldId}>
                  <div className="creatorStripPortrait">
                    {image ? <img src={image} alt={creator.displayName} loading="lazy" /> : <div className="lockedMedia" aria-hidden="true" />}
                  </div>
                  <strong>{creator.displayName}</strong>
                  <small>{creator.followerCount > 0 ? `${creator.followerCount} siguiendo` : "Ver perfil"}</small>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="consumerScreen" style={{ paddingTop: 0 }}>
            <div className="emptyState">
              <strong>Primero Mara.</strong>
              <p>El marketplace no se rellena con perfiles inventados. Las creadoras reales aparecerán aquí cuando sus Worlds estén publicados.</p>
            </div>
          </div>
        )}
      </section>

      <section className="consumerScreen consumerSection" aria-labelledby="home-for-you">
        <div className="consumerSectionHeader">
          <h2 id="home-for-you">Para ti</h2>
        </div>

        {feed.length ? (
          <div className="feedList">
            {feed.map((item) => (
              <article className="feedItem" key={item.id}>
                <div className="feedCopy">
                  <p className="consumerKicker">{item.type.replaceAll("_", " ")}</p>
                  <h3>{item.title || "Nuevo"}</h3>
                  {item.caption ? <p>{item.caption}</p> : null}
                  {item.visibility === "paid_unlock" ? <p>Contenido disponible mediante un desbloqueo asociado.</p> : null}
                </div>
              </article>
            ))}
          </div>
        ) : offers.length ? (
          <div className="feedList">
            {offers.map((offer) => (
              <article className="feedItem" key={offer.id}>
                <div className="lockedMedia">
                  <div className="lockedMediaInner">
                    <span className="consumerKicker">ACCESO MARA</span>
                    <strong>{offer.title}</strong>
                    <p>{offer.description}</p>
                    <Link className="unlockButton" href={`/shop/${offer.slug}`}>
                      {offer.amount_minor ? `Ver · ${formatMoney(offer.amount_minor, offer.currency)}` : "Ver"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <strong>Lo útil aparece cuando existe.</strong>
            <p>No rellenamos Inicio con ventas, mensajes o contenido falsos. Aquí aparecerán nuevas publicaciones, desbloqueos y ofertas reales de las personas que sigas.</p>
          </div>
        )}
      </section>
    </main>
  );
}
