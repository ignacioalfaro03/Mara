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
        <nav className={styles.contextNav}>
          <Link href="/shop">← Mara Vera</Link>
          <div><span>WORLD 00</span><strong>Private access</strong></div>
        </nav>

        <section className={styles.detailGrid}>
          <article className={styles.detailPanel}>
            <p className={styles.eyebrow}>{product.eyebrow}</p>
            <h1>{product.title}</h1>
            <p className={styles.detailLead}>{product.longDescription}</p>

            <div className={styles.privateMarker} aria-hidden="true">
              <span>PRIVATE</span><span>CREATOR ZERO</span><span>YOUR ACCOUNT</span>
            </div>

            <div className={styles.includesWrap}>
              <p className={styles.eyebrow}>LO QUE ABRES</p>
              <ul className={styles.includes} aria-label="Incluye">
                {product.includes.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
              </ul>
            </div>
          </article>

          <aside className={styles.purchasePanel}>
            <p className={styles.eyebrow}>TRANSACTION BOUNDARY</p>
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
                <strong className={styles.purchaseHeadline}>Esta parte todavía no.</strong>
                <span className={styles.price}>{product.priceLabel}</span>
                <span className={styles.secondaryButton} aria-disabled="true">Todavía no disponible</span>
                <p className={styles.notice}>Solo se habilitará cuando el contenido esté realmente listo para entregar.</p>
              </div>
            )}

            <div className={styles.checkoutTruth}>
              <strong>Qué estás comprando</strong>
              <p>Acceso digital de Mara Vera asociado a tu cuenta. No compras atención humana, una relación real ni derechos sobre una persona.</p>
              <Link href="/legal">Privacidad y términos</Link>
            </div>
          </aside>
        </section>

        {next ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>AFTER</p>
                <h2>Hay una puerta después de esta.</h2>
              </div>
              <p>No necesitas seguir. Si lo haces, la siguiente experiencia conserva el contexto de Creator Zero sin convertir el sitio en un catálogo infinito.</p>
            </div>
            <article className={styles.card}>
              <div>
                <p className={styles.eyebrow}>{next.eyebrow}</p>
                <h3>{next.title}</h3>
                <p>{next.shortDescription}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{next.priceLabel}</span>
                <Link className={styles.secondaryButton} href={`/shop/${next.slug}`}>Mirar después</Link>
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}