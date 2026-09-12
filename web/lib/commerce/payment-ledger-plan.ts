export type ProcessorFeeBearer = "platform" | "creator";
export type LedgerDirection = "debit" | "credit";
export type LedgerAccountCode =
  | "processor_clearing"
  | "creator_payable"
  | "platform_revenue"
  | "processor_fee_expense";

export type PlannedLedgerEntry = {
  accountCode: LedgerAccountCode;
  direction: LedgerDirection;
  amountMinor: number;
  currency: string;
};

export type PlannedLedgerTransaction = {
  transactionType: "payment_capture" | "processor_fee";
  idempotencyKey: string;
  entries: PlannedLedgerEntry[];
};

export type CaptureJournalPlan = {
  grossAmountMinor: number;
  platformFeeMinor: number;
  processorFeeMinor: number;
  processorFeeBearer: ProcessorFeeBearer;
  creatorNetEarningMinor: number;
  transactions: PlannedLedgerTransaction[];
};

function assertMinor(value: number, field: string, allowZero = false) {
  if (!Number.isSafeInteger(value) || value < 0 || (!allowZero && value === 0)) {
    throw new Error(`invalid_${field}_minor_units`);
  }
}

function assertCurrency(value: string) {
  if (!/^[A-Z]{3}$/.test(value)) throw new Error("invalid_currency");
}

export function assertBalancedTransaction(transaction: PlannedLedgerTransaction) {
  const debit = transaction.entries
    .filter((entry) => entry.direction === "debit")
    .reduce((sum, entry) => sum + entry.amountMinor, 0);
  const credit = transaction.entries
    .filter((entry) => entry.direction === "credit")
    .reduce((sum, entry) => sum + entry.amountMinor, 0);
  if (debit !== credit) throw new Error("planned_ledger_transaction_unbalanced");
}

/**
 * Builds the accounting plan for a settled payment without writing any ledger row.
 *
 * The caller must choose explicitly whether the payment processor fee is borne by
 * Mara or by the creator. No hidden default is allowed because that choice changes
 * creator earnings and unit economics.
 */
export function buildCaptureJournalPlan(input: {
  paymentId: string;
  grossAmountMinor: number;
  platformFeeMinor: number;
  processorFeeMinor: number;
  processorFeeBearer: ProcessorFeeBearer;
  currency: string;
}): CaptureJournalPlan {
  if (!input.paymentId.trim()) throw new Error("missing_payment_id");
  assertMinor(input.grossAmountMinor, "gross_amount");
  assertMinor(input.platformFeeMinor, "platform_fee", true);
  assertMinor(input.processorFeeMinor, "processor_fee", true);
  assertCurrency(input.currency);
  if (input.platformFeeMinor > input.grossAmountMinor) throw new Error("platform_fee_exceeds_gross");

  const creatorGrossShareMinor = input.grossAmountMinor - input.platformFeeMinor;
  const creatorNetEarningMinor = creatorGrossShareMinor
    - (input.processorFeeBearer === "creator" ? input.processorFeeMinor : 0);
  if (creatorNetEarningMinor < 0) throw new Error("processor_fee_exceeds_creator_share");

  const captureEntries: PlannedLedgerEntry[] = [
    { accountCode: "processor_clearing", direction: "debit", amountMinor: input.grossAmountMinor, currency: input.currency },
  ];
  if (creatorGrossShareMinor > 0) {
    captureEntries.push({ accountCode: "creator_payable", direction: "credit", amountMinor: creatorGrossShareMinor, currency: input.currency });
  }
  if (input.platformFeeMinor > 0) {
    captureEntries.push({ accountCode: "platform_revenue", direction: "credit", amountMinor: input.platformFeeMinor, currency: input.currency });
  }

  const transactions: PlannedLedgerTransaction[] = [{
    transactionType: "payment_capture",
    idempotencyKey: `payment_capture:${input.paymentId}`,
    entries: captureEntries,
  }];

  if (input.processorFeeMinor > 0) {
    transactions.push({
      transactionType: "processor_fee",
      idempotencyKey: `processor_fee:${input.paymentId}`,
      entries: [
        {
          accountCode: input.processorFeeBearer === "platform" ? "processor_fee_expense" : "creator_payable",
          direction: "debit",
          amountMinor: input.processorFeeMinor,
          currency: input.currency,
        },
        {
          accountCode: "processor_clearing",
          direction: "credit",
          amountMinor: input.processorFeeMinor,
          currency: input.currency,
        },
      ],
    });
  }

  for (const transaction of transactions) assertBalancedTransaction(transaction);

  return {
    grossAmountMinor: input.grossAmountMinor,
    platformFeeMinor: input.platformFeeMinor,
    processorFeeMinor: input.processorFeeMinor,
    processorFeeBearer: input.processorFeeBearer,
    creatorNetEarningMinor,
    transactions,
  };
}
