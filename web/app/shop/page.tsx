import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { storefrontProducts } from "@/lib/commerce/storefront";

export default function ShopPage() {
  const featured = storefrontProducts[0];
  const rest = storefrontProducts.slice(1);

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.contextNav}>
          <Link href="/">MARA</Link>
          <div><span>WORLD 00</span><strong>Mara Vera · Creator Zero</strong></div>
        </nav>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>PRIVATE ACCESS · MARA VERA</p>
            <h1 className={styles.title}>Lo público termina antes.</h1>
            <p className={styles.lede}>
              Algunas cosas de este World se abren una vez y quedan contigo. No es la tienda de toda Mara: es el acceso privado de Creator Zero.
            </p>
          </div>
          <aside className={styles.heroAside}>
            <p className={styles.eyebrow}>ANTES DE PAGAR</p>
            <strong>Primero entra.</strong>
            <p>La experiencia gratuita existe para que entiendas el tono antes de decidir si quieres abrir algo más.</p>
            <Link className={styles.secondaryButton} href="/experience">Entrar a Mara Vera</Link>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>AVAILABLE NOW</p>
              <h2>Esta sí se puede abrir.</h2>
            </div>
            <p>Un acceso concreto, con precio y alcance claros cuando el proveedor de pagos esté realmente habilitado.</p>
          </div>

          <div className={styles.grid}>
            <article className={`${styles.card} ${styles.cardFeatured}`}>
              <div className={styles.cardSequence}>01 / PRIVATE</div>
              <div>
                <p className={styles.eyebrow}>{featured.eyebrow}</p>
                <h3>{featured.title}</h3>
                <p>{featured.shortDescription}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{featured.priceLabel}</span>
                <Link className={styles.linkButton} href={`/shop/${featured.slug}`}>Ver qué abre</Link>
              </div>
            </article>
          </div>
        </section>

        {rest.length > 0 ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>NOT YET</p>
                <h2>Lo que todavía no te deja abrir.</h2>
              </div>
              <p>Lo futuro aparece solo como anticipación. No fingimos inventario ni urgencia que todavía no existe.</p>
            </div>

            <div className={styles.grid}>
              {rest.map((product, index) => (
                <article className={styles.card} key={product.slug}>
                  <div className={styles.cardSequence}>{String(index + 2).padStart(2, "0")} / LATER</div>
                  <div>
                    <p className={styles.eyebrow}>{product.eyebrow}</p>
                    <h3>{product.title}</h3>
                    <p>{product.shortDescription}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{product.priceLabel}</span>
                    <Link className={styles.secondaryButton} href={`/shop/${product.slug}`}>Ver lo que viene</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.section}>
          <div className={styles.kpiStrip}>
            <div className={styles.kpi}><span>ACCESS</span><strong>Abres una vez</strong></div>
            <div className={styles.kpi}><span>MEMORY</span><strong>Queda en tu cuenta</strong></div>
            <div className={styles.kpi}><span>RETURN</span><strong>Vuelves cuando quieres</strong></div>
          </div>
        </section>
      </div>
    </main>
  );
}