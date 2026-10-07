export type CreatorBusinessSource =
  | "MARA"
  | "ONLYFANS"
  | "ARSMATE"
  | "INSTAGRAM"
  | "TIKTOK"
  | "X"
  | "OTHER";

export type BusinessRevenueObservation = {
  id: string;
  source: CreatorBusinessSource;
  occurredAt: string;
  amountMinor: number;
  currency: string;
  customerKey?: string | null;
};

export type CreatorBusinessControlSettings = {
  currency: string;
  monthlyRevenueGoalMinor: number;
  monthlyFixedCostsMinor: number;
  variableCostRateBps: number;
  timeZone: string;
};

export type BusinessControlStatus = "NO_GOAL" | "ON_TRACK" | "AT_RISK" | "OFF_TRACK";
export type ForecastConfidence = "low" | "medium";

export type CreatorBusinessControlSnapshot = {
  period: string;
  currency: string;
  model: "RUN_RATE_WITH_TRAILING_7D_V1";
  confidence: ForecastConfidence;
  actualRevenueMinor: number;
  monthlyGoalMinor: number;
  forecastBaseMinor: number;
  forecastLowMinor: number;
  forecastHighMinor: number;
  forecastGapMinor: number;
  forecastSurplusMinor: number;
  goalAttainmentActual: number;
  goalAttainmentForecast: number;
  status: BusinessControlStatus;
  contributionMarginBps: number;
  breakEvenRevenueMinor: number;
  breakEvenReached: boolean;
  expectedOperatingResultMinor: number;
  daysElapsed: number;
  daysInMonth: number;
  observationsUsed: number;
  revenueBySource: Partial<Record<CreatorBusinessSource, number>>;
};

type LocalDateParts = { year: number; month: number; day: number };

