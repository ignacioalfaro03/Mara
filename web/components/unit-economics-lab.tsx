"use client";

import { useMemo, useState } from "react";
import { WTP_PRICE_BUCKETS } from "@/lib/p0/pricing-experiment";
import { calculateUnitEconomics, formatUsd } from "@/lib/p0/unit-economics";

type CostKey =
  | "processorFee"
  | "generation"
  | "humanQc"
  | "supportRefund"
  | "delivery"
  | "fraudChargeback";

type CostState = Record<CostKey, string>;

const INITIAL_COSTS: CostState = {
  processorFee: "",
  generation: "",
  humanQc: "",
  supportRefund: "",
  delivery: "",
  fraudChargeback: "",
};

const COST_FIELDS: Array<{ key: CostKey; label: string }> = [
  { key: "processorFee", label: "Processor variable cost / effective fee" },
  { key: "generation", label: "Generation" },
  { key: "humanQc", label: "Human QC / review" },
  { key: "supportRefund", label: "Support + expected refunds" },
  { key: "delivery", label: "Delivery / storage" },
  { key: "fraudChargeback", label: "Expected fraud / chargeback cost" },
];

function dollarsToCents(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : undefined;
}

export function UnitEconomicsLab() {
  const [costs, setCosts] = useState<CostState>(INITIAL_COSTS);
  const targetContributionMarginBps = 6500;

  const rows = useMemo(() => WTP_PRICE_BUCKETS.map((price) => {
    const result = calculateUnitEconomics({
      priceUsdCents: price.amountUsdCents,
      targetContributionMarginBps,
      processorFeeUsdCents: dollarsToCents(costs.processorFee),
      generationCostUsdCents: dollarsToCents(costs.generation),
      humanQcCostUsdCents: dollarsToCents(costs.humanQc),
      supportRefundCostUsdCents: dollarsToCents(costs.supportRefund),
      deliveryCostUsdCents: dollarsToCents(costs.delivery),
      fraudChargebackCostUsdCents: dollarsToCents(costs.fraudChargeback),
    });

    return { price, result };
  }), [costs]);

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · FIRST PAYMENT ECONOMICS</p>
        <h1>Que alguien diga que pagaría no basta.</h1>
        <p className="livingLead">
          El precio candidato también tiene que sobrevivir processor, generación, QC, soporte y chargebacks. Objetivo P0 de diseño: 65% contribution margin antes de costos fijos e impuestos.
        </p>

        <div className="profileGrid">
          {COST_FIELDS.map((field) => (
            <article key={field.key}>
              <span>{field.label}</span>
              <label>
                US$ por transacción
                <input
                  inputMode="decimal"
                  value={costs[field.key]}
                  placeholder="unknown"
                  onChange={(event) => setCosts((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              </label>
            </article>
          ))}
        </div>

        <div className="premiumList">
          {rows.map(({ price, result }) => (
            <article key={price.bucket}>
              <span>{price.bucket}</span>
              <div>
                <h2>{price.display}</h2>
                <p>
                  Max variable cost @65% CM: <strong>{formatUsd(result.maxVariableCostUsdCents)}</strong> · known costs entered: {formatUsd(result.knownVariableCostUsdCents)} · remaining budget: <strong>{formatUsd(result.remainingVariableCostBudgetUsdCents)}</strong>.
                </p>
                <p>
                  Modeled margin using only entered costs: {(result.modeledContributionMarginBps / 100).toFixed(1)}%. {result.unknownCostDrivers.length > 0 ? `Unknown: ${result.unknownCostDrivers.join(", ")}.` : "All variable cost categories modeled."}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="livingDisclosure">
          This is a planning tool, not accounting truth. Rolling reserves and payout delays affect cash flow separately from contribution margin. Do not enter a real processor fee until it comes from an actual quote/contract for Mara's approved adult AI scope.
        </p>
      </div>
    </section>
  );
}
