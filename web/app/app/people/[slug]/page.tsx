import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowButton } from "@/components/follow-button";
import { ProductTelemetry } from "@/components/product-telemetry";
import { getVerifiedSession } from "@/lib/auth-session";
import { formatMoney, readWorld, readWorldOffers } from "@/lib/mara-real-data";
import { productCapability, readCreatorFeed, readPublicCreators } from "@/lib/product-realization";

export const dynamic = "force-dynamic";

function personaRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function personaImage(persona: Record<string, unknown>) {
  for (const key of ["cover_url", "portrait_url", "image_url", "avatar_url"]) {
    const value = persona[key];
    if (typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"))) return value;
  }
  return null;
}

function personaTags(persona: Record<string, unknown>) {
  const raw = persona.tags;
  return Array.isArray(raw) ? raw.filter((value): value is string => typeof value === "string").slice(0, 5) : [];
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getVerifiedSession();
  const accessToken = session.ok ? session.accessToken : undefined;
  const world = await readWorld(slug, accessToken);
  if (!world || world.status !== "active" || world.visibility !== "public") notFound();

  const [offers, content, publicCreators] = await Promise.all([
    readWorldOffers(world.id, accessToken),
    readCreatorFeed(accessToken, world.id, 30),
    readPublicCreators(50),
  ]);
  const creator = publicCreators.find((item) => item.worldId === world.id);
  const persona = personaRecord(world.persona);
  const image = personaImage(persona);
  const tags = personaTags(persona);
  const followEnabled = productCapability("follow");
  const messagingEnabled = productCapability("messaging");
  const requestsEnabled = productCapability("requests");

  return (
    <main className="consumerScreenFlush">
      <ProductTelemetry event="creator_viewed" surface={`/app/people/${slug}`} target={world.creator_id} placement="creator_profile" />

      <section className="creatorProfileHero">
        {image ? <img src={image} alt={world.display_name} fetchPriority="high" /> : <div className="lockedMedia" aria-hidden="true" />}
        <div className="creatorProfileIdentity">
          <p className="consumerKicker">CREATOR</p>
          <h1>{world.display_name}</h1>
          <p>{world.description || "Contenido, ofertas e interacciones de esta creadora."}</p>
          <div className="creatorProfileMeta">
            {creator?.followerCount ? <span>{creator.followerCount} seguidores</span> : null}
            <span>18+</span>
          </div>
        </div>
      </section>

      <section className="consumerScreen">
        {tags.length ? <div className="creatorTags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
        <div className="consumerActions">
          <FollowButton creatorId={world.creator_id} enabled={followEnabled} />
          {messagingEnabled ? <Link className="consumerSecondary" href={`/app/messages/${world.slug}`}>Mensaje</Link> : null}
          {requestsEnabled ? <Link className="consumerSecondary" href={`/app/people/${world.slug}/request`}>Pedir algo</Link> : null}
        </div>
      </section>

      <section className="consumerScreen consumerSection" aria-labelledby="creator-feed-title">
        <div className="consumerSectionHeader">
          <h2 id="creator-feed-title">Lo último</h2>
        </div>

        {content.length ? (
          <div className="feedList">
            {content.map((item) => {
              const offer = item.offer_id ? offers.find((candidate) => candidate.id === item.offer_id) : null;
              return (
                <article className="feedItem" key={item.id}>
                  <div className="feedItemHead">
                    <div className="feedAvatar">{image ? <img src={image} alt="" /> : null}</div>
                    <div><strong>{world.display_name}</strong><span>{item.published_at ? new Date(item.published_at).toLocaleDateString("es-CL") : "Ahora"}</span></div>
                  </div>
                  {item.visibility === "paid_unlock" ? (
                    <div className="lockedMedia">
                      <div className="lockedMediaInner">
                        <span className="consumerKicker">PRIVADO</span>
                        <strong>{item.title || "Te dejó algo."}</strong>
                        {item.caption ? <p>{item.caption}</p> : null}
                        {offer ? <Link className="unlockButton" href={`/shop/${offer.slug}`}>{offer.amount_minor ? `Desbloquear · ${formatMoney(offer.amount_minor, offer.currency)}` : "Desbloquear"}</Link> : null}
                      </div>
                    </div>
                  ) : (
                    <div className="feedCopy">
                      <h3>{item.title || "Nuevo"}</h3>
                      {item.caption ? <p>{item.caption}</p> : null}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : offers.length ? (
          <div className="feedList">
            {offers.map((offer) => (
              <article className="feedItem" key={offer.id}>
                <div className="lockedMedia">
                  <div className="lockedMediaInner">
                    <span className="consumerKicker">DISPONIBLE</span>
                    <strong>{offer.title}</strong>
                    <p>{offer.description}</p>
                    <Link className="unlockButton" href={`/shop/${offer.slug}`}>{offer.amount_minor ? `Ver · ${formatMoney(offer.amount_minor, offer.currency)}` : "Ver"}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <strong>Todavía no publicó nada.</strong>
            <p>Mara no inventa actividad para hacer parecer vivo un perfil vacío.</p>
          </div>
        )}
      </section>

      {offers.length > 0 ? (
        <section className="consumerScreen consumerSection" aria-labelledby="creator-offers-title">
          <div className="consumerSectionHeader"><h2 id="creator-offers-title">Disponible</h2></div>
          <div className="profileList">
            {offers.map((offer) => (
              <Link href={`/shop/${offer.slug}`} key={offer.id}>
                <span>{offer.title}</span>
                <strong>{offer.amount_minor ? formatMoney(offer.amount_minor, offer.currency) : "Ver"}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
