import type { ProviderPaymentSnapshot, ProviderPaymentStatus } from "@/lib/commerce/payment-provider-contract";

export type ReconciliationSeverity = "critical" | "warning";
export type ReconciliationIssueCode =
  | "PROVIDER_PAYMENT_ID_MISMATCH"
  | "PROVIDER_ACCOUNT_MISMATCH"
  | "EXTERNAL_REFERENCE_MISMATCH"
  | "AMOUNT_MISMATCH"
  | "CURRENCY_MISMATCH"
  | "STATUS_MISMATCH"
  | "REFUNDED_AMOUNT_MISMATCH"
  | "PROCESSOR_FEE_MISMATCH"
  | "PAYMENT_MISSING_IN_MARA"
  | "PAYMENT_MISSING_AT_PROVIDER";

export type MaraPaymentSnapshot = {
  paymentId: string;
  checkoutIntentId: string;
  provider: string;
  providerPaymentId: string;
  providerAccountId: string;
  amountMinor: number;
  refundedAmountMinor: number;
  currency: string;
  status: ProviderPaymentStatus;
  processorFeeMinor: number | null;
};

export type ReconciliationIssue = {
  code: ReconciliationIssueCode;
  severity: ReconciliationSeverity;
  field: string;
  maraValue: string | number | null;
  providerValue: string | number | null;
};

export type PaymentReconciliationResult = {
  paymentId: string;
  providerPaymentId: string;
  matches: boolean;
  issues: ReconciliationIssue[];
};

function issue(
  code: ReconciliationIssueCode,
  severity: ReconciliationSeverity,
  field: string,
  maraValue: string | number | null,
  providerValue: string | number | null,
): ReconciliationIssue {
  return { code, severity, field, maraValue, providerValue };
}

export function reconcilePayment(
  mara: MaraPaymentSnapshot,
  provider: ProviderPaymentSnapshot,
): PaymentReconciliationResult {
  const issues: ReconciliationIssue[] = [];

  if (mara.providerPaymentId !== provider.providerPaymentId) {
    issues.push(issue("PROVIDER_PAYMENT_ID_MISMATCH", "critical", "provider_payment_id", mara.providerPaymentId, provider.providerPaymentId));
  }
  if (mara.providerAccountId !== provider.providerAccountId) {
    issues.push(issue("PROVIDER_ACCOUNT_MISMATCH", "critical", "provider_account_id", mara.providerAccountId, provider.providerAccountId));
  }
  if (provider.providerExternalReference !== mara.checkoutIntentId) {
    issues.push(issue("EXTERNAL_REFERENCE_MISMATCH", "critical", "provider_external_reference", mara.checkoutIntentId, provider.providerExternalReference));
  }
  if (mara.amountMinor !== provider.amountMinor) {
    issues.push(issue("AMOUNT_MISMATCH", "critical", "amount_minor", mara.amountMinor, provider.amountMinor));
  }
  if (mara.currency !== provider.currency) {
    issues.push(issue("CURRENCY_MISMATCH", "critical", "currency", mara.currency, provider.currency));
  }
  if (mara.status !== provider.status) {
    issues.push(issue("STATUS_MISMATCH", "critical", "status", mara.status, provider.status));
  }
  if (mara.refundedAmountMinor !== provider.refundedAmountMinor) {
    issues.push(issue("REFUNDED_AMOUNT_MISMATCH", "critical", "refunded_amount_minor", mara.refundedAmountMinor, provider.refundedAmountMinor));
  }
  if (
    mara.processorFeeMinor !== null &&
    provider.processorFeeMinor !== null &&
    mara.processorFeeMinor !== provider.processorFeeMinor
  ) {
    issues.push(issue("PROCESSOR_FEE_MISMATCH", "warning", "processor_fee_minor", mara.processorFeeMinor, provider.processorFeeMinor));
  }

  return {
    paymentId: mara.paymentId,
    providerPaymentId: mara.providerPaymentId,
    matches: issues.length === 0,
    issues,
  };
}

export function reconcilePaymentInventory(
  maraProviderPaymentIds: readonly string[],
  providerPaymentIds: readonly string[],
) {
  const mara = new Set(maraProviderPaymentIds.filter(Boolean));
  const provider = new Set(providerPaymentIds.filter(Boolean));

  const issues: ReconciliationIssue[] = [];
  for (const providerPaymentId of provider) {
    if (!mara.has(providerPaymentId)) {
      issues.push(issue("PAYMENT_MISSING_IN_MARA", "critical", "provider_payment_id", null, providerPaymentId));
    }
  }
  for (const providerPaymentId of mara) {
    if (!provider.has(providerPaymentId)) {
      issues.push(issue("PAYMENT_MISSING_AT_PROVIDER", "critical", "provider_payment_id", providerPaymentId, null));
    }
  }

  return {
    matches: issues.length === 0,
    issues,
  };
}

export function reconciliationRequiresHold(result: PaymentReconciliationResult) {
  return result.issues.some((item) => item.severity === "critical");
}