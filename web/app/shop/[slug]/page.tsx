import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/app/storefront.module.css";
import { StorefrontProductAccess } from "@/components/storefront-product-access";
import { getStoreProduct, storefrontProducts } from "@/lib/commerce/storefront";

export function generateStaticParams() {
  return storefrontProducts.map((product) => ({ slug: product.slug }));
}

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product) notFound();

  const next = product.nextSlug ? getStoreProduct(product.nextSlug) : null;
  const deliveryReady = process.env.MARA_PREMIUM_DELIVERY_READY === "true"
    && Boolean(process.env.MARA_PREMIUM_STORAGE_BUCKET?.trim())
    && Boolean(product.privateAssetPath);

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <div className={styles.buttonStack} style={{ marginBottom: 24, maxWidth: 220 }}>
          <Link href="/shop" className={styles.secondaryButton}>← Volver a experiencias</Link>
        </div>

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
            {product.status === "available" && product.offerSlug && product.entitlementKey ? (
              <StorefrontProductAccess
                slug={product.slug}
                offerSlug={product.offerSlug}
                entitlementKey={product.entitlementKey}
                priceLabel={product.priceLabel}
                deliveryReady={deliveryReady}
              />
            ) : (
              <div className={styles.buttonStack}>
                <p className={styles.eyebrow}>EN PREPARACIÓN</p>
                <span className={styles.price}>{product.priceLabel}</span>
                <span className={styles.secondaryButton} aria-disabled="true">Todavía no te la puedo abrir</span>
                <p className={styles.notice}>Cuando esté completa de verdad, aparecerá aquí para desbloquearla.</p>
              </div>
            )}

            <p className={styles.notice}>Desbloqueas una experiencia digital de Mara. Mara sigue siendo un personaje virtual; no estás comprando atención humana ni una relación real.</p>
          </aside>
        </section>

        {next ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>DESPUÉS</p>
                <h2>Si quieres seguir, ya sé por dónde.</h2>
              </div>
              <p>Cada experiencia puede llevarte naturalmente a otra, sin obligarte a quedarte conectado.</p>
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
