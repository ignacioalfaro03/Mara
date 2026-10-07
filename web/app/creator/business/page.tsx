import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { buildCreatorBusinessControl } from "@/lib/creator-business-control";
import {
  formatMoney,
  readCreatorBusinessRevenue,
  readCreatorBusinessSettings,
  readOwnCreator,
} from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

function pct(value: number) {
  return new Intl.NumberFormat("es-CL", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function statusLabel(status: string) {
  if (status === "ON_TRACK") return "En línea";
  if (status === "AT_RISK") return "En riesgo";
  if (status === "OFF_TRACK") return "Fuera de meta";
  return "Sin meta";
}

export default async function CreatorBusinessPage() {
  if (process.env.MARA_CREATOR_BUSINESS_CONTROL_ENABLED !== "true") notFound();

  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return (
      <main className={styles.shell}><div className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR BUSINESS OS</p>
          <h1>Tu negocio necesita una sesión real.</h1>
          <p>Entra para leer exclusivamente tus datos bajo RLS.</p>
          <Link className={styles.button} href="/auth">Entrar</Link>
        </section>
      </div></main>
    );
  }

  const creator = await readOwnCreator(session.accessToken, session.user.id);
  if (!creator) {
    return (
      <main className={styles.shell}><div className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>CREATOR BUSINESS OS</p>
          <h1>Primero activa tu cuenta de creadora.</h1>
          <Link className={styles.button} href="/creator">Volver a Creator OS</Link>
        </section>
      </div></main>
    );
  }

  const settings = await readCreatorBusinessSettings(session.accessToken, creator.id);
  const revenue = settings ? await readCreatorBusinessRevenue(session.accessToken, creator.id) : null;
  const control = settings && revenue
    ? buildCreatorBusinessControl(
        revenue.purchases.map((purchase) => ({
          id: purchase.id,
          source: "MARA" as const,
          occurredAt: purchase.created_at,
          amountMinor: purchase.amount_minor,
          currency: purchase.currency,
          customerKey: purchase.user_id,
        })),
        {
          currency: settings.currency,
          monthlyRevenueGoalMinor: settings.monthly_revenue_goal_minor,
          monthlyFixedCostsMinor: settings.monthly_fixed_costs_minor,
          variableCostRateBps: settings.variable_cost_rate_bps,
          timeZone: settings.time_zone,
        },
      )
    : null;

  return (
    <main className={styles.shell}><div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/creator">← Creator OS</Link>
        <Link className={styles.secondary} href="/auth">Cuenta</Link>
      </nav>

      <header className={styles.hero}>
        <p className={styles.eyebrow}>CREATOR BUSINESS OS · CONTROL V1</p>
        <h1>¿Cómo va tu negocio?</h1>
        <p>Meta, forecast, brecha y punto de equilibrio usando ventas reales. Esta primera versión usa Mara como fuente y muestra explícitamente el modelo de forecast.</p>
      </header>

      {control ? (
        <>
          <section className={styles.grid}>
            <article className={styles.third}>
              <p className={styles.eyebrow}>REAL A HOY</p>
              <p className={styles.metric}>{formatMoney(control.actualRevenueMinor, control.currency)}</p>
              <p className={styles.muted}>{pct(control.goalAttainmentActual)} de la meta mensual</p>
            </article>
            <article className={styles.third}>
              <p className={styles.eyebrow}>FORECAST BASE</p>
              <p className={styles.metric}>{formatMoney(control.forecastBaseMinor, control.currency)}</p>
              <p className={styles.muted}>{statusLabel(control.status)} · confianza {control.confidence}</p>
            </article>
            <article className={styles.third}>
              <p className={styles.eyebrow}>BRECHA PROYECTADA</p>
              <p className={styles.metric}>
                {control.forecastGapMinor > 0
                  ? "-" + formatMoney(control.forecastGapMinor, control.currency)
                  : "+" + formatMoney(control.forecastSurplusMinor, control.currency)}
              </p>
              <p className={styles.muted}>Meta {formatMoney(control.monthlyGoalMinor, control.currency)}</p>
            </article>
          </section>

          <section className={styles.grid}>
            <article className={styles.card}>
              <p className={styles.eyebrow}>PUNTO DE EQUILIBRIO</p>
              <h2>{formatMoney(control.breakEvenRevenueMinor, control.currency)}</h2>
              <p className={styles.muted}>
                {control.breakEvenReached ? "Ya alcanzado con el ingreso registrado." : "Todavía no alcanzado."}
              </p>
              <p>Margen de contribución supuesto: {pct(control.contributionMarginBps / 10_000)}.</p>
            </article>
            <article className={styles.card}>
              <p className={styles.eyebrow}>RANGO DE CIERRE</p>
              <h2>{formatMoney(control.forecastLowMinor, control.currency)} — {formatMoney(control.forecastHighMinor, control.currency)}</h2>
              <p className={styles.muted}>Resultado operativo esperado: {formatMoney(control.expectedOperatingResultMinor, control.currency)}.</p>
              <p className={styles.small}>Modelo: {control.model}. Compara ritmo del mes con los últimos 7 días; no pretende ser todavía un forecast probabilístico avanzado.</p>
            </article>
          </section>

          {revenue?.truncated ? (
            <p className={styles.notice}>El corte alcanzó el límite de 1.000 compras. No uses este forecast para decisiones hasta ampliar el agregado server-side.</p>
          ) : null}

          <section className={styles.grid}>
            <article className={styles.card + " " + styles.wide}>
              <p className={styles.eyebrow}>FUENTES</p>
              <h2>Mara es la primera fuente canónica.</h2>
              <p className={styles.muted}>OnlyFans, Arsmate y RRSS están modelados como fuentes futuras, pero no se muestran como conectados hasta existir una integración oficial/importación autorizada y verificable.</p>
              <p>Mara: {formatMoney(control.revenueBySource.MARA ?? 0, control.currency)} · {control.observationsUsed} transacciones usadas.</p>
            </article>
          </section>
        </>
      ) : (
        <section className={styles.grid}>
          <article className={styles.card + " " + styles.wide}>
            <p className={styles.eyebrow}>PRIMER PASO</p>
            <h2>Define la meta y la estructura mínima de costos.</h2>
            <p className={styles.muted}>No inventamos forecast ni break-even hasta tener tus supuestos básicos.</p>
          </article>
        </section>
      )}

      <h2 className={styles.sectionTitle}>Supuestos de control</h2>
      <section className={styles.grid}>
        <article className={styles.card + " " + styles.wide}>
          <form className={styles.form} method="post" action="/api/creator/business-settings">
            <input type="hidden" name="returnTo" value="/creator/business" />
            <label>
              Moneda
              <select name="currency" defaultValue={settings?.currency ?? "CLP"}>
                <option value="CLP">CLP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
            <div className={styles.twoCol}>
              <label>
                Meta mensual
                <input name="monthlyRevenueGoal" type="number" min="0" step="1" required defaultValue={(settings?.monthly_revenue_goal_minor ?? 0) / 100} />
              </label>
              <label>
                Costos fijos mensuales
                <input name="monthlyFixedCosts" type="number" min="0" step="1" required defaultValue={(settings?.monthly_fixed_costs_minor ?? 0) / 100} />
              </label>
            </div>
            <label>
              Costos variables (% de ventas)
              <input name="variableCostPercent" type="number" min="0" max="99.99" step="0.01" required defaultValue={(settings?.variable_cost_rate_bps ?? 0) / 100} />
            </label>
            <button className={styles.button} type="submit">Guardar y recalcular</button>
          </form>
        </article>
      </section>
    </div></main>
  );
}
