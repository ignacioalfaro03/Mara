import {
  buildMercadoPagoTestOAuthExchangeBody,
  buildMercadoPagoTestOAuthRefreshBody,
  buildMercadoPagoTestPreference,
  buildMercadoPagoTestRefundRequest,
  mercadoPagoTestApiEndpoints,
  normalizeMercadoPagoPayment,
} from "@/lib/commerce/mercado-pago-test";
import type {
  CreateCheckoutInput,
  ProviderPaymentSnapshot,
  ProviderRefundSnapshot,
} from "@/lib/commerce/payment-provider-contract";

// SANDBOX-ONLY CLIENT.
// This module is intentionally not wired into PaymentRuntime. It has no fetch,
// env reads or embedded credentials. Every network call and secret operation must
// be explicitly injected by server-side test code.

export type SandboxHttpRequest = {
  method: "GET" | "POST";
  url: string;
  headers?: Record<string, string>;
  body?: string;
};

export type SandboxHttpResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
};

export interface MercadoPagoSandboxTransport {
  request<T>(input: SandboxHttpRequest): Promise<SandboxHttpResponse<T>>;
}

export type MercadoPagoCredentialBundle = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export interface MercadoPagoSandboxCredentialVault {
  putCredential(input: {
    creatorId: string;
    providerAccountId: string;
    credential: MercadoPagoCredentialBundle;
  }): Promise<string>;
  readCredential(reference: string): Promise<MercadoPagoCredentialBundle | null>;
  replaceCredential(reference: string, credential: MercadoPagoCredentialBundle): Promise<string>;
}

type OAuthTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  user_id?: string | number;
  expires_in?: number;
  live_mode?: boolean;
};

type PreferenceResponse = {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
};

type RefundResponse = {
  id?: string | number;
  payment_id?: string | number;
  amount?: number;
  status?: string;
  date_created?: string | null;
};

function assertSandboxCredentialResponse(payload: OAuthTokenResponse) {
  if (!payload.access_token || !payload.refresh_token || payload.user_id === undefined || payload.user_id === null) {
    throw new Error("mercado_pago_sandbox_oauth_response_incomplete");
  }
  if (payload.live_mode === true) throw new Error("mercado_pago_sandbox_returned_live_credential");
  if (!Number.isFinite(payload.expires_in) || Number(payload.expires_in) <= 0) {
    throw new Error("mercado_pago_sandbox_oauth_expiry_invalid");
  }
}

function credentialBundle(payload: OAuthTokenResponse, now: Date): MercadoPagoCredentialBundle {
  assertSandboxCredentialResponse(payload);
  return {
    accessToken: payload.access_token as string,
    refreshToken: payload.refresh_token as string,
    expiresAt: new Date(now.getTime() + Number(payload.expires_in) * 1000).toISOString(),
  };
}

function formBody(values: Record<string, string>) {
  return new URLSearchParams(values).toString();
}

export async function exchangeMercadoPagoSandboxAuthorization(input: {
  creatorId: string;
  clientId: string;
  clientSecret: string;
  authorizationCode: string;
  redirectUri: string;
  state: string;
  pkceVerifier: string;
  now?: Date;
}, transport: MercadoPagoSandboxTransport, vault: MercadoPagoSandboxCredentialVault) {
  const body = buildMercadoPagoTestOAuthExchangeBody({
    clientId: input.clientId,
    clientSecret: input.clientSecret,
    authorizationCode: input.authorizationCode,
    redirectUri: input.redirectUri,
    pkceVerifier: input.pkceVerifier,
  });
  const response = await transport.request<OAuthTokenResponse>({
    method: "POST",
    url: mercadoPagoTestApiEndpoints().oauthToken,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody({ ...body, state: input.state }),
  });
  if (!response.ok) throw new Error(`mercado_pago_sandbox_oauth_exchange_failed:${response.status}`);
  assertSandboxCredentialResponse(response.data);
  const providerAccountId = String(response.data.user_id);
  const credential = credentialBundle(response.data, input.now ?? new Date());
  const credentialReference = await vault.putCredential({ creatorId: input.creatorId, providerAccountId, credential });
  if (!credentialReference || credentialReference.length < 8) throw new Error("mercado_pago_sandbox_credential_reference_invalid");
  return { providerAccountId, credentialReference, expiresAt: credential.expiresAt };
}

