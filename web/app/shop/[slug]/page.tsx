import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/app/storefront.module.css";
import { StorefrontCheckoutButton } from "@/components/storefront-checkout-button";
import { getStoreProduct, storefrontProducts } from "@/lib/commerce/storefront";

export function generateStaticParams() {
  return storefrontProducts.map((product) => ({ slug: product.slug }));
}

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product) notFound();

  const next = product.nextSlug ? getStoreProduct(product.nextSlug) : null;

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Mara navigation">
          <Link href="/shop" className={styles.brand}>← MARA STORE</Link>
          <div className={styles.navLinks}>
            <Link href="/experience">Prueba gratis</Link>
            <Link href="/library">Mi biblioteca</Link>
          </div>
        </nav>

        <section className={styles.detailGrid}>
          <article className={styles.detailPanel}>
            <p className={styles.eyebrow}>{product.eyebrow}</p>
            <h1>{product.title}</h1>
            <p>{product.longDescription}</p>

            <ul className={styles.includes} aria-label="Incluye">
              {product.includes.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>

          <aside className={styles.purchasePanel}>
            <p className={styles.eyebrow}>{product.status === "available" ? "DISPONIBLE" : "EN PREPARACIÓN"}</p>
            <span className={styles.price}>{product.priceLabel}</span>

            {product.status === "available" && product.offerSlug ? (
              <StorefrontCheckoutButton offerSlug={product.offerSlug} label="Desbloquear" />
            ) : (
              <div className={styles.buttonStack}>
                <span className={styles.secondaryButton} aria-disabled="true">Todavía no está a la venta</span>
                <p className={styles.notice}>Mara no habilita checkout hasta que el activo final, QA y acceso estén listos.</p>
              </div>
            )}

            <p className={styles.notice}>Compra de producto digital concreto. No compra atención humana, afecto ni conversación ilimitada.</p>
          </aside>
        </section>

        {next ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>DESPUÉS</p>
                <h2>El siguiente paso ya está definido.</h2>
              </div>
              <p>La lógica de catálogo hace que cada producto tenga una continuación comercial clara sin necesitar intervención manual.</p>
            </div>
            <article className={styles.card}>
              <div>
                <p className={styles.eyebrow}>{next.eyebrow}</p>
                <h3>{next.title}</h3>
                <p>{next.shortDescription}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{next.priceLabel}</span>
                <Link className={styles.secondaryButton} href={`/shop/${next.slug}`}>Ver siguiente</Link>
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}
