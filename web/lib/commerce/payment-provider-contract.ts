// MARA Revenue OS — payment provider domain contract.
//
// This module is deliberately provider-neutral and NON-EXECUTABLE. It contains
// no network calls, credentials, token persistence or runtime provider enablement.
// `lib/commerce/config.ts` remains the activation authority and currently permits
// only the signed-test payment runtime.

export type CurrencyCode = string;
export type MinorUnits = number;

export type ProviderSellerStatus = "pending" | "restricted" | "active" | "disabled";
export type ProviderPaymentStatus =
  | "pending"
  | "authorized"
  | "succeeded"
  | "failed"
  | "partially_refunded"
  | "refunded"
  | "chargeback";
export type ProviderRefundStatus = "pending" | "succeeded" | "failed" | "canceled";

export type SellerAuthorizationInput = {
  creatorId: string;
  callbackUrl: string;
  state: string;
  pkceChallenge: string;
};

export type SellerAuthorizationResult = {
  authorizationUrl: string;
  state: string;
};

export type AuthorizationCodeInput = {
  creatorId: string;
  authorizationCode: string;
  callbackUrl: string;
  state: string;
  pkceVerifier: string;
};

/**
 * The adapter may receive raw provider tokens while executing server-side, but
 * domain callers receive only an opaque credential reference after secure
 * persistence. Tokens must never be serialized into browser responses or
 * creator_payment_accounts.metadata.
 */
export type ProviderAccountCredentialResult = {
  providerAccountId: string;
  credentialReference: string;
  status: ProviderSellerStatus;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};

export type RefreshCredentialInput = {
  creatorId: string;
  providerAccountId: string;
  credentialReference: string;
};

export type CreateCheckoutInput = {
  checkoutIntentId: string;
  creatorId: string;
  userId: string;
  offerId: string;
  providerAccountId: string;
  amountMinor: MinorUnits;
  currency: CurrencyCode;
  platformFeeMinor: MinorUnits;
  successUrl: string;
  pendingUrl: string;
  failureUrl: string;
};

export type CreateCheckoutResult = {
  providerCheckoutId: string;
  checkoutUrl: string;
  providerExternalReference: string;
};

export type VerifyWebhookInput = {
  rawBody: string;
  headers: Readonly<Record<string, string | null>>;
  query: Readonly<Record<string, string | null>>;
};

export type VerifiedProviderEvent = {
  providerEventId: string;
  eventType: string;
  providerPaymentId: string | null;
  authentic: true;
};

export type FetchPaymentInput = {
  providerPaymentId: string;
  providerAccountId: string;
  credentialReference: string;
};

export type ProviderPaymentSnapshot = {
  providerPaymentId: string;
  providerAccountId: string;
  providerExternalReference: string | null;
  amountMinor: MinorUnits;
  refundedAmountMinor: MinorUnits;
  currency: CurrencyCode;
  status: ProviderPaymentStatus;
  processorFeeMinor: MinorUnits | null;
  providerCreatedAt: string | null;
  providerUpdatedAt: string | null;
};

export type RefundPaymentInput = {
  paymentId: string;
  providerPaymentId: string;
  providerAccountId: string;
  credentialReference: string;
  amountMinor: MinorUnits;
  currency: CurrencyCode;
  idempotencyKey: string;
};

export type ProviderRefundSnapshot = {
  providerRefundId: string;
  providerPaymentId: string;
  amountMinor: MinorUnits;
  currency: CurrencyCode;
  status: ProviderRefundStatus;
  providerCreatedAt: string | null;
};

export interface CreatorPaymentProvider {
  readonly providerKey: string;

  createSellerAuthorization(input: SellerAuthorizationInput): Promise<SellerAuthorizationResult>;

  exchangeAuthorizationCode(input: AuthorizationCodeInput): Promise<ProviderAccountCredentialResult>;

  refreshSellerCredential(input: RefreshCredentialInput): Promise<ProviderAccountCredentialResult>;

  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;

  verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedProviderEvent>;

  fetchPayment(input: FetchPaymentInput): Promise<ProviderPaymentSnapshot>;

  refundPayment(input: RefundPaymentInput): Promise<ProviderRefundSnapshot>;
}

export function assertPositiveMinorUnits(value: number, field: string): asserts value is MinorUnits {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`invalid_${field}_minor_units`);
  }
}

export function assertPlatformFee(amountMinor: MinorUnits, platformFeeMinor: MinorUnits) {
  if (!Number.isSafeInteger(platformFeeMinor) || platformFeeMinor < 0 || platformFeeMinor > amountMinor) {
    throw new Error("invalid_platform_fee_minor_units");
  }
}
