import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { storefrontProducts } from "@/lib/commerce/storefront";

export default function ShopPage() {
  const featured = storefrontProducts[0];
  const rest = storefrontProducts.slice(1);

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Mara navigation">
          <Link href="/" className={styles.brand}>MARA VERA</Link>
          <div className={styles.navLinks}>
            <Link href="/experience">Prueba gratis</Link>
            <Link href="/library">Mi biblioteca</Link>
          </div>
        </nav>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>EXPERIENCIAS DE MARA</p>
            <h1 className={styles.title}>Entra cuando quieras. Quédate con lo que eliges.</h1>
            <p className={styles.lede}>
              Mara ahora se construye como una biblioteca de experiencias privadas, escenas y colecciones que puedes comprar una vez y volver a abrir después. Sin depender de una conversación infinita.
            </p>
          </div>
          <aside className={styles.heroAside}>
            <strong>Cómo funciona</strong>
            <p>Prueba a Mara gratis, elige una experiencia, desbloquéala y guárdala en tu biblioteca. Las nuevas colecciones llegan como drops, no como obligación diaria.</p>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>START HERE</p>
              <h2>La primera compra debe ser simple.</h2>
            </div>
            <p>Un producto concreto, precio claro y acceso persistente. El backend actual ya protege compra, entitlement y refund.</p>
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
              <p className={styles.eyebrow}>CATÁLOGO</p>
              <h2>Inventario que se acumula.</h2>
            </div>
            <p>Estos productos ya tienen base editorial en el repositorio. Permanecen marcados como próximos hasta que el activo final y su entitlement estén realmente listos.</p>
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
            <div className={styles.kpi}><strong>1×</strong><span>crear el activo</span></div>
            <div className={styles.kpi}><strong>N×</strong><span>venderlo y revenderlo</span></div>
            <div className={styles.kpi}><strong>2–4 h/mes</strong><span>objetivo operativo fundador</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
