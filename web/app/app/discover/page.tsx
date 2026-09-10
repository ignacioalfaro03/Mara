import Link from "next/link";
import { readPublicCreators } from "@/lib/product-realization";

export const dynamic = "force-dynamic";

function personaImage(persona: Record<string, unknown>) {
  for (const key of ["portrait_url", "image_url", "avatar_url"]) {
    const value = persona[key];
    if (typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"))) return value;
  }
  return null;
}

function personaTags(persona: Record<string, unknown>) {
  const raw = persona.tags;
  return Array.isArray(raw) ? raw.filter((value): value is string => typeof value === "string").slice(0, 4) : [];
}

export default async function DiscoverPage() {
  const creators = await readPublicCreators(30);
  return (
    <main className="consumerScreen">
      <p className="consumerKicker">DESCUBRIR</p>
      <h1 className="consumerTitle">Encuentra a alguien que te interese.</h1>
      <p className="consumerLead">Perfiles reales cuando existen. Nada de llenar la pantalla con cientos de personajes huecos.</p>

      <section className="consumerSection">
        <article className="creatorCard">
          <div className="creatorCardPortrait">
            <img src="/mara/mara-v2-reference.webp" alt="Mara Vera" width="384" height="576" fetchPriority="high" />
          </div>
          <div className="creatorCardBody">
            <p className="consumerKicker">PRIMERA PRESENCIA · VIRTUAL · 18+</p>
            <h2>Mara Vera</h2>
            <div className="creatorTags"><span>Directa</span><span>Privada</span><span>After-hours</span></div>
            <p>No es el marketplace completo. Es la primera experiencia de Mara y la forma más rápida de entender cómo se siente el producto.</p>
            <div className="consumerActions" style={{ marginTop: 14 }}>
              <Link className="consumerPrimary" href="/experience">Entrar</Link>
            </div>
          </div>
        </article>

        {creators.map((creator) => {
          const image = personaImage(creator.persona);
          const tags = personaTags(creator.persona);
          return (
            <article className="creatorCard" key={creator.worldId}>
              <div className="creatorCardPortrait">
                {image ? <img src={image} alt={creator.displayName} loading="lazy" /> : <div className="lockedMedia" aria-hidden="true" />}
              </div>
              <div className="creatorCardBody">
                <p className="consumerKicker">CREATOR</p>
                <h2>{creator.displayName}</h2>
                {tags.length ? <div className="creatorTags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
                <p>{creator.description || "Abre el perfil para ver qué comparte y qué ofrece."}</p>
                <div className="consumerActions" style={{ marginTop: 14 }}>
                  <Link className="consumerPrimary" href={`/app/people/${creator.slug}`}>Ver perfil</Link>
                </div>
              </div>
            </article>
          );
        })}

        {!creators.length ? (
          <div className="emptyState" style={{ marginTop: 16 }}>
            <strong>Sin catálogo falso.</strong>
            <p>Las próximas creadoras aparecerán cuando existan como cuentas/Worlds reales y publicados.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
