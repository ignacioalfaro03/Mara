import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTelemetry } from "@/components/product-telemetry";
import { formatMoney, readWorld, readWorldOffers } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function PublicCreatorStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await readWorld(slug);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const offers = await readWorldOffers(profile.id);

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <ProductTelemetry event="creator_viewed" surface={`/c/${slug}`} target={profile.creator_id} placement="creator_storefront" />

        <nav className={styles.nav}>
          <Link href="/">MARA</Link>
          <Link className={styles.secondary} href="/auth">Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR STOREFRONT</p>
          <h1>{profile.display_name}</h1>
          <p>{profile.description || "Ofertas disponibles directamente desde este creador."}</p>
          <div className={styles.actions}>
            <Link className={styles.secondary} href={`/c/${slug}/request`}>Pedir algo</Link>
            <Link className={styles.secondary} href={`/c/${slug}/taste`}>Esto o esto</Link>
          </div>
        </header>

        <h2 className={styles.sectionTitle}>Disponible</h2>
        <section className={styles.grid}>
          {offers.length === 0 ? (
            <article className={`${styles.card} ${styles.wide}`}>
              <p className={styles.empty}>Este creador todavía no tiene ofertas activas.</p>
            </article>
          ) : offers.map((offer) => (
            <article className={styles.card} key={offer.id}>
              <p className={styles.eyebrow}>{offer.offer_family?.replaceAll("_", " ") || "OFERTA"}</p>
              <h2>{offer.title}</h2>
              <p className={styles.muted}>{offer.description}</p>
              <p className={styles.metric}>{formatMoney(offer.amount_minor, offer.currency)}</p>
              <Link className={styles.button} href={`/c/${slug}/offers/${offer.slug}`}>Ver oferta</Link>
            </article>
          ))}
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>¿NO VES LO QUE BUSCAS?</p>
            <h2>También puedes proponer una compra.</h2>
            <p className={styles.muted}>Dile a {profile.display_name} qué te gustaría recibir y cuánto pagarías si quieres. La solicitud no cobra nada por sí sola y la creadora mantiene el control de aceptar, rechazar o contraofertar.</p>
            <Link className={styles.secondary} href={`/c/${slug}/request`}>Crear solicitud</Link>
          </article>

          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>TASTE ENGINE</p>
            <h2>Cuatro elecciones rápidas. Cero formulario eterno.</h2>
            <p className={styles.muted}>Elige entre formatos y estilos de oferta para que Mara entienda preferencias que tú declaras dentro de esta relación con la creadora.</p>
            <Link className={styles.secondary} href={`/c/${slug}/taste`}>Jugar “esto o esto”</Link>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>MARA</p>
            <h2>Compra clara. Relación comercial persistente.</h2>
            <p className={styles.muted}>Mara registra las compras e interacciones comerciales con tu cuenta para que puedas volver a ellas y para que el creador gestione su relación contigo dentro de los límites de privacidad aplicables.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
