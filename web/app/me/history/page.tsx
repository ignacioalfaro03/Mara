import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { historyCopy, readWeakness, type ActivityHistoryRow } from "@/lib/mara-real-data";
import { userRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function UserHistoryPage() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return <main className={styles.shell}><div className={styles.container}><section className={styles.hero}><p className={styles.eyebrow}>YOUR HISTORY</p><h1>Tu continuidad vive con tu cuenta.</h1><p>Entra para ver lo que pediste, elegiste, compraste y recibiste.</p><Link className={styles.button} href="/auth">Entrar</Link></section></div></main>;
  }

  const [historyResult, weakness] = await Promise.all([
    userRest<ActivityHistoryRow[]>(session.accessToken, `user_activity_history?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=event_at.desc&limit=100`),
    readWeakness(session.accessToken, session.user.id),
  ]);
  const history = historyResult.ok ? historyResult.data : [];

  return (
    <main className={styles.shell}><div className={styles.container}>
      <nav className={styles.nav}><Link href="/">MARA</Link><Link className={styles.secondary} href="/auth">Cuenta</Link></nav>
      <header className={styles.hero}><p className={styles.eyebrow}>YOUR HISTORY</p><h1>Mara recuerda lo que sí importa.</h1><p>No es un log técnico. Es continuidad: decisiones tuyas, demanda que ayudaste a mover, compras y entregas.</p></header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>NETWORK · MY WEAKNESS</p><h2>Solo tuya.</h2><p className={styles.muted}>La versión Network nunca se comparte con una creadora. Puedes editarla o borrarla cuando quieras.</p>
          <form className={styles.form} method="post" action="/api/weakness"><input type="hidden" name="scope" value="network" /><input type="hidden" name="returnTo" value="/me/history" /><textarea name="valueText" maxLength={1000} defaultValue={weakness?.value_text ?? ""} placeholder="Algo que Mara debería recordar para darte mejores opciones…" /><div className={styles.actions}><button className={styles.button} name="action" value="save" type="submit">Guardar</button>{weakness ? <button className={styles.secondary} name="action" value="delete" type="submit">Eliminar</button> : null}</div></form>
        </article>
        <article className={`${styles.card} ${styles.connection}`}><p className={styles.eyebrow}>SINCE YOU LEFT</p><h2>{history.length ? "Hay continuidad." : "Tu historia empieza con una señal real."}</h2>{history.slice(0, 3).map((event, index) => <p key={`${event.event_type}-${event.object_id}-${index}`}>{historyCopy(event.event_type)}</p>)}</article>
      </section>

      <h2 className={styles.sectionTitle}>History</h2>
      <section className={styles.grid}><article className={`${styles.card} ${styles.wide}`}>
        {history.length === 0 ? <p className={styles.empty}>Todavía no hay eventos reales para mostrar. Entra a un Creator World y deja una señal, una demanda o una compra de prueba.</p> : <ul className={styles.list}>{history.map((event, index) => <li className={styles.item} key={`${event.event_type}-${event.object_id}-${event.event_at}-${index}`}><div className={styles.row}><div><strong>{historyCopy(event.event_type)}</strong><p className={styles.muted}>{event.event_at ? new Date(event.event_at).toLocaleString("es-CL") : ""}</p></div><span className={styles.pill}>{event.event_type?.replaceAll("_", " ") ?? "activity"}</span></div></li>)}</ul>}
      </article></section>
    </div></main>
  );
}
