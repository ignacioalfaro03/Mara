import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { LibraryClient } from "./library-client";

export default function LibraryPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Mara navigation">
          <Link href="/" className={styles.brand}>MARA VERA</Link>
          <div className={styles.navLinks}>
            <Link href="/shop">Tienda</Link>
            <Link href="/experience">Prueba gratis</Link>
          </div>
        </nav>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MI BIBLIOTECA</p>
            <h1 className={styles.title}>Lo que compras, queda contigo.</h1>
            <p className={styles.lede}>Tus desbloqueos y compras confirmadas aparecen aquí. Esta superficie reutiliza la verdad comercial del backend existente: compra confirmada, entitlement activo y acceso persistente.</p>
          </div>
        </section>

        <LibraryClient />
      </div>
    </main>
  );
}
