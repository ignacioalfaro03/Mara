import type { MaraServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders } from "@/lib/commerce/backend";
import type { MercadoPagoSandboxWebhookResult } from "@/lib/commerce/mercado-pago-sandbox-webhook";

export type MercadoPagoSandboxMaterializationPolicy =
  | { enabled: false; reason: "production_blocked" | "materialization_disabled" }
  | { enabled: true; processorFeeBearer: "creator" };

export function getMercadoPagoSandboxMaterializationPolicy(): MercadoPagoSandboxMaterializationPolicy {
  if (process.env.VERCEL_ENV === "production") {
    return { enabled: false, reason: "production_blocked" };
  }
  if (process.env.MARA_MP_SANDBOX_MATERIALIZATION_ENABLED !== "true") {
    return { enabled: false, reason: "materialization_disabled" };
  }

  // Mercado Pago Split Payments 1:1 deducts the Mercado Pago processing fee from
  // the seller before deducting the marketplace fee. For Mara's creator/seller
  // model this means the processor fee bearer is provider-defined as the creator.
  return { enabled: true, processorFeeBearer: "creator" };
}

async function materializeCaptureRpc(input: {
  backend: MaraServerBackendConfig;
  checkoutIntentId: string;
  providerPaymentId: string;
  providerAccountId: string;
  amountMinor: number;
  currency: string;
  processorFeeMinor: number;
  processorFeeBearer: "creator";
  providerEventId: string;
}) {
  const response = await fetch(`${input.backend.url}/rest/v1/rpc/materialize_mara_payment_capture_v1`, {
    method: "POST",
    headers: serviceHeaders(input.backend),
    body: JSON.stringify({
      p_checkout_intent_id: input.checkoutIntentId,
      p_provider: "mercado_pago_sandbox",
      p_provider_payment_id: input.providerPaymentId,
      p_provider_account_id: input.providerAccountId,
      p_amount_minor: input.amountMinor,
      p_currency: input.currency,
      p_processor_fee_minor: input.processorFeeMinor,
      p_processor_fee_bearer: input.processorFeeBearer,
      p_provider_event_id: input.providerEventId,
    }),
    cache: "no-store",
    redirect: "error",
  });

  if (!response.ok) {
    throw new Error(`mara_mp_sandbox_materialization_failed:${response.status}`);
  }

  const paymentId = await response.json() as unknown;
  if (typeof paymentId !== "string" || paymentId.length < 32) {
    throw new Error("mara_mp_sandbox_materialization_payment_id_invalid");
  }
  return paymentId;
}

export async function materializeAcceptedMercadoPagoSandboxPayment(input: {
  backend: MaraServerBackendConfig;
  webhookResult: Extract<MercadoPagoSandboxWebhookResult, { ok: true }>;
  providerEventId: string | null;
  policy: Extract<MercadoPagoSandboxMaterializationPolicy, { enabled: true }>;
}) {
  if (input.webhookResult.disposition !== "materialize_succeeded") {
    return { materialized: false as const, reason: "disposition_not_materializable" as const };
  }
  if (!input.webhookResult.checkoutIntentId || !input.webhookResult.providerPaymentId) {
    return { materialized: false as const, reason: "payment_identity_missing" as const };
  }
  const provider = input.webhookResult.providerSnapshot;
  if (!provider || provider.status !== "succeeded") {
    return { materialized: false as const, reason: "provider_snapshot_not_succeeded" as const };
  }
  if (!input.providerEventId?.trim()) {
    return { materialized: false as const, reason: "provider_event_id_missing" as const };
  }
  if (!Number.isSafeInteger(provider.processorFeeMinor) || Number(provider.processorFeeMinor) < 0) {
    return { materialized: false as const, reason: "processor_fee_truth_missing" as const };
  }

  const paymentId = await materializeCaptureRpc({
    backend: input.backend,
    checkoutIntentId: input.webhookResult.checkoutIntentId,
    providerPaymentId: input.webhookResult.providerPaymentId,
    providerAccountId: provider.providerAccountId,
    amountMinor: provider.amountMinor,
    currency: provider.currency,
    processorFeeMinor: Number(provider.processorFeeMinor),
    processorFeeBearer: input.policy.processorFeeBearer,
    providerEventId: input.providerEventId.trim(),
  });

  return { materialized: true as const, paymentId };
}
