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
import {
  caprichoProgress,
  channelConversion,
  creatorCommerceSummary,
  gmvPerVisitorMinor,
  syntheticCaprichos,
  syntheticChannels,
  syntheticCreator,
  syntheticOffers,
} from "@/lib/creator-commerce-lab";

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

function channelLabel(channel: string) {
  return channel.replaceAll("_", " ");
}

export default function CreatorOsLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const summary = dashboardSummary(syntheticFans);
  const commerce = creatorCommerceSummary();

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>DEV · MARA CREATOR COMMERCE OS LAB</p>
        <h1>Convierte atención en ingresos.</h1>
        <p className={styles.lede}>
          Prototipo interno con datos sintéticos. Une Creator Store, Offers, Caprichos, Bring Your Audience y Fan 360 sin activar pagos, payouts ni datos reales de creadoras.
        </p>
      </header>

      <section className={styles.creatorIdentity} aria-label="Identidad comercial de creadora">
        <div>
          <p className={styles.kicker}>CREATOR STORE</p>
          <h2>{syntheticCreator.publicName} <span>{syntheticCreator.handle}</span></h2>
          <p>{syntheticCreator.publicStoreUrl}</p>
        </div>
        <div className={styles.identityMode}>
          <span>Exposure mode</span>
          <strong>{syntheticCreator.exposureMode.replaceAll("_", " ")}</strong>
          <small>La exposición es una configuración, no el producto.</small>
        </div>
      </section>

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

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>ANYTHING PERMITTED CAN BECOME AN OFFER</p>
            <h2>Creator Store.</h2>
          </div>
          <p>
            La creadora define qué vende, precio, límites y fulfillment. La plataforma no la obliga a una suscripción ni a un formato único.
          </p>
        </div>

        <div className={styles.offerGrid}>
          {syntheticOffers.map((offer) => (
            <article className={styles.offerCard} key={offer.id}>
              <div className={styles.offerTopline}>
                <span>{offer.family.replaceAll("_", " ")}</span>
                <span>{offer.fulfillmentMode.replaceAll("_", " ")}</span>
              </div>
              <h3>{offer.title}</h3>
              <strong>{money(offer.priceMinor)}</strong>
              <div className={styles.offerMeta}>
                <span>{offer.sold} ventas</span>
                <span>{offer.capacity === null ? "Sin límite fijo" : `${offer.capacity} cupos`}</span>
                <span>{offer.deliveryHours === null ? "Entrega según producto" : `${offer.deliveryHours}h SLA`}</span>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.commerceStrip}>
          <div><span>Offers activos</span><strong>{commerce.activeOffers}</strong></div>
          <div><span>GMV sintético de Offers</span><strong>{money(commerce.offerGmvMinor)}</strong></div>
          <div><span>Caprichos financiados</span><strong>{money(commerce.caprichoFundedMinor)}</strong></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>CAPRICHOS</p>
            <h2>Financia deseos, no solo contenido.</h2>
          </div>
          <p>
            Un Capricho es participación en el mundo de la creadora. Si promete un entregable concreto, deja de ser solo Capricho y debe modelarse como Offer.
          </p>
        </div>

        <div className={styles.caprichoGrid}>
          {syntheticCaprichos.map((capricho) => {
            const progress = Math.round(caprichoProgress(capricho) * 100);
            return (
              <article className={styles.caprichoCard} key={capricho.id}>
                <div className={styles.caprichoHeader}>
                  <span>{capricho.status}</span>
                  <strong>{progress}%</strong>
                </div>
                <h3>{capricho.title}</h3>
                <p>{money(capricho.fundedMinor)} de {money(capricho.targetMinor)}</p>
                <div className={styles.progressTrack} aria-label={`${progress}% financiado`}>
                  <div style={{ width: `${progress}%` }} />
                </div>
                <div className={styles.offerMeta}>
                  <span>{capricho.contributors} aportantes</span>
                  <span>Desde {money(capricho.contributionMinimumMinor)}</span>
                  <span>{capricho.linkedUpdate ? "Update vinculado" : "Sin entregable prometido"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>BRING YOUR AUDIENCE</p>
            <h2>Qué canal trae dinero, no solo visitas.</h2>
          </div>
          <p>
            Instagram, TikTok, X y otros canales siguen siendo adquisición. Mara debe atribuir visita → comprador → GMV → recompra y cobrar distinto cuando Mara realmente genera la demanda.
          </p>
        </div>

        <div className={styles.channelTable} role="table" aria-label="Atribución por canal">
          <div className={styles.channelRowHeader} role="row">
            <span>Canal</span><span>Visitas</span><span>Compradores</span><span>Conversión</span><span>GMV</span><span>GMV/visita</span>
          </div>
          {syntheticChannels.map((channel) => (
            <div className={styles.channelRow} role="row" key={channel.channel}>
              <strong>{channelLabel(channel.channel)}</strong>
              <span>{channel.visits.toLocaleString("es-CL")}</span>
              <span>{channel.buyers}</span>
              <span>{(channelConversion(channel) * 100).toFixed(1)}%</span>
              <span>{money(channel.gmvMinor)}</span>
              <span>{money(gmvPerVisitorMinor(channel))}</span>
            </div>
          ))}
        </div>

        <div className={styles.commerceStrip}>
          <div><span>GMV creator-sourced</span><strong>{money(commerce.creatorSourcedGmvMinor)}</strong></div>
          <div><span>GMV Mara-sourced</span><strong>{money(commerce.maraSourcedGmvMinor)}</strong></div>
          <div><span>GMV atribuido total</span><strong>{money(commerce.totalChannelGmvMinor)}</strong></div>
        </div>
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
