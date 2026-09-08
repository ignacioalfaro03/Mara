export type RevenueRank = "S" | "A" | "B" | "C";
export type RevenuePhase = "P0" | "P1" | "P2" | "P3";
export type RevenuePayer = "FAN" | "CREATOR" | "AGENCY" | "BRAND" | "DEVELOPER";

export type RevenueEngineScenario = {
  id: string;
  name: string;
  rank: RevenueRank;
  phase: RevenuePhase;
  payer: RevenuePayer;
  unitLabel: string;
  grossEconomicBaseMinor: number;
  maraRevenueMinor: number;
  variableCostMinor: number;
  attributedAcquisitionCostMinor: number;
  contributionMinor: number;
  marginPercent: number;
  buildNow: boolean;
  value: string;
  risk: string;
  assumption: string;
};

function safePercent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

function scenario(input: Omit<RevenueEngineScenario, "contributionMinor" | "marginPercent">): RevenueEngineScenario {
  const contributionMinor = input.maraRevenueMinor - input.variableCostMinor - input.attributedAcquisitionCostMinor;
  return {
    ...input,
    contributionMinor,
    marginPercent: safePercent(contributionMinor, input.maraRevenueMinor),
  };
}

export const revenueEngineScenarios: RevenueEngineScenario[] = [
  scenario({
    id: "marketplace-mara-sourced",
    name: "Marketplace · Mara sourced",
    rank: "S",
    phase: "P0",
    payer: "FAN",
    unitLabel: "$100 GMV",
    grossEconomicBaseMinor: 10000,
    maraRevenueMinor: 2500,
    variableCostMinor: 1000,
    attributedAcquisitionCostMinor: 800,
    buildNow: true,
    value: "Mara creates discovery and coordinates the transaction.",
    risk: "A high headline take is meaningless if CAC and high-risk processing consume the margin.",
    assumption: "Illustrative 25% take, 10% variable platform cost and 8% attributable acquisition cost.",
  }),
  scenario({
    id: "creator-pro",
    name: "Creator Pro",
    rank: "S",
    phase: "P0",
    payer: "CREATOR",
    unitLabel: "$49 monthly plan",
    grossEconomicBaseMinor: 4900,
    maraRevenueMinor: 4900,
    variableCostMinor: 1200,
    attributedAcquisitionCostMinor: 0,
    buildNow: true,
    value: "Fan Intelligence, Revenue Copilot, privacy and operating leverage independent of one purchase.",
    risk: "Unlimited AI/media usage can erase SaaS gross margin.",
    assumption: "Illustrative $49 plan with $12 monthly variable software/support cost.",
  }),
  scenario({
    id: "mara-growth",
    name: "Mara Growth",
    rank: "S",
    phase: "P1",
    payer: "CREATOR",
    unitLabel: "$300 attributable incremental GMV",
    grossEconomicBaseMinor: 30000,
    maraRevenueMinor: 2100,
    variableCostMinor: 400,
    attributedAcquisitionCostMinor: 0,
    buildNow: false,
    value: "Mara earns when a measured campaign creates incremental creator revenue.",
    risk: "Bad attribution destroys creator trust; assisted sales cannot be silently billed as incremental.",
    assumption: "Illustrative 7% Growth performance fee and $4 campaign execution cost.",
  }),
  scenario({
    id: "agency-os",
    name: "Agency OS",
    rank: "A",
    phase: "P2",
    payer: "AGENCY",
    unitLabel: "$249 monthly agency plan",
    grossEconomicBaseMinor: 24900,
    maraRevenueMinor: 24900,
    variableCostMinor: 7000,
    attributedAcquisitionCostMinor: 0,
    buildNow: false,
    value: "Multi-creator operations, permissions, fulfillment and portfolio economics.",
    risk: "Private-data blast radius and support burden rise sharply with team access.",
    assumption: "Illustrative $249 plan with $70 support/infra variable allocation.",
  }),
  scenario({
    id: "brand-marketplace",
    name: "Brand Marketplace",
    rank: "A",
    phase: "P2",
    payer: "BRAND",
    unitLabel: "$10k campaign",
    grossEconomicBaseMinor: 1000000,
    maraRevenueMinor: 200000,
    variableCostMinor: 90000,
    attributedAcquisitionCostMinor: 0,
    buildNow: false,
    value: "Brands buy qualified character inventory, campaign coordination and measurable distribution.",
    risk: "Bespoke campaign management and brand-safety conflicts can turn software into an agency.",
    assumption: "Illustrative 20% campaign fee and $900 operating cost per $10k campaign.",
  }),
  scenario({
    id: "creator-app-store",
    name: "Creator App Store",
    rank: "B",
    phase: "P3",
    payer: "DEVELOPER",
    unitLabel: "$500 monthly app billings",
    grossEconomicBaseMinor: 50000,
    maraRevenueMinor: 7500,
    variableCostMinor: 1500,
    attributedAcquisitionCostMinor: 0,
    buildNow: false,
    value: "Third-party developers increase creator capability while Mara supplies distribution and permissions.",
    risk: "An app ecosystem before creator density creates governance cost without meaningful revenue.",
    assumption: "Illustrative 15% app-store share and $15 review/billing/support allocation.",
  }),
];

export const doNotBuildRevenueIdeas = [
  "Paid gambling / raffle / lottery mechanics",
  "Hidden vulnerability-based individualized pricing",
  "Stored-value wallet before payment and regulatory review",
  "Creator lending or cash advances before financial-regulatory readiness",
  "Opaque payment markup without provider permission",
  "Fake scarcity or fake countdowns",
];

export function currency(minor: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(minor / 100);
}

export function aggregateRevenueLab(scenarios = revenueEngineScenarios) {
  const maraRevenueMinor = scenarios.reduce((sum, item) => sum + item.maraRevenueMinor, 0);
  const contributionMinor = scenarios.reduce((sum, item) => sum + item.contributionMinor, 0);
  const buildNowCount = scenarios.filter((item) => item.buildNow).length;
  const sRankCount = scenarios.filter((item) => item.rank === "S").length;

  return {
    maraRevenueMinor,
    contributionMinor,
    contributionMarginPercent: safePercent(contributionMinor, maraRevenueMinor),
    buildNowCount,
    sRankCount,
  };
}