function integer(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label}_invalid`);
  return Math.round(value);
}

function localDateParts(value: Date, timeZone: string): LocalDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(value);
  const numberPart = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const year = numberPart("year");
  const month = numberPart("month");
  const day = numberPart("day");
  if (!year || !month || !day) throw new Error("timezone_date_resolution_failed");
  return { year, month, day };
}

function monthDays(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function sameMonth(left: LocalDateParts, right: LocalDateParts) {
  return left.year === right.year && left.month === right.month;
}

function percent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}

export function breakEvenRevenueMinor(settings: CreatorBusinessControlSettings) {
  const fixed = integer(settings.monthlyFixedCostsMinor, "fixed_costs");
  const variableRate = integer(settings.variableCostRateBps, "variable_cost_rate_bps");
  if (variableRate >= 10_000) throw new Error("variable_cost_rate_bps_must_be_below_10000");
  const contributionMarginBps = 10_000 - variableRate;
  if (fixed === 0) return 0;
  return Math.ceil((fixed * 10_000) / contributionMarginBps);
}

export function buildCreatorBusinessControl(
  observations: BusinessRevenueObservation[],
  settings: CreatorBusinessControlSettings,
  asOf = new Date(),
): CreatorBusinessControlSnapshot {
  const currency = settings.currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("currency_invalid");
  const goal = integer(settings.monthlyRevenueGoalMinor, "monthly_goal");
  const fixedCosts = integer(settings.monthlyFixedCostsMinor, "fixed_costs");
  const variableCostRateBps = integer(settings.variableCostRateBps, "variable_cost_rate_bps");
  if (variableCostRateBps >= 10_000) throw new Error("variable_cost_rate_bps_must_be_below_10000");

  // Throws for an invalid IANA timezone before we use any business data.
  const currentLocal = localDateParts(asOf, settings.timeZone);
  const daysInMonth = monthDays(currentLocal.year, currentLocal.month);
  const daysElapsed = Math.min(currentLocal.day, daysInMonth);
  const dailyRevenue = Array.from({ length: daysInMonth }, () => 0);
  const revenueBySource: Partial<Record<CreatorBusinessSource, number>> = {};
  let observationsUsed = 0;

  for (const observation of observations) {
    if (!Number.isFinite(observation.amountMinor) || observation.amountMinor < 0) continue;
    if (observation.currency.trim().toUpperCase() !== currency) continue;
    const occurredAt = new Date(observation.occurredAt);
    if (Number.isNaN(occurredAt.getTime()) || occurredAt.getTime() > asOf.getTime()) continue;
    const local = localDateParts(occurredAt, settings.timeZone);
    if (!sameMonth(local, currentLocal) || local.day > daysElapsed) continue;

    const amount = Math.round(observation.amountMinor);
    dailyRevenue[local.day - 1] += amount;
    revenueBySource[observation.source] = (revenueBySource[observation.source] ?? 0) + amount;
    observationsUsed += 1;
  }

  const actualRevenueMinor = dailyRevenue.slice(0, daysElapsed).reduce((sum, value) => sum + value, 0);
  const monthToDateDailyPace = daysElapsed > 0 ? actualRevenueMinor / daysElapsed : 0;
  const trailingWindowDays = Math.min(7, daysElapsed);
  const trailingStart = Math.max(0, daysElapsed - trailingWindowDays);
  const trailingRevenue = dailyRevenue.slice(trailingStart, daysElapsed).reduce((sum, value) => sum + value, 0);
  const trailingDailyPace = trailingWindowDays > 0 ? trailingRevenue / trailingWindowDays : 0;
  const remainingDays = Math.max(0, daysInMonth - daysElapsed);

  const monthToDateProjection = Math.round(actualRevenueMinor + remainingDays * monthToDateDailyPace);
  const trailingProjection = Math.round(actualRevenueMinor + remainingDays * trailingDailyPace);
  const forecastBaseMinor = monthToDateProjection;
  const forecastLowMinor = daysElapsed < 3 ? forecastBaseMinor : Math.min(monthToDateProjection, trailingProjection);
  const forecastHighMinor = daysElapsed < 3 ? forecastBaseMinor : Math.max(monthToDateProjection, trailingProjection);
  const confidence: ForecastConfidence = daysElapsed >= 7 && observationsUsed >= 3 ? "medium" : "low";

  const forecastGapMinor = Math.max(0, goal - forecastBaseMinor);
  const forecastSurplusMinor = Math.max(0, forecastBaseMinor - goal);
  const goalAttainmentActual = percent(actualRevenueMinor, goal);
  const goalAttainmentForecast = percent(forecastBaseMinor, goal);

  let status: BusinessControlStatus = "NO_GOAL";
  if (goal > 0) {
    if (forecastBaseMinor >= goal) status = "ON_TRACK";
    else if (forecastBaseMinor >= goal * 0.9) status = "AT_RISK";
    else status = "OFF_TRACK";
  }

  const contributionMarginBps = 10_000 - variableCostRateBps;
  const breakEven = breakEvenRevenueMinor(settings);
  const expectedOperatingResultMinor = Math.round((forecastBaseMinor * contributionMarginBps) / 10_000 - fixedCosts);

  return {
    period: `${currentLocal.year}-${String(currentLocal.month).padStart(2, "0")}`,
    currency,
    model: "RUN_RATE_WITH_TRAILING_7D_V1",
    confidence,
    actualRevenueMinor,
    monthlyGoalMinor: goal,
    forecastBaseMinor,
    forecastLowMinor,
    forecastHighMinor,
    forecastGapMinor,
    forecastSurplusMinor,
    goalAttainmentActual,
    goalAttainmentForecast,
    status,
    contributionMarginBps,
    breakEvenRevenueMinor: breakEven,
    breakEvenReached: actualRevenueMinor >= breakEven,
    expectedOperatingResultMinor,
    daysElapsed,
    daysInMonth,
    observationsUsed,
    revenueBySource,
  };
}
