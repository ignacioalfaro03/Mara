import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import { ProductTelemetry } from "@/components/product-telemetry";
import { historyCopy, readWeakness, type ActivityHistoryRow } from "@/lib/mara-real-data";
import { userRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

export default async function UserHistoryPage() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>MY ACTIVITY</p>
            <h1>Lo que mueves no debería desaparecer.</h1>
            <p>Entra para recuperar lo que quisiste, a qué demanda te sumaste, qué compraste y qué cambió después.</p>
            <div className={styles.actions}>
              <Link className={styles.button} href="/auth">Entrar</Link>
              <Link className={styles.secondary} href="/make-it-happen">Ver qué se está moviendo</Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const [historyResult, weakness] = await Promise.all([
    userRest<ActivityHistoryRow[]>(session.accessToken, `user_activity_history?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=event_at.desc&limit=100`),
    readWeakness(session.accessToken, session.user.id),
  ]);
  const history = historyResult.ok ? historyResult.data : [];

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <ProductTelemetry event="history_viewed" surface="/me/history" target={history.length > 0 ? "has_history" : "empty_history"} />
        {history.length > 0 ? <ProductTelemetry event="returning_user" surface="/me/history" target="history_return" /> : null}

        <nav className={styles.nav}>
          <Link href="/">MARA</Link>
          <div className={styles.actions}>
            <Link className={styles.secondary} href="/make-it-happen">Haz que pase</Link>
            <Link className={styles.secondary} href="/auth">Cuenta</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>MY ACTIVITY</p>
          <h1>Lo que hiciste dejó algo atrás.</h1>
          <p>Esto no es un log técnico. Es tu rastro dentro de Mara: decisiones, demanda, compras, entregas y cosas que todavía pueden cambiar.</p>
        </header>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.connection}`}>
            <p className={styles.eyebrow}>SINCE YOU LEFT</p>
            <h2>{history.length ? "Hay cosas que ya no están donde las dejaste." : "Tu historia empieza cuando dejas una señal real."}</h2>
            {history.length > 0 ? (
              <ul className={styles.list}>
                {history.slice(0, 4).map((event, index) => (
                  <li className={styles.item} key={`${event.event_type}-${event.object_id}-${index}`}>{historyCopy(event.event_type)}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>Entra a un World, pide algo o súmate a una demanda. Cuando esa acción tenga consecuencias, Mara puede traerla de vuelta aquí.</p>
            )}
          </article>

          <article className={styles.card}>
            <p className={styles.eyebrow}>YOUR PRIVATE CONTEXT</p>
            <h2>Algo que solo Mara guarda.</h2>
            <p className={styles.muted}>La versión Network de My Weakness nunca se comparte con una creadora. Es texto declarado por ti y puedes editarlo o borrarlo cuando quieras.</p>
            <form className={styles.form} method="post" action="/api/weakness">
              <input type="hidden" name="scope" value="network" />
              <input type="hidden" name="returnTo" value="/me/history" />
              <textarea name="valueText" maxLength={1000} defaultValue={weakness?.value_text ?? ""} placeholder="Algo que Mara debería recordar para darte opciones más relevantes…" />
              <div className={styles.actions}>
                <button className={styles.button} name="action" value="save" type="submit">Guardar</button>
                {weakness ? <button className={styles.secondary} name="action" value="delete" type="submit">Eliminar</button> : null}
              </div>
            </form>
          </article>
        </section>

        <h2 className={styles.sectionTitle}>Tu rastro</h2>
        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            {history.length === 0 ? (
              <div className={styles.empty}>
                Todavía no hay actividad real asociada a tu cuenta. No vamos a simular una historia que no existe.
                <div className={styles.actions}><Link className={styles.secondary} href="/make-it-happen">Empezar con una señal</Link></div>
              </div>
            ) : (
              <ul className={styles.list}>
                {history.map((event, index) => (
                  <li className={styles.item} key={`${event.event_type}-${event.object_id}-${event.event_at}-${index}`}>
                    <div className={styles.row}>
                      <div>
                        <strong>{historyCopy(event.event_type)}</strong>
                        <p className={styles.muted}>{event.event_at ? new Date(event.event_at).toLocaleString("es-CL") : ""}</p>
                      </div>
                      <span className={styles.pill}>{event.event_type?.replaceAll("_", " ") ?? "activity"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}