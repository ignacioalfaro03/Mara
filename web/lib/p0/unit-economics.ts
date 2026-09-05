export type UnitEconomicsInput = {
  priceUsdCents: number;
  targetContributionMarginBps: number;
  processorFeeUsdCents?: number;
  generationCostUsdCents?: number;
  humanQcCostUsdCents?: number;
  supportRefundCostUsdCents?: number;
  deliveryCostUsdCents?: number;
  fraudChargebackCostUsdCents?: number;
};

export type UnitEconomicsResult = {
  priceUsdCents: number;
  targetContributionMarginBps: number;
  maxVariableCostUsdCents: number;
  knownVariableCostUsdCents: number;
  remainingVariableCostBudgetUsdCents: number;
  modeledContributionUsdCents: number;
  modeledContributionMarginBps: number;
  unknownCostDrivers: string[];
};

const COST_FIELDS: Array<[keyof UnitEconomicsInput, string]> = [
  ["processorFeeUsdCents", "processor fees/reserve economics"],
  ["generationCostUsdCents", "generation"],
  ["humanQcCostUsdCents", "human QC/review"],
  ["supportRefundCostUsdCents", "support/refund"],
  ["deliveryCostUsdCents", "delivery/storage"],
  ["fraudChargebackCostUsdCents", "fraud/chargeback expectation"],
];

export function calculateUnitEconomics(input: UnitEconomicsInput): UnitEconomicsResult {
  const targetMargin = input.targetContributionMarginBps / 10_000;
  const maxVariableCostUsdCents = Math.floor(input.priceUsdCents * (1 - targetMargin));

  const knownVariableCostUsdCents = COST_FIELDS.reduce((total, [field]) => {
    const value = input[field];
    return total + (typeof value === "number" ? value : 0);
  }, 0);

  const modeledContributionUsdCents = input.priceUsdCents - knownVariableCostUsdCents;
  const modeledContributionMarginBps = input.priceUsdCents > 0
    ? Math.round((modeledContributionUsdCents / input.priceUsdCents) * 10_000)
    : 0;

  return {
    priceUsdCents: input.priceUsdCents,
    targetContributionMarginBps: input.targetContributionMarginBps,
    maxVariableCostUsdCents,
    knownVariableCostUsdCents,
    remainingVariableCostBudgetUsdCents: maxVariableCostUsdCents - knownVariableCostUsdCents,
    modeledContributionUsdCents,
    modeledContributionMarginBps,
    unknownCostDrivers: COST_FIELDS
      .filter(([field]) => typeof input[field] !== "number")
      .map(([, label]) => label),
  };
}

export function formatUsd(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  return `${sign}US$${(Math.abs(cents) / 100).toFixed(2)}`;
}
