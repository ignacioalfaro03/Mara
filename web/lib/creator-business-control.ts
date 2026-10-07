export type CreatorBusinessSource =
  | "MARA"
  | "ONLYFANS"
  | "ARSMATE"
  | "INSTAGRAM"
  | "TIKTOK"
  | "X"
  | "OTHER";

export type BusinessProvenanceType =
  | "MARA_NATIVE"
  | "OFFICIAL_API"
  | "CSV_IMPORT"
  | "XLSX_IMPORT"
  | "MANUAL_ENTRY"
  | "PARTNER_EXPORT";

export type BusinessRevenueObservation = {
  id: string;
  source: CreatorBusinessSource;
  occurredAt: string;
  amountMinor: number;
  currency: string;
  customerKey?: string | null;
  sourceRecordId?: string | null;
  importedAt?: string | null;
  provenanceType?: BusinessProvenanceType | null;
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
export type BusinessConfidence = "low" | "medium" | "high";
export type CustomerHealthState = "FIRST_TIME" | "HEALTHY" | "WATCH" | "AT_RISK" | "DORMANT" | "REACTIVATED";

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

export type MonthlyRevenueMetrics = {
  period: string;
  currency: string;
  complete: boolean;
  revenueMinor: number;
  transactions: number;
  activeCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  reactivatedCustomers: number;
  newRevenueMinor: number;
  repeatRevenueMinor: number;
  reactivatedRevenueMinor: number;
  averageTransactionMinor: number;
  arpuMinor: number;
  repeatCustomerRate: number;
};

export type RevenueBridge = {
  startPeriod: string;
  endPeriod: string;
  comparisonThroughDay: number | null;
  currency: string;
  startRevenueMinor: number;
  endRevenueMinor: number;
  newRevenueMinor: number;
  reactivatedRevenueMinor: number;
  expansionRevenueMinor: number;
  contractionRevenueMinor: number;
  lostRevenueMinor: number;
  unassignedStartRevenueMinor: number;
  unassignedEndRevenueMinor: number;
  unassignedDeltaMinor: number;
  reconciled: boolean;
};

export type CustomerBusinessHealth = {
  customerKey: string;
  state: CustomerHealthState;
  confidence: BusinessConfidence;
  purchaseCount: number;
  lifetimeRevenueMinor: number;
  averageTransactionMinor: number;
  lastPurchaseAt: string;
  daysSinceLastPurchase: number;
  expectedCadenceDays: number | null;
  revenueAtRiskMinor: number;
  reason: string;
};

export type RevenueRiskSnapshot = {
  currency: string;
  revenueAtRiskMinor: number;
  confidence: BusinessConfidence;
  watchCustomers: number;
  atRiskCustomers: number;
  dormantCustomers: number;
  firstTimeCustomers: number;
  customers: CustomerBusinessHealth[];
  fallbackCadenceDays: number;
  fallbackDerivedFromHistory: boolean;
  method: "ONE_AVERAGE_PURCHASE_OUTSIDE_EXPECTED_CADENCE_V1";
};

export type RevenueConcentration = {
  currency: string;
  totalRevenueMinor: number;
  knownCustomerRevenueMinor: number;
  unknownCustomerRevenueMinor: number;
  top1Share: number;
  top3Share: number;
  top5Share: number;
};

export type BusinessDriver = {
  key: "NEW" | "REACTIVATION" | "EXPANSION" | "CONTRACTION" | "LOST" | "RISK" | "CONCENTRATION";
  direction: "positive" | "negative" | "risk";
  amountMinor?: number;
  text: string;
};

export type ExistingBusinessAction = {
  customerKey: string;
  action: string;
  reason: string;
  priority: "high" | "medium" | "low" | string;
};

export type BusinessMainAction = {
  action: string;
  title: string;
  reason: string;
  customerKey: string | null;
  economicContextMinor: number;
  confidence: BusinessConfidence;
  source: "CREATOR_OS_NEXT_BEST_ACTION" | "BUSINESS_CONTROL";
};

export type CreatorBusinessHealthSnapshot = {
  period: string;
  currency: string;
  confidence: BusinessConfidence;
  control: CreatorBusinessControlSnapshot;
  ramp: MonthlyRevenueMetrics[];
  bridge: RevenueBridge | null;
  risk: RevenueRiskSnapshot;
  concentration: RevenueConcentration;
  newRevenueMinor: number;
  repeatRevenueMinor: number;
  reactivatedRevenueMinor: number;
  lostRevenueMinor: number;
  activeCustomers: number;
  repeatCustomers: number;
  atRiskCustomers: number;
  dormantCustomers: number;
  drivers: BusinessDriver[];
  mainAction: BusinessMainAction;
  dataCoverageDays: number;
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

function periodKey(parts: Pick<LocalDateParts, "year" | "month">) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}`;
}

function parsePeriod(period: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(period);
  if (!match) throw new Error("period_invalid");
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new Error("period_invalid");
  return { year, month };
}

function shiftMonth(parts: Pick<LocalDateParts, "year" | "month">, offset: number) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1 + offset, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

function sameMonth(left: LocalDateParts, right: LocalDateParts) {
  return left.year === right.year && left.month === right.month;
}

function percent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function localDaySerial(value: Date, timeZone: string) {
  const local = localDateParts(value, timeZone);
  return Math.floor(Date.UTC(local.year, local.month - 1, local.day) / 86_400_000);
}

function daysBetweenLocal(left: Date, right: Date, timeZone: string) {
  return Math.max(0, localDaySerial(right, timeZone) - localDaySerial(left, timeZone));
}

function validObservations(
  observations: BusinessRevenueObservation[],
  currency: string,
  timeZone: string,
  asOf: Date,
) {
  const normalizedCurrency = currency.trim().toUpperCase();
  // Validate the timezone even when there are no observations.
  localDateParts(asOf, timeZone);

  return observations
    .map((observation) => ({
      ...observation,
      date: new Date(observation.occurredAt),
      amountMinor: Math.round(observation.amountMinor),
      normalizedCurrency: observation.currency.trim().toUpperCase(),
    }))
    .filter((observation) =>
      Number.isFinite(observation.amountMinor) &&
      observation.amountMinor >= 0 &&
      observation.normalizedCurrency === normalizedCurrency &&
      !Number.isNaN(observation.date.getTime()) &&
      observation.date.getTime() <= asOf.getTime(),
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function customerHistory(
  observations: ReturnType<typeof validObservations>,
  timeZone: string,
) {
  const histories = new Map<string, typeof observations>();
  for (const observation of observations) {
    if (!observation.customerKey) continue;
    const existing = histories.get(observation.customerKey) ?? [];
    existing.push(observation);
    histories.set(observation.customerKey, existing);
  }

  for (const history of histories.values()) {
    history.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  return histories;
}

function firstPurchasePeriodByCustomer(
  histories: Map<string, ReturnType<typeof validObservations>>,
  timeZone: string,
) {
  const result = new Map<string, string>();
  for (const [customerKey, history] of histories) {
    const first = history[0];
    if (!first) continue;
    result.set(customerKey, periodKey(localDateParts(first.date, timeZone)));
  }
  return result;
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

  const currentLocal = localDateParts(asOf, settings.timeZone);
  const daysInMonth = monthDays(currentLocal.year, currentLocal.month);
  const daysElapsed = Math.min(currentLocal.day, daysInMonth);
  const dailyRevenue = Array.from({ length: daysInMonth }, () => 0);
  const revenueBySource: Partial<Record<CreatorBusinessSource, number>> = {};
  let observationsUsed = 0;

  for (const observation of validObservations(observations, currency, settings.timeZone, asOf)) {
    const local = localDateParts(observation.date, settings.timeZone);
    if (!sameMonth(local, currentLocal) || local.day > daysElapsed) continue;
    dailyRevenue[local.day - 1] += observation.amountMinor;
    revenueBySource[observation.source] = (revenueBySource[observation.source] ?? 0) + observation.amountMinor;
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
    period: periodKey(currentLocal),
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

export function buildMonthlyRevenueRamp(
  observations: BusinessRevenueObservation[],
  currency: string,
  timeZone: string,
  asOf = new Date(),
  months = 6,
): MonthlyRevenueMetrics[] {
  if (!Number.isInteger(months) || months < 1 || months > 24) throw new Error("months_invalid");
  const normalizedCurrency = currency.trim().toUpperCase();
  const valid = validObservations(observations, normalizedCurrency, timeZone, asOf);
  const histories = customerHistory(valid, timeZone);
  const firstPeriods = firstPurchasePeriodByCustomer(histories, timeZone);
  const activePeriodsByCustomer = new Map<string, Set<string>>();

  for (const [customerKey, history] of histories) {
    activePeriodsByCustomer.set(
      customerKey,
      new Set(history.map((item) => periodKey(localDateParts(item.date, timeZone)))),
    );
  }

  const current = localDateParts(asOf, timeZone);
  const metrics: MonthlyRevenueMetrics[] = [];

  for (let offset = -(months - 1); offset <= 0; offset += 1) {
    const target = shiftMonth(current, offset);
    const targetPeriod = periodKey(target);
    const previousPeriod = periodKey(shiftMonth(target, -1));
    const periodObservations = valid.filter((item) => periodKey(localDateParts(item.date, timeZone)) === targetPeriod);
    const revenueMinor = periodObservations.reduce((sum, item) => sum + item.amountMinor, 0);
    const byCustomer = new Map<string, number>();

    for (const item of periodObservations) {
      if (!item.customerKey) continue;
      byCustomer.set(item.customerKey, (byCustomer.get(item.customerKey) ?? 0) + item.amountMinor);
    }

    let newCustomers = 0;
    let repeatCustomers = 0;
    let reactivatedCustomers = 0;
    let newRevenueMinor = 0;
    let repeatRevenueMinor = 0;
    let reactivatedRevenueMinor = 0;

    for (const [customerKey, amount] of byCustomer) {
      const firstPeriod = firstPeriods.get(customerKey);
      const activePeriods = activePeriodsByCustomer.get(customerKey) ?? new Set<string>();
      if (firstPeriod === targetPeriod) {
        newCustomers += 1;
        newRevenueMinor += amount;
        continue;
      }

      repeatCustomers += 1;
      if (activePeriods.has(previousPeriod)) {
        repeatRevenueMinor += amount;
      } else {
        reactivatedCustomers += 1;
        reactivatedRevenueMinor += amount;
      }
    }

    const activeCustomers = byCustomer.size;
    metrics.push({
      period: targetPeriod,
      currency: normalizedCurrency,
      complete: offset < 0,
      revenueMinor,
      transactions: periodObservations.length,
      activeCustomers,
      newCustomers,
      repeatCustomers,
      reactivatedCustomers,
      newRevenueMinor,
      repeatRevenueMinor,
      reactivatedRevenueMinor,
      averageTransactionMinor: periodObservations.length ? Math.round(revenueMinor / periodObservations.length) : 0,
      arpuMinor: activeCustomers ? Math.round(revenueMinor / activeCustomers) : 0,
      repeatCustomerRate: percent(repeatCustomers, activeCustomers),
    });
  }

  return metrics;
}

export function buildRevenueBridge(
  observations: BusinessRevenueObservation[],
  currency: string,
  timeZone: string,
  startPeriod: string,
  endPeriod: string,
  throughDay: number | null = null,
  asOf = new Date(),
): RevenueBridge {
  const normalizedCurrency = currency.trim().toUpperCase();
  parsePeriod(startPeriod);
  parsePeriod(endPeriod);
  if (startPeriod >= endPeriod) throw new Error("bridge_period_order_invalid");
  if (throughDay !== null && (!Number.isInteger(throughDay) || throughDay < 1 || throughDay > 31)) {
    throw new Error("bridge_through_day_invalid");
  }

  const valid = validObservations(observations, normalizedCurrency, timeZone, asOf);
  const histories = customerHistory(valid, timeZone);
  const firstPeriods = firstPurchasePeriodByCustomer(histories, timeZone);

  function customerRevenueFor(period: string) {
    const result = new Map<string, number>();
    let unassignedMinor = 0;
    for (const item of valid) {
      const local = localDateParts(item.date, timeZone);
      if (periodKey(local) !== period) continue;
      if (throughDay !== null && local.day > throughDay) continue;
      if (!item.customerKey) {
        unassignedMinor += item.amountMinor;
        continue;
      }
      result.set(item.customerKey, (result.get(item.customerKey) ?? 0) + item.amountMinor);
    }
    return { result, unassignedMinor };
  }

  const startData = customerRevenueFor(startPeriod);
  const endData = customerRevenueFor(endPeriod);
  const start = startData.result;
  const end = endData.result;
  const customers = new Set([...start.keys(), ...end.keys()]);

  let newRevenueMinor = 0;
  let reactivatedRevenueMinor = 0;
  let expansionRevenueMinor = 0;
  let contractionRevenueMinor = 0;
  let lostRevenueMinor = 0;

  for (const customerKey of customers) {
    const startRevenue = start.get(customerKey) ?? 0;
    const endRevenue = end.get(customerKey) ?? 0;

    if (startRevenue === 0 && endRevenue > 0) {
      if (firstPeriods.get(customerKey) === endPeriod) newRevenueMinor += endRevenue;
      else reactivatedRevenueMinor += endRevenue;
      continue;
    }

    if (startRevenue > 0 && endRevenue === 0) {
      lostRevenueMinor += startRevenue;
      continue;
    }

    const delta = endRevenue - startRevenue;
    if (delta > 0) expansionRevenueMinor += delta;
    if (delta < 0) contractionRevenueMinor += Math.abs(delta);
  }

  const knownStartRevenueMinor = [...start.values()].reduce((sum, value) => sum + value, 0);
  const knownEndRevenueMinor = [...end.values()].reduce((sum, value) => sum + value, 0);
  const startRevenueMinor = knownStartRevenueMinor + startData.unassignedMinor;
  const endRevenueMinor = knownEndRevenueMinor + endData.unassignedMinor;
  const unassignedDeltaMinor = endData.unassignedMinor - startData.unassignedMinor;
  const reconciledValue =
    startRevenueMinor +
    newRevenueMinor +
    reactivatedRevenueMinor +
    expansionRevenueMinor -
    contractionRevenueMinor -
    lostRevenueMinor +
    unassignedDeltaMinor;

  return {
    startPeriod,
    endPeriod,
    comparisonThroughDay: throughDay,
    currency: normalizedCurrency,
    startRevenueMinor,
    endRevenueMinor,
    newRevenueMinor,
    reactivatedRevenueMinor,
    expansionRevenueMinor,
    contractionRevenueMinor,
    lostRevenueMinor,
    unassignedStartRevenueMinor: startData.unassignedMinor,
    unassignedEndRevenueMinor: endData.unassignedMinor,
    unassignedDeltaMinor,
    reconciled: reconciledValue === endRevenueMinor,
  };
}

function deriveFallbackCadenceDays(
  histories: Map<string, ReturnType<typeof validObservations>>,
  timeZone: string,
) {
  const intervals: number[] = [];
  for (const history of histories.values()) {
    for (let index = 1; index < history.length; index += 1) {
      const interval = daysBetweenLocal(history[index - 1].date, history[index].date, timeZone);
      if (interval > 0 && interval <= 365) intervals.push(interval);
    }
  }

  if (intervals.length >= 3) {
    return {
      days: Math.max(7, Math.min(90, Math.round(median(intervals)))),
      derived: true,
    };
  }

  return { days: 30, derived: false };
}

export function buildCustomerHealth(
  observations: BusinessRevenueObservation[],
  currency: string,
  timeZone: string,
  asOf = new Date(),
): RevenueRiskSnapshot {
  const normalizedCurrency = currency.trim().toUpperCase();
  const valid = validObservations(observations, normalizedCurrency, timeZone, asOf);
  const histories = customerHistory(valid, timeZone);
  const fallback = deriveFallbackCadenceDays(histories, timeZone);
  const customers: CustomerBusinessHealth[] = [];

  for (const [customerKey, history] of histories) {
    const purchaseCount = history.length;
    const lifetimeRevenueMinor = history.reduce((sum, item) => sum + item.amountMinor, 0);
    const averageTransactionMinor = purchaseCount ? Math.round(lifetimeRevenueMinor / purchaseCount) : 0;
    const last = history[history.length - 1];
    if (!last) continue;
    const daysSinceLastPurchase = daysBetweenLocal(last.date, asOf, timeZone);

    if (purchaseCount === 1) {
      customers.push({
        customerKey,
        state: "FIRST_TIME",
        confidence: "low",
        purchaseCount,
        lifetimeRevenueMinor,
        averageTransactionMinor,
        lastPurchaseAt: last.occurredAt,
        daysSinceLastPurchase,
        expectedCadenceDays: null,
        revenueAtRiskMinor: 0,
        reason: "Solo existe una compra. No hay cadencia individual suficiente para inferir riesgo de recompra.",
      });
      continue;
    }

    const intervals: number[] = [];
    for (let index = 1; index < history.length; index += 1) {
      const interval = daysBetweenLocal(history[index - 1].date, history[index].date, timeZone);
      if (interval > 0) intervals.push(interval);
    }

    const baselineIntervals = intervals.length >= 2 ? intervals.slice(0, -1) : intervals;
    const cadenceDays = baselineIntervals.length ? Math.max(1, Math.round(median(baselineIntervals))) : fallback.days;
    const confidence: BusinessConfidence =
      baselineIntervals.length >= 4 ? "high" :
      baselineIntervals.length >= 2 ? "medium" :
      "low";
    const ratio = daysSinceLastPurchase / cadenceDays;
    const lastObservedInterval = intervals[intervals.length - 1] ?? null;
    const recentlyReturned = daysSinceLastPurchase <= Math.max(3, cadenceDays * 0.5);
    const reactivated = lastObservedInterval !== null && lastObservedInterval > cadenceDays * 2.5 && recentlyReturned;

    let state: CustomerHealthState;
    if (reactivated) state = "REACTIVATED";
    else if (ratio <= 1.25) state = "HEALTHY";
    else if (ratio <= 1.75) state = "WATCH";
    else if (ratio <= 2.5) state = "AT_RISK";
    else state = "DORMANT";

    const revenueAtRiskMinor = state === "AT_RISK" || state === "DORMANT" ? averageTransactionMinor : 0;
    const reason =
      state === "REACTIVATED"
        ? `Volvió después de una pausa de ${lastObservedInterval} días; su cadencia histórica estimada es ${cadenceDays} días.`
        : `Han pasado ${daysSinceLastPurchase} días desde la última compra versus una cadencia histórica estimada de ${cadenceDays} días.`;

    customers.push({
      customerKey,
      state,
      confidence,
      purchaseCount,
      lifetimeRevenueMinor,
      averageTransactionMinor,
      lastPurchaseAt: last.occurredAt,
      daysSinceLastPurchase,
      expectedCadenceDays: cadenceDays,
      revenueAtRiskMinor,
      reason,
    });
  }

  customers.sort((a, b) =>
    b.revenueAtRiskMinor - a.revenueAtRiskMinor ||
    b.lifetimeRevenueMinor - a.lifetimeRevenueMinor,
  );

  const riskCustomers = customers.filter((customer) => customer.revenueAtRiskMinor > 0);
  const riskConfidence: BusinessConfidence =
    riskCustomers.length === 0 ? "low" :
    riskCustomers.every((customer) => customer.confidence !== "low") ? "medium" :
    "low";

  return {
    currency: normalizedCurrency,
    revenueAtRiskMinor: riskCustomers.reduce((sum, customer) => sum + customer.revenueAtRiskMinor, 0),
    confidence: riskConfidence,
    watchCustomers: customers.filter((customer) => customer.state === "WATCH").length,
    atRiskCustomers: customers.filter((customer) => customer.state === "AT_RISK").length,
    dormantCustomers: customers.filter((customer) => customer.state === "DORMANT").length,
    firstTimeCustomers: customers.filter((customer) => customer.state === "FIRST_TIME").length,
    customers,
    fallbackCadenceDays: fallback.days,
    fallbackDerivedFromHistory: fallback.derived,
    method: "ONE_AVERAGE_PURCHASE_OUTSIDE_EXPECTED_CADENCE_V1",
  };
}

export function buildRevenueConcentration(
  observations: BusinessRevenueObservation[],
  currency: string,
  timeZone: string,
  asOf = new Date(),
): RevenueConcentration {
  const normalizedCurrency = currency.trim().toUpperCase();
  const currentPeriod = periodKey(localDateParts(asOf, timeZone));
  const valid = validObservations(observations, normalizedCurrency, timeZone, asOf)
    .filter((item) => periodKey(localDateParts(item.date, timeZone)) === currentPeriod);
  const totalRevenueMinor = valid.reduce((sum, item) => sum + item.amountMinor, 0);
  const byCustomer = new Map<string, number>();
  let unknownCustomerRevenueMinor = 0;

  for (const item of valid) {
    if (!item.customerKey) {
      unknownCustomerRevenueMinor += item.amountMinor;
      continue;
    }
    byCustomer.set(item.customerKey, (byCustomer.get(item.customerKey) ?? 0) + item.amountMinor);
  }

  const customerAmounts = [...byCustomer.values()].sort((a, b) => b - a);
  const share = (count: number) => percent(customerAmounts.slice(0, count).reduce((sum, value) => sum + value, 0), totalRevenueMinor);

  return {
    currency: normalizedCurrency,
    totalRevenueMinor,
    knownCustomerRevenueMinor: totalRevenueMinor - unknownCustomerRevenueMinor,
    unknownCustomerRevenueMinor,
    top1Share: share(1),
    top3Share: share(3),
    top5Share: share(5),
  };
}

function buildDrivers(
  bridge: RevenueBridge | null,
  risk: RevenueRiskSnapshot,
  concentration: RevenueConcentration,
): BusinessDriver[] {
  const drivers: BusinessDriver[] = [];
  if (bridge) {
    if (bridge.newRevenueMinor > 0) {
      drivers.push({ key: "NEW", direction: "positive", amountMinor: bridge.newRevenueMinor, text: "Ingreso de clientes nuevos en la ventana comparable." });
    }
    if (bridge.reactivatedRevenueMinor > 0) {
      drivers.push({ key: "REACTIVATION", direction: "positive", amountMinor: bridge.reactivatedRevenueMinor, text: "Ingreso recuperado de clientes que no estuvieron activos el mes anterior." });
    }
    if (bridge.expansionRevenueMinor > 0) {
      drivers.push({ key: "EXPANSION", direction: "positive", amountMinor: bridge.expansionRevenueMinor, text: "Clientes activos en ambos periodos gastaron más." });
    }
    if (bridge.contractionRevenueMinor > 0) {
      drivers.push({ key: "CONTRACTION", direction: "negative", amountMinor: bridge.contractionRevenueMinor, text: "Clientes activos en ambos periodos gastaron menos." });
    }
    if (bridge.lostRevenueMinor > 0) {
      drivers.push({ key: "LOST", direction: "negative", amountMinor: bridge.lostRevenueMinor, text: "Ingreso del periodo anterior no reapareció en la ventana comparable." });
    }
  }

  if (risk.revenueAtRiskMinor > 0) {
    drivers.push({ key: "RISK", direction: "risk", amountMinor: risk.revenueAtRiskMinor, text: "Compradores recurrentes están fuera de su cadencia histórica esperada." });
  }
  if (concentration.top1Share >= 0.4) {
    drivers.push({ key: "CONCENTRATION", direction: "risk", text: "Un solo cliente concentra al menos 40% del revenue actual." });
  }

  return drivers
    .sort((a, b) => (b.amountMinor ?? 0) - (a.amountMinor ?? 0))
    .slice(0, 4);
}

function buildMainAction(
  control: CreatorBusinessControlSnapshot,
  risk: RevenueRiskSnapshot,
  concentration: RevenueConcentration,
  existingActions: ExistingBusinessAction[],
): BusinessMainAction {
  const highestRisk = risk.customers.find((customer) => customer.revenueAtRiskMinor > 0);

  if (highestRisk) {
    const existing = existingActions.find((action) => action.customerKey === highestRisk.customerKey);
    if (existing) {
      const normalized = existing.action.trim().toLowerCase();
      return {
        action: normalized,
        title: normalized === "wait" || normalized === "no_action"
          ? "No fuerces una venta ahora."
          : "Usa la próxima acción de Creator OS.",
        reason: `${existing.reason} Contexto económico: ${highestRisk.reason}`,
        customerKey: highestRisk.customerKey,
        economicContextMinor: highestRisk.revenueAtRiskMinor,
        confidence: highestRisk.confidence,
        source: "CREATOR_OS_NEXT_BEST_ACTION",
      };
    }

    return {
      action: "review_at_risk_customer",
      title: "Revisa al cliente recurrente de mayor riesgo.",
      reason: highestRisk.reason,
      customerKey: highestRisk.customerKey,
      economicContextMinor: highestRisk.revenueAtRiskMinor,
      confidence: highestRisk.confidence,
      source: "BUSINESS_CONTROL",
    };
  }

  if (concentration.top1Share >= 0.4) {
    return {
      action: "review_concentration",
      title: "Reduce la dependencia de un solo cliente.",
      reason: "La concentración actual hace que cumplir la meta dependa demasiado de una sola relación comercial.",
      customerKey: null,
      economicContextMinor: Math.round(concentration.totalRevenueMinor * concentration.top1Share),
      confidence: "high",
      source: "BUSINESS_CONTROL",
    };
  }

  if (control.forecastGapMinor > 0) {
    return {
      action: "review_gap_drivers",
      title: "Ataca la brecha, no el volumen por reflejo.",
      reason: "El forecast está bajo la meta y no existe suficiente revenue-at-risk recuperable para explicar por sí solo la brecha.",
      customerKey: null,
      economicContextMinor: control.forecastGapMinor,
      confidence: control.confidence,
      source: "BUSINESS_CONTROL",
    };
  }

  return {
    action: "no_action",
    title: "No hay una intervención económica urgente.",
    reason: "El forecast no muestra una brecha y no hay revenue-at-risk material bajo las reglas actuales.",
    customerKey: null,
    economicContextMinor: 0,
    confidence: control.confidence,
    source: "BUSINESS_CONTROL",
  };
}

export function buildCreatorBusinessHealth(
  observations: BusinessRevenueObservation[],
  settings: CreatorBusinessControlSettings,
  asOf = new Date(),
  existingActions: ExistingBusinessAction[] = [],
): CreatorBusinessHealthSnapshot {
  const control = buildCreatorBusinessControl(observations, settings, asOf);
  const ramp = buildMonthlyRevenueRamp(observations, control.currency, settings.timeZone, asOf, 6);
  const currentParts = localDateParts(asOf, settings.timeZone);
  const currentPeriod = periodKey(currentParts);
  const previousPeriod = periodKey(shiftMonth(currentParts, -1));
  const bridge = buildRevenueBridge(
    observations,
    control.currency,
    settings.timeZone,
    previousPeriod,
    currentPeriod,
    currentParts.day,
    asOf,
  );

  if (!bridge.reconciled) throw new Error("revenue_bridge_not_reconciled");

  const risk = buildCustomerHealth(observations, control.currency, settings.timeZone, asOf);
  const concentration = buildRevenueConcentration(observations, control.currency, settings.timeZone, asOf);
  const current = ramp.find((item) => item.period === currentPeriod) ?? null;
  const valid = validObservations(observations, control.currency, settings.timeZone, asOf);
  const coverageDays = valid.length > 1
    ? daysBetweenLocal(valid[0].date, valid[valid.length - 1].date, settings.timeZone) + 1
    : valid.length;
  const confidence: BusinessConfidence =
    coverageDays >= 90 && valid.length >= 12 ? "high" :
    coverageDays >= 30 && valid.length >= 6 ? "medium" :
    "low";

  return {
    period: currentPeriod,
    currency: control.currency,
    confidence,
    control,
    ramp,
    bridge,
    risk,
    concentration,
    newRevenueMinor: current?.newRevenueMinor ?? 0,
    repeatRevenueMinor: current?.repeatRevenueMinor ?? 0,
    reactivatedRevenueMinor: current?.reactivatedRevenueMinor ?? 0,
    lostRevenueMinor: bridge.lostRevenueMinor,
    activeCustomers: current?.activeCustomers ?? 0,
    repeatCustomers: current?.repeatCustomers ?? 0,
    atRiskCustomers: risk.atRiskCustomers,
    dormantCustomers: risk.dormantCustomers,
    drivers: buildDrivers(bridge, risk, concentration),
    mainAction: buildMainAction(control, risk, concentration, existingActions),
    dataCoverageDays: coverageDays,
  };
}
