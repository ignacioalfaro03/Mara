import { notFound } from "next/navigation";
import styles from "./revenue-engine.module.css";
import {
  aggregateRevenueLab,
  currency,
  doNotBuildRevenueIdeas,
  revenueEngineScenarios,
} from "@/lib/revenue-engine-lab";

export default function RevenueEngineLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const summary = aggregateRevenueLab();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>DEV · MARA REVENUE ENGINE LAB</p>
        <h1>No maximices la comisión. Maximiza el valor creado.</h1>
        <p className={styles.lede}>
          Comparador interno con supuestos sintéticos. Sirve para ordenar motores de monetización por contribución, fase, riesgo y valor — no es un forecast ni usa costos reales de proveedores.
        </p>
      </header>

      <section className={styles.summaryGrid} aria-label="Revenue lab summary">
        <article><span>Motores modelados</span><strong>{revenueEngineScenarios.length}</strong></article>
        <article><span>Rank S</span><strong>{summary.sRankCount}</strong></article>
        <article><span>Build now</span><strong>{summary.buildNowCount}</strong></article>
        <article><span>Contribución sintética combinada</span><strong>{currency(summary.contributionMinor)}</strong></article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>PRIORITY MAP</p>
            <h2>Seis motores. No seis prioridades.</h2>
          </div>
          <p>Los números representan unidades económicas distintas y no deben sumarse como una proyección de negocio. El objetivo es comparar estructura de margen y secuencia.</p>
        </div>

        <div className={styles.engineGrid}>
          {revenueEngineScenarios.map((engine) => (
            <article className={styles.engineCard} key={engine.id} data-testid={`engine-${engine.id}`}>
              <div className={styles.engineHeader}>
                <div>
                  <span className={styles.rank}>Rank {engine.rank}</span>
                  <span className={styles.phase}>{engine.phase}</span>
                </div>
                <span className={engine.buildNow ? styles.buildNow : styles.later}>
                  {engine.buildNow ? "BUILD / VALIDATE NOW" : "LATER"}
                </span>
              </div>

              <h3>{engine.name}</h3>
              <p className={styles.unit}>{engine.unitLabel}</p>

              <div className={styles.metrics}>
                <div><span>Mara revenue</span><strong>{currency(engine.maraRevenueMinor)}</strong></div>
                <div><span>Variable cost</span><strong>{currency(engine.variableCostMinor)}</strong></div>
                <div><span>Attributed CAC</span><strong>{currency(engine.attributedAcquisitionCostMinor)}</strong></div>
                <div><span>Contribution</span><strong>{currency(engine.contributionMinor)}</strong></div>
              </div>

              <div className={styles.marginRow}>
                <span>Contribution / Mara revenue</span>
                <strong>{engine.marginPercent}%</strong>
              </div>

              <div className={styles.copyBlock}>
                <p className={styles.kicker}>VALUE</p>
                <p>{engine.value}</p>
              </div>
              <div className={styles.copyBlock}>
                <p className={styles.kicker}>PRIMARY RISK</p>
                <p>{engine.risk}</p>
              </div>
              <small>{engine.assumption}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.principle}>
        <p className={styles.kicker}>ECONOMIC PRINCIPLE</p>
        <h2>Un mismo creador puede producir varias líneas de ingreso para Mara sin subirle el take base.</h2>
        <p>
          Marketplace + Creator Pro + Growth + servicios variables pueden coexistir solo cuando cada cargo tiene una fuente de valor separada y explicable. ARPC alto no sirve si destruye creator net earnings o confianza.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>ANTI-REVENUE</p>
            <h2>Cosas que no debemos monetizar ahora.</h2>
          </div>
          <p>Ingresos con alto riesgo regulatorio, financiero o de confianza no se vuelven buenos negocios solo porque técnicamente se puedan cobrar.</p>
        </div>
        <div className={styles.doNotBuildGrid}>
          {doNotBuildRevenueIdeas.map((idea) => <div key={idea}>{idea}</div>)}
        </div>
      </section>

      <section className={styles.guardrail}>
        <p className={styles.kicker}>LAB CONTRACT</p>
        <h2>Hipótesis, no forecast.</h2>
        <p>
          Ninguna cifra de este laboratorio es precio definitivo, costo de proveedor, autorización de pagos ni proyección. Antes de dinero real: provider eligibility, creator interviews, unit economics y atribución verificable.
        </p>
      </section>
    </main>
  );
}
