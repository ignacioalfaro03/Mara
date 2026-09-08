import styles from "@/app/storefront.module.css";
import { LibraryClient } from "./library-client";

export default function LibraryPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MI BIBLIOTECA</p>
            <h1 className={styles.title}>Lo que desbloqueas, queda aquí.</h1>
            <p className={styles.lede}>Tus experiencias y compras confirmadas aparecen en un solo lugar para que puedas volver sin tener que buscarlas otra vez.</p>
          </div>
        </section>

        <LibraryClient />
      </div>
    </main>
  );
}