export async function refreshMercadoPagoSandboxCredential(input: {
  credentialReference: string;
  clientId: string;
  clientSecret: string;
  now?: Date;
}, transport: MercadoPagoSandboxTransport, vault: MercadoPagoSandboxCredentialVault) {
  const current = await vault.readCredential(input.credentialReference);
  if (!current) throw new Error("mercado_pago_sandbox_credential_not_found");
  const body = buildMercadoPagoTestOAuthRefreshBody({
    clientId: input.clientId,
    clientSecret: input.clientSecret,
    refreshCredential: current.refreshToken,
  });
  const response = await transport.request<OAuthTokenResponse>({
    method: "POST",
    url: mercadoPagoTestApiEndpoints().oauthToken,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody(body),
  });
  if (!response.ok) throw new Error(`mercado_pago_sandbox_oauth_refresh_failed:${response.status}`);
  const credential = credentialBundle(response.data, input.now ?? new Date());
  const credentialReference = await vault.replaceCredential(input.credentialReference, credential);
  return { credentialReference, expiresAt: credential.expiresAt };
}

async function requireCredential(reference: string, vault: MercadoPagoSandboxCredentialVault) {
  const credential = await vault.readCredential(reference);
  if (!credential?.accessToken) throw new Error("mercado_pago_sandbox_credential_not_found");
  return credential;
}

export async function createMercadoPagoSandboxCheckout(input: {
  checkout: CreateCheckoutInput;
  offerTitle: string;
  notificationUrl: string;
  credentialReference: string;
}, transport: MercadoPagoSandboxTransport, vault: MercadoPagoSandboxCredentialVault) {
  const credential = await requireCredential(input.credentialReference, vault);
  const preference = buildMercadoPagoTestPreference(input.checkout, input.offerTitle, input.notificationUrl);
  const response = await transport.request<PreferenceResponse>({
    method: "POST",
    url: mercadoPagoTestApiEndpoints().createPreference,
    headers: {
      Authorization: `Bearer ${credential.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preference),
  });
  if (!response.ok || !response.data.id) throw new Error(`mercado_pago_sandbox_preference_failed:${response.status}`);
  const checkoutUrl = response.data.sandbox_init_point ?? response.data.init_point;
  if (!checkoutUrl) throw new Error("mercado_pago_sandbox_preference_missing_checkout_url");
  return {
    providerCheckoutId: response.data.id,
    checkoutUrl,
    providerExternalReference: input.checkout.checkoutIntentId,
  };
}

export async function fetchMercadoPagoSandboxPayment(input: {
  providerPaymentId: string;
  providerAccountId: string;
  credentialReference: string;
}, transport: MercadoPagoSandboxTransport, vault: MercadoPagoSandboxCredentialVault): Promise<ProviderPaymentSnapshot> {
  const credential = await requireCredential(input.credentialReference, vault);
  const response = await transport.request<Record<string, unknown>>({
    method: "GET",
    url: mercadoPagoTestApiEndpoints().payment(input.providerPaymentId),
    headers: { Authorization: `Bearer ${credential.accessToken}` },
  });
  if (!response.ok) throw new Error(`mercado_pago_sandbox_payment_fetch_failed:${response.status}`);
  return normalizeMercadoPagoPayment(response.data, input.providerAccountId);
}

export async function refundMercadoPagoSandboxPayment(input: {
  providerPaymentId: string;
  providerAccountId: string;
  credentialReference: string;
  amountMinor: number | null;
  currency: string;
  idempotencyKey: string;
}, transport: MercadoPagoSandboxTransport, vault: MercadoPagoSandboxCredentialVault): Promise<ProviderRefundSnapshot> {
  const credential = await requireCredential(input.credentialReference, vault);
  const refund = buildMercadoPagoTestRefundRequest({
    providerPaymentId: input.providerPaymentId,
    amountMinor: input.amountMinor,
    idempotencyKey: input.idempotencyKey,
  });
  const response = await transport.request<RefundResponse>({
    method: refund.method,
    url: refund.url,
    headers: {
      Authorization: `Bearer ${credential.accessToken}`,
      "Content-Type": "application/json",
      ...refund.headers,
    },
    body: JSON.stringify(refund.body),
  });
  if (!response.ok || response.data.id === undefined || response.data.id === null) {
    throw new Error(`mercado_pago_sandbox_refund_failed:${response.status}`);
  }
  const amountMajor = response.data.amount;
  const amountMinor = typeof amountMajor === "number" && Number.isFinite(amountMajor)
    ? Math.round(amountMajor * 100)
    : input.amountMinor ?? 0;
  if (amountMinor <= 0) throw new Error("mercado_pago_sandbox_refund_missing_amount");
  return {
    providerRefundId: String(response.data.id),
    providerPaymentId: String(response.data.payment_id ?? input.providerPaymentId),
    amountMinor,
    currency: input.currency,
    status: response.data.status === "approved" ? "succeeded" : response.data.status === "rejected" ? "failed" : "pending",
    providerCreatedAt: response.data.date_created ?? null,
  };
}