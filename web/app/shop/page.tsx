import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { storefrontProducts } from "@/lib/commerce/storefront";

export default function ShopPage() {
  const featured = storefrontProducts[0];
  const rest = storefrontProducts.slice(1);

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>EL LADO PRIVADO DE MARA</p>
            <h1 className={styles.title}>No todo lo dejo afuera.</h1>
            <p className={styles.lede}>
              Hay escenas, audios y pequeñas cosas que puedes desbloquear y guardar. Entras cuando quieres, eliges una y vuelves a ella después.
            </p>
          </div>
          <aside className={styles.heroAside}>
            <strong>Empieza por una.</strong>
            <p>Primero puedes probar a Mara gratis. Si quieres seguir, desbloqueas una experiencia concreta y queda en tu biblioteca.</p>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>START HERE</p>
              <h2>Empieza por algo pequeño.</h2>
            </div>
            <p>Una continuación privada de la primera escena. Precio claro, una sola compra y algo que después sigue siendo tuyo.</p>
          </div>

          <div className={styles.grid}>
            <article className={`${styles.card} ${styles.cardFeatured}`}>
              <div>
                <p className={styles.eyebrow}>{featured.eyebrow}</p>
                <h3>{featured.title}</h3>
                <p>{featured.shortDescription}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{featured.priceLabel}</span>
                <Link className={styles.linkButton} href={`/shop/${featured.slug}`}>Ver experiencia</Link>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>DESPUÉS</p>
              <h2>Hay más cosas esperando.</h2>
            </div>
            <p>Cuando una experiencia esté realmente lista, aparece aquí. No necesitas perseguir cada publicación para encontrarla.</p>
          </div>

          <div className={styles.grid}>
            {rest.map((product) => (
              <article className={styles.card} key={product.slug}>
                <div>
                  <p className={styles.eyebrow}>{product.eyebrow}</p>
                  <h3>{product.title}</h3>
                  <p>{product.shortDescription}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>{product.priceLabel}</span>
                  <Link className={styles.secondaryButton} href={`/shop/${product.slug}`}>Ver ficha</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.kpiStrip}>
            <div className={styles.kpi}><strong>Una vez</strong><span>desbloqueas</span></div>
            <div className={styles.kpi}><strong>Tu biblioteca</strong><span>lo guarda</span></div>
            <div className={styles.kpi}><strong>Cuando quieras</strong><span>vuelves</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
