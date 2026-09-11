import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { LibraryClient } from "./library-client";

export default function LibraryPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.contextNav}>
          <Link href="/activity">← Actividad</Link>
          <div><span>YOUR ACCOUNT</span><strong>Private archive</strong></div>
        </nav>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>YOUR PRIVATE ARCHIVE</p>
            <h1 className={styles.title}>Lo que ya es tuyo no vuelve a empezar de cero.</h1>
            <p className={styles.lede}>Accesos, entregas y compras confirmadas viven con tu cuenta. La memoria de Mara no debería depender de que recuerdes dónde estaba cada cosa.</p>
          </div>
          <aside className={styles.heroAside}>
            <p className={styles.eyebrow}>CONTINUITY</p>
            <strong>Tu archivo es una parte de tu historia.</strong>
            <p>Actividad explica qué pasó. Aquí aparece lo que efectivamente quedó disponible para ti.</p>
            <Link className={styles.secondaryButton} href="/activity">Ver mi actividad</Link>
          </aside>
        </section>

        <LibraryClient />
      </div>
    </main>
  );
}