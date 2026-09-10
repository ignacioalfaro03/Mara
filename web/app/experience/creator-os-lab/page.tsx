import { notFound } from "next/navigation";
import styles from "./creator-os.module.css";
import {
  dashboardSummary,
  deriveSegments,
  earningsPerCreatorHour,
  money,
  recommendNextAction,
  syntheticFans,
  visiblePreferenceSignals,
} from "@/lib/creator-os-lab";

const segmentLabels: Record<string, string> = {
  FIRST_TIME_BUYER: "Primera compra",
  REPEAT_BUYER: "Repite",
  VIP: "VIP",
  MEMBER: "Miembro",
  DORMANT: "Dormido",
  CUSTOMER_WAITING_FOR_DELIVERY: "Entrega pendiente",
  AUDIO_BUYER: "Audio",
  COLLECTOR: "Coleccionista",
  CREATOR_BROUGHT: "Lo trajo la creadora",
  MARA_DISCOVERED: "Lo trajo Mara",
};

function sourceLabel(source: "CREATOR" | "MARA" | "CROSS_CREATOR") {
  if (source === "CREATOR") return "Creator brought";
  if (source === "MARA") return "Mara brought";
  return "Cross-creator";
}

export default function CreatorOsLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const summary = dashboardSummary(syntheticFans);

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>DEV · MARA CREATOR OS LAB</p>
        <h1>Qué pasó. Quién importa. Qué hacer después.</h1>
        <p className={styles.lede}>
          Prototipo interno con datos sintéticos. Fan 360 muestra contexto comercial y procedencia de cada señal sin exponer identidad civil, contacto privado ni inferencias íntimas ocultas.
        </p>
      </header>

      <section className={styles.summaryGrid} aria-label="Resumen creadora">
        <article>
          <span>GMV observado</span>
          <strong>{money(summary.grossMinor)}</strong>
        </article>
        <article>
          <span>Ganancia creadora</span>
          <strong>{money(summary.creatorNetMinor)}</strong>
        </article>
        <article>
          <span>Compradores que repiten</span>
          <strong>{summary.repeatBuyers} / {syntheticFans.length}</strong>
        </article>
        <article>
          <span>Ganancia / hora creadora</span>
          <strong>{money(summary.earningsPerHourMinor)}</strong>
        </article>
      </section>

      <section className={styles.splitStats}>
        <div>
          <p className={styles.kicker}>ATRIBUCIÓN</p>
          <h2>Quién creó la demanda.</h2>
          <p>La comisión futura debe poder distinguir demanda aportada por la creadora de demanda realmente generada por Mara.</p>
        </div>
        <div className={styles.attributionCards}>
          <article>
            <span>Creator brought</span>
            <strong>{money(summary.creatorSourcedMinor)}</strong>
            <small>Hipótesis: take menor / BYOA.</small>
          </article>
          <article>
            <span>Mara brought</span>
            <strong>{money(summary.maraSourcedMinor)}</strong>
            <small>Hipótesis: take mayor porque Mara creó discovery.</small>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>WHO MATTERS</p>
            <h2>Relaciones que merecen atención.</h2>
          </div>
          <p>La prioridad no es “quién gastó más”, sino qué necesita fulfillment, qué relación repite y dónde una acción tiene sentido sin sobrecontactar.</p>
        </div>

        <div className={styles.fanGrid}>
          {syntheticFans.map((fan) => {
            const segments = deriveSegments(fan);
            const action = recommendNextAction(fan);
            const perHour = earningsPerCreatorHour(fan);
            const visibleSignals = visiblePreferenceSignals(fan);

            return (
              <article className={styles.fanCard} key={fan.alias} data-testid={`fan-${fan.alias}`}>
                <div className={styles.fanHeader}>
                  <div>
                    <span className={styles.alias}>@{fan.alias}</span>
                    <small>{sourceLabel(fan.attribution)}</small>
                  </div>
                  <span className={`${styles.priority} ${styles[action.priority]}`}>{action.priority}</span>
                </div>

                <div className={styles.metrics}>
                  <div><span>Gastó</span><strong>{money(fan.totalSpendMinor)}</strong></div>
                  <div><span>Órdenes</span><strong>{fan.orderCount}</strong></div>
                  <div><span>Última compra</span><strong>{fan.lastPurchaseDaysAgo}d</strong></div>
                  <div><span>Ganancia/h</span><strong>{perHour === null ? "—" : money(perHour)}</strong></div>
                </div>

                <div className={styles.segmentRow}>
                  {segments.map((segment) => <span key={segment}>{segmentLabels[segment]}</span>)}
                </div>

                <div className={styles.actionBox}>
                  <p className={styles.kicker}>NEXT BEST ACTION</p>
                  <strong>{action.title}</strong>
                  <p>{action.reason}</p>
                </div>

                <div className={styles.signalList}>
                  <p className={styles.kicker}>FAN 360 · PROVENANCE</p>
                  {visibleSignals.map((signal) => (
                    <div className={styles.signal} key={`${fan.alias}-${signal.key}`}>
                      <div>
                        <span className={styles.signalLabel}>{signal.label}</span>
                        <strong>{signal.displayValue}</strong>
                      </div>
                      <p>{signal.explanation}</p>
                      <small>
                        source={signal.source} · confidence={signal.confidence} · scope={signal.scope} · consent={signal.consentStatus} · created={signal.createdAt} · {signal.userEditable ? "editable" : "system-derived/not directly editable"}
                      </small>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>ANTI-LEAKAGE</p>
            <h2>Que quedarse sea mejor que irse.</h2>
          </div>
        </div>
        <div className={styles.fourLayers}>
          <article><span>01</span><strong>Value</strong><p>Fan 360, privacidad, fulfillment, booking, library, protección y discovery.</p></article>
          <article><span>02</span><strong>Economics</strong><p>Menor take cuando la creadora trae demanda; mayor take cuando Mara realmente la genera.</p></article>
          <article><span>03</span><strong>Product</strong><p>Mensajería, entrega y sesiones sin intercambiar teléfono, correo o cuentas privadas.</p></article>
          <article><span>04</span><strong>Policy</strong><p>Reglas estrechas y apelables contra steering deliberado, nunca castigo automático por una palabra.</p></article>
        </div>
      </section>

      <section className={styles.guardrail}>
        <p className={styles.kicker}>PRIVACY RULE</p>
        <h2>Personal no significa dossier.</h2>
        <p>
          Esta capa solo debe usar datos necesarios para comercio/fulfillment y separar DECLARED, OBSERVED y DERIVED. No debe inferir orientación sexual, salud, vulnerabilidad económica, dependencia, soledad ni otros atributos sensibles para vender más.
        </p>
      </section>
    </main>
  );
}
