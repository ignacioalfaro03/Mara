import type { ProviderPaymentSnapshot } from "@/lib/commerce/payment-provider-contract";

export type CheckoutPaymentExpectation = {
  checkoutIntentId: string;
  creatorId: string;
  provider: string;
  providerAccountId: string;
  amountMinor: number;
  currency: string;
};

export type PaymentAcceptanceIssueCode =
  | "EXTERNAL_REFERENCE_MISMATCH"
  | "PROVIDER_ACCOUNT_MISMATCH"
  | "AMOUNT_MISMATCH"
  | "CURRENCY_MISMATCH"
  | "UNEXPECTED_REFUND_STATE";

export type PaymentAcceptanceIssue = {
  code: PaymentAcceptanceIssueCode;
  expected: string | number | null;
  observed: string | number | null;
};

export type PaymentAcceptanceDisposition =
  | "materialize_succeeded"
  | "record_pending"
  | "record_failed"
  | "hold";

export type PaymentAcceptanceDecision = {
  checkoutIntentId: string;
  providerPaymentId: string;
  disposition: PaymentAcceptanceDisposition;
  issues: PaymentAcceptanceIssue[];
};

function issue(
  code: PaymentAcceptanceIssueCode,
  expected: string | number | null,
  observed: string | number | null,
): PaymentAcceptanceIssue {
  return { code, expected, observed };
}

/**
 * Gate between an authenticated provider snapshot and Mara financial materialization.
 *
 * This function intentionally does not write a purchase/payment/ledger row. It only
 * decides whether the provider evidence is consistent with the server-authoritative
 * checkout snapshot. Any critical mismatch produces a hold.
 */
export function decideProviderPaymentAcceptance(
  expected: CheckoutPaymentExpectation,
  provider: ProviderPaymentSnapshot,
): PaymentAcceptanceDecision {
  const issues: PaymentAcceptanceIssue[] = [];

  if (provider.providerExternalReference !== expected.checkoutIntentId) {
    issues.push(issue("EXTERNAL_REFERENCE_MISMATCH", expected.checkoutIntentId, provider.providerExternalReference));
  }
  if (provider.providerAccountId !== expected.providerAccountId) {
    issues.push(issue("PROVIDER_ACCOUNT_MISMATCH", expected.providerAccountId, provider.providerAccountId));
  }
  if (provider.amountMinor !== expected.amountMinor) {
    issues.push(issue("AMOUNT_MISMATCH", expected.amountMinor, provider.amountMinor));
  }
  if (provider.currency !== expected.currency) {
    issues.push(issue("CURRENCY_MISMATCH", expected.currency, provider.currency));
  }

  // A refund/chargeback arriving before the initial payment has been materialized is
  // operationally exceptional. Never synthesize a purchase from such a snapshot.
  if (
    provider.status === "partially_refunded" ||
    provider.status === "refunded" ||
    provider.status === "chargeback" ||
    provider.refundedAmountMinor > 0
  ) {
    issues.push(issue("UNEXPECTED_REFUND_STATE", 0, provider.refundedAmountMinor));
  }

  let disposition: PaymentAcceptanceDisposition;
  if (issues.length > 0) disposition = "hold";
  else if (provider.status === "succeeded") disposition = "materialize_succeeded";
  else if (provider.status === "pending" || provider.status === "authorized") disposition = "record_pending";
  else disposition = "record_failed";

  return {
    checkoutIntentId: expected.checkoutIntentId,
    providerPaymentId: provider.providerPaymentId,
    disposition,
    issues,
  };
}
