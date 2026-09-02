"use client";

import { useEffect, useState } from "react";
import { clearP0DevelopmentEventLog, readP0DevelopmentEventLog } from "@/lib/analytics";
import {
  COMMERCIAL_EXPERIMENT_VARIANTS,
  readCommercialExperimentVariant,
  setCommercialExperimentVariant,
  type CommercialExperimentVariant,
} from "@/lib/p0/commercial-experiment";
import {
  readWtpPriceBucket,
  setWtpPriceBucket,
  WTP_PRICE_BUCKETS,
  type WtpPriceBucket,
} from "@/lib/p0/pricing-experiment";

type Scorecard = {
  variant: string;
  priceBucket: string;
  events: number;
  moments: number;
  intents: number;
  declines: number;
  continued: number;
  mockPurchases: number;
  rewards: number;
  collectionViews: number;
  wtpShown: number;
  wtpYes: number;
  wtpMaybe: number;
  wtpNo: number;
  wtpContinued: number;
};

const P0_LIVING_STATE_KEY = "mara_p0_living_experience";

function buildScorecard(): Scorecard {
  const log = readP0DevelopmentEventLog();
  const lastAssignment = [...log].reverse().find((entry) => entry.event === "commercial_experiment_assigned");
  const lastPrice = [...log].reverse().find((entry) => entry.event === "wtp_price_assigned");

  return {
    variant: String(lastAssignment?.properties.variant ?? readCommercialExperimentVariant() ?? "unassigned"),
    priceBucket: String(lastPrice?.properties.bucket ?? readWtpPriceBucket() ?? "unassigned"),
    events: log.length,
    moments: log.filter((entry) => entry.event === "commercial_moment_shown").length,
    intents: log.filter((entry) => entry.event === "premium_intent").length,
    declines: log.filter((entry) => entry.event === "commercial_offer_dismissed").length,
    continued: log.filter((entry) => entry.event === "commercial_post_offer_continued").length,
    mockPurchases: log.filter((entry) => entry.event === "mock_purchase_completed").length,
    rewards: log.filter((entry) => entry.event === "reward_delivered").length,
    collectionViews: log.filter((entry) => entry.event === "collection_viewed").length,
    wtpShown: log.filter((entry) => entry.event === "wtp_price_shown").length,
    wtpYes: log.filter((entry) => entry.event === "wtp_response_yes").length,
    wtpMaybe: log.filter((entry) => entry.event === "wtp_response_maybe").length,
    wtpNo: log.filter((entry) => entry.event === "wtp_response_no").length,
    wtpContinued: log.filter((entry) => entry.event === "wtp_post_price_continued").length,
  };
}

export function P0DebugPanel() {
  const [status, setStatus] = useState<string>("");
  const [variant, setVariant] = useState<CommercialExperimentVariant | null>(null);
  const [priceBucket, setPriceBucket] = useState<WtpPriceBucket | null>(null);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    setVariant(readCommercialExperimentVariant());
    setPriceBucket(readWtpPriceBucket());
    setScorecard(buildScorecard());
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  async function copyLog() {
    const log = readP0DevelopmentEventLog();
    const payload = JSON.stringify(log, null, 2);

    try {
      await navigator.clipboard.writeText(payload);
      setStatus(`${log.length} eventos P0 copiados.`);
    } catch {
      console.info("[mara:p0-log]", payload);
      setStatus(`${log.length} eventos enviados a consola; clipboard no disponible.`);
    }
  }

  async function copyScorecard() {
    const next = buildScorecard();
    setScorecard(next);
    const payload = JSON.stringify(next, null, 2);

    try {
      await navigator.clipboard.writeText(payload);
      setStatus("Scorecard P0 copiado.");
    } catch {
      console.info("[mara:p0-scorecard]", payload);
      setStatus("Scorecard enviado a consola; clipboard no disponible.");
    }
  }

  function clearLog() {
    clearP0DevelopmentEventLog();
    setScorecard(buildScorecard());
    setStatus("Log P0 limpio.");
  }

  function refreshScorecard() {
    setScorecard(buildScorecard());
    setStatus("Scorecard actualizado.");
  }

  function prepareCleanSession(message: string) {
    window.localStorage.removeItem(P0_LIVING_STATE_KEY);
    clearP0DevelopmentEventLog();
    setStatus(message);
    window.location.reload();
  }

  function forceVariant(nextVariant: CommercialExperimentVariant) {
    setCommercialExperimentVariant(nextVariant);
    setVariant(nextVariant);
    prepareCleanSession(`Variante ${nextVariant} preparada. Reiniciando sesión P0…`);
  }

  function forcePrice(nextBucket: WtpPriceBucket) {
    setWtpPriceBucket(nextBucket);
    setPriceBucket(nextBucket);
    prepareCleanSession(`Precio ${nextBucket} preparado. Reiniciando sesión WTP…`);
  }

  return (
    <aside className="p0DebugPanel" aria-label="Herramientas P0 solo desarrollo">
      <strong>DEV · P0 COMMERCE LAB</strong>
      <span>Eventos seguros de interacción/comercio guardados solo en sessionStorage.</span>

      <div className="p0DebugVariants">
        {COMMERCIAL_EXPERIMENT_VARIANTS.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={variant === item}
            onClick={() => forceVariant(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="p0DebugVariants">
        {WTP_PRICE_BUCKETS.map((item) => (
          <button
            type="button"
            key={item.bucket}
            aria-pressed={priceBucket === item.bucket}
            onClick={() => forcePrice(item.bucket)}
          >
            {item.bucket} · {item.display}
          </button>
        ))}
      </div>

      {scorecard ? (
        <div className="p0DebugScorecard">
          <span>Variant: {scorecard.variant} · WTP: {scorecard.priceBucket}</span>
          <span>moments {scorecard.moments} · intents {scorecard.intents} · declines {scorecard.declines}</span>
          <span>continued {scorecard.continued} · mock purchases {scorecard.mockPurchases}</span>
          <span>rewards {scorecard.rewards} · collection views {scorecard.collectionViews}</span>
          <span>WTP shown {scorecard.wtpShown} · yes {scorecard.wtpYes} · maybe {scorecard.wtpMaybe} · no {scorecard.wtpNo}</span>
          <span>post-price continued {scorecard.wtpContinued}</span>
        </div>
      ) : null}

      <div>
        <button type="button" onClick={refreshScorecard}>Actualizar scorecard</button>
        <button type="button" onClick={copyScorecard}>Copiar scorecard</button>
        <button type="button" onClick={copyLog}>Copiar log P0</button>
        <button type="button" onClick={clearLog}>Limpiar log</button>
      </div>
      {status ? <small aria-live="polite">{status}</small> : null}
    </aside>
  );
}
