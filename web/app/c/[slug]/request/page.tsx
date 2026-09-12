import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestComposer } from "@/components/request-composer";
import { getVerifiedSession } from "@/lib/auth-session";
import { readWorld } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function PublicCreatorRequestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getVerifiedSession();
  const profile = await readWorld(slug, session.ok ? session.accessToken : undefined);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const enabled = productCapability("requests");
  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href={`/c/${profile.slug}`}>{profile.display_name}</Link>
          <Link className={styles.secondary} href="/auth">Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>SOLICITUD PERSONALIZADA</p>
          <h1>¿Qué te gustaría comprarle a {profile.display_name}?</h1>
          <p>Propón algo y, si quieres, indica cuánto pagarías. Enviar una solicitud no genera ningún cobro: la creadora puede aceptarla, rechazarla o proponerte otro precio.</p>
        </header>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            {enabled ? (
              <RequestComposer worldSlug={profile.slug} creatorName={profile.display_name} />
            ) : (
              <>
                <p className={styles.eyebrow}>NO DISPONIBLE EN ESTE ENTORNO</p>
                <h2>Las solicitudes están preparadas, pero no activadas aquí.</h2>
                <p className={styles.muted}>Mara no muestra una acción comercial si la persistencia, revisión y lifecycle correspondiente no están habilitados.</p>
              </>
            )}
          </article>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>CÓMO FUNCIONA</p>
            <h2>Solicitud ≠ compra.</h2>
            <p className={styles.muted}>Primero expresas lo que quieres. Solo si existe una oferta/contraoferta aceptada y pasas por checkout habrá una compra. Mara mantiene separadas intención, aceptación y pago.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
