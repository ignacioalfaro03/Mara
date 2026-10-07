import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { buildCreatorBusinessHealth } from "@/lib/creator-business-control";
import {
  formatMoney,
  readCreatorBusinessActions,
  readCreatorBusinessCustomers,
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

function healthLabel(state: string) {
  if (state === "HEALTHY") return "Saludable";
  if (state === "WATCH") return "Observar";
  if (state === "AT_RISK") return "En riesgo";
  if (state === "DORMANT") return "Dormant";
  if (state === "REACTIVATED") return "Reactivado";
  return "Primera compra";
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
  const [revenue, existingActions, customers] = settings
    ? await Promise.all([
        readCreatorBusinessRevenue(session.accessToken, creator.id),
        readCreatorBusinessActions(session.accessToken, creator.id),
        readCreatorBusinessCustomers(session.accessToken, creator.id),
      ])
    : [null, [], []];

  const customerAliases = new Map(
    customers
      .filter((customer) => customer.user_id)
      .map((customer) => [customer.user_id as string, customer.alias || "Cliente"]),
  );

  const health = settings && revenue
    ? buildCreatorBusinessHealth(
        revenue.purchases.map((purchase) => ({
          id: purchase.id,
          source: "MARA" as const,
          occurredAt: purchase.created_at,
          amountMinor: purchase.amount_minor,
          currency: purchase.currency,
          customerKey: purchase.user_id,
          sourceRecordId: purchase.provider_payment_id,
          provenanceType: "MARA_NATIVE" as const,
        })),
        {
          currency: settings.currency,
          monthlyRevenueGoalMinor: settings.monthly_revenue_goal_minor,
          monthlyFixedCostsMinor: settings.monthly_fixed_costs_minor,
          variableCostRateBps: settings.variable_cost_rate_bps,
          timeZone: settings.time_zone,
        },
        new Date(),
        existingActions
          .filter((action) => action.user_id && action.action && action.reason)
          .map((action) => ({
            customerKey: action.user_id as string,
            action: action.action as string,
            reason: action.reason as string,
            priority: action.priority ?? "low",
          })),
      )
    : null;

  const topRisk = health?.risk.customers.filter((customer) => customer.revenueAtRiskMinor > 0).slice(0, 3) ?? [];

  return (
    <main className={styles.shell}><div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/creator">← Creator OS</Link>
        <Link className={styles.secondary} href="/auth">Cuenta</Link>
      </nav>

      <header className={styles.hero}>
        <p className={styles.eyebrow}>CREATOR BUSINESS OS · P1</p>
        <h1>¿Cómo va tu negocio?</h1>
        <p>Control económico simple arriba; reglas auditables abajo. Mara explica el cierre, qué cambió, qué revenue está en riesgo y cuál es la acción más relevante.</p>
      </header>

      {health ? (
        <>
          <h2 className={styles.sectionTitle}>Cómo voy</h2>
          <section className={styles.grid}>
            <article className={styles.third}>
              <p className={styles.eyebrow}>REAL A HOY</p>
              <p className={styles.metric}>{formatMoney(health.control.actualRevenueMinor, health.currency)}</p>
              <p className={styles.muted}>{pct(health.control.goalAttainmentActual)} de la meta</p>
            </article>
            <article className={styles.third}>
              <p className={styles.eyebrow}>FORECAST</p>
              <p className={styles.metric}>{formatMoney(health.control.forecastBaseMinor, health.currency)}</p>
              <p className={styles.muted}>{statusLabel(health.control.status)} · confianza {health.control.confidence}</p>
            </article>
            <article className={styles.third}>
              <p className={styles.eyebrow}>BRECHA</p>
              <p className={styles.metric}>
                {health.control.forecastGapMinor > 0
                  ? "-" + formatMoney(health.control.forecastGapMinor, health.currency)
                  : "+" + formatMoney(health.control.forecastSurplusMinor, health.currency)}
              </p>
              <p className={styles.muted}>Break-even {formatMoney(health.control.breakEvenRevenueMinor, health.currency)}</p>
            </article>
          </section>

          <h2 className={styles.sectionTitle}>Qué cambió</h2>
          <section className={styles.grid}>
            <article className={styles.card}>
              <p className={styles.eyebrow}>REVENUE BRIDGE · MISMO CORTE DEL MES</p>
              {health.bridge ? (
                <>
                  <h2>{formatMoney(health.bridge.startRevenueMinor, health.currency)} → {formatMoney(health.bridge.endRevenueMinor, health.currency)}</h2>
                  <p className={styles.muted}>Comparación hasta el día {health.bridge.comparisonThroughDay}. El puente reconcilia matemáticamente.</p>
                  <ul className={styles.list}>
                    <li className={styles.item}>Nuevos: +{formatMoney(health.bridge.newRevenueMinor, health.currency)}</li>
                    <li className={styles.item}>Reactivados: +{formatMoney(health.bridge.reactivatedRevenueMinor, health.currency)}</li>
                    <li className={styles.item}>Expansión: +{formatMoney(health.bridge.expansionRevenueMinor, health.currency)}</li>
                    <li className={styles.item}>Contracción: -{formatMoney(health.bridge.contractionRevenueMinor, health.currency)}</li>
                    <li className={styles.item}>Revenue no repetido: -{formatMoney(health.bridge.lostRevenueMinor, health.currency)}</li>
                  </ul>
                </>
              ) : <p className={styles.empty}>No existe un periodo comparable todavía.</p>}
            </article>

            <article className={styles.card}>
              <p className={styles.eyebrow}>RAMPA MENSUAL</p>
              <h2>{health.dataCoverageDays} días de cobertura observada</h2>
              <ul className={styles.list}>
                {health.ramp.map((month) => (
                  <li className={styles.item} key={month.period}>
                    <div className={styles.row}>
                      <strong>{month.period}</strong>
                      <span>{formatMoney(month.revenueMinor, month.currency)}</span>
                    </div>
                    <p className={styles.small}>
                      {month.activeCustomers} clientes · {month.transactions} compras · ARPU {formatMoney(month.arpuMinor, month.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <h2 className={styles.sectionTitle}>Qué está en riesgo</h2>
          <section className={styles.grid}>
            <article className={styles.card}>
              <p className={styles.eyebrow}>REVENUE AT RISK</p>
              <h2>{formatMoney(health.risk.revenueAtRiskMinor, health.currency)}</h2>
              <p className={styles.muted}>Método: una compra histórica promedio por comprador recurrente fuera de su cadencia esperada. Confianza {health.risk.confidence}.</p>
              <p>{health.atRiskCustomers} en riesgo · {health.dormantCustomers} dormant · {health.risk.watchCustomers} en observación.</p>
              {topRisk.length > 0 ? (
                <ul className={styles.list}>
                  {topRisk.map((customer) => (
                    <li className={styles.item} key={customer.customerKey}>
                      <div className={styles.row}>
                        <strong>{customerAliases.get(customer.customerKey) ?? "Cliente"}</strong>
                        <span className={styles.pill}>{healthLabel(customer.state)}</span>
                      </div>
                      <p className={styles.small}>{customer.reason}</p>
                      <p className={styles.small}>Contexto económico: {formatMoney(customer.revenueAtRiskMinor, health.currency)}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className={styles.empty}>No hay revenue-at-risk material bajo las reglas actuales.</p>}
            </article>

            <article className={styles.card}>
              <p className={styles.eyebrow}>CONCENTRACIÓN</p>
              <h2>Top 1: {pct(health.concentration.top1Share)}</h2>
              <p>Top 3: {pct(health.concentration.top3Share)} · Top 5: {pct(health.concentration.top5Share)}</p>
              <p className={styles.muted}>Esto mide dependencia económica, no calidad de la relación con los clientes.</p>
              <p>Forecast range: {formatMoney(health.control.forecastLowMinor, health.currency)} — {formatMoney(health.control.forecastHighMinor, health.currency)}</p>
            </article>
          </section>

          <h2 className={styles.sectionTitle}>Qué hago ahora</h2>
          <section className={styles.grid}>
            <article className={styles.card + " " + styles.wide}>
              <p className={styles.eyebrow}>PRIORIDAD ECONÓMICA</p>
              <h2>{health.mainAction.title}</h2>
              <p>{health.mainAction.reason}</p>
              <p className={styles.muted}>
                Contexto económico: {formatMoney(health.mainAction.economicContextMinor, health.currency)} · confianza {health.mainAction.confidence} · fuente {health.mainAction.source === "CREATOR_OS_NEXT_BEST_ACTION" ? "Creator OS" : "Business Control"}.
              </p>
              {health.mainAction.customerKey ? <Link className={styles.secondary} href={\`/creator/customers/\${health.mainAction.customerKey}\`}>Ver cliente</Link> : null}
            </article>
          </section>

          {health.drivers.length > 0 ? (
            <section className={styles.grid}>
              <article className={styles.card + " " + styles.wide}>
                <p className={styles.eyebrow}>DRIVERS</p>
                <ul className={styles.list}>
                  {health.drivers.map((driver) => (
                    <li className={styles.item} key={driver.key}>
                      <strong>{driver.text}</strong>
                      {typeof driver.amountMinor === "number" ? <span> {formatMoney(driver.amountMinor, health.currency)}</span> : null}
                    </li>
                  ))}
                </ul>
              </article>
            </section>
          ) : null}

          {revenue?.truncated ? (
            <p className={styles.notice}>La lectura alcanzó el límite temporal de 5.000 compras. No uses ramp, bridge o risk como control definitivo hasta mover este agregado al backend.</p>
          ) : null}

          <section className={styles.grid}>
            <article className={styles.card + " " + styles.wide}>
              <p className={styles.eyebrow}>FUENTES</p>
              <h2>Mara sigue siendo la única fuente conectada.</h2>
              <p className={styles.muted}>OnlyFans, Arsmate y RRSS son labels de dominio futuros. P1 prepara importación CSV con provenance y deduplicación, pero no muestra ninguna plataforma como conectada sin evidencia técnica real.</p>
            </article>
          </section>
        </>
      ) : (
        <section className={styles.grid}>
          <article className={styles.card + " " + styles.wide}>
            <p className={styles.eyebrow}>PRIMER PASO</p>
            <h2>Define la meta y la estructura mínima de costos.</h2>
            <p className={styles.muted}>No inventamos forecast, break-even ni riesgo antes de tener los supuestos básicos.</p>
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
