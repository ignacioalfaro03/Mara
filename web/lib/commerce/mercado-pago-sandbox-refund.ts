import type { MaraServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders } from "@/lib/commerce/backend";
import { refundMercadoPagoSandboxPayment } from "@/lib/commerce/mercado-pago-sandbox-client";
import type { MercadoPagoSandboxExecutionRuntime } from "@/lib/commerce/mercado-pago-sandbox-runtime";

export type MercadoPagoSandboxRefundPolicy =
  | { enabled: false; reason: "production_blocked" | "refunds_disabled" }
  | { enabled: true };

export function getMercadoPagoSandboxRefundPolicy(): MercadoPagoSandboxRefundPolicy {
  if (process.env.VERCEL_ENV === "production") {
    return { enabled: false, reason: "production_blocked" };
  }
  if (process.env.MARA_MP_SANDBOX_REFUNDS_ENABLED !== "true") {
    return { enabled: false, reason: "refunds_disabled" };
  }
  return { enabled: true };
}

type RefundContextRow = {
  payment_id: string;
  creator_id: string;
  provider_payment_id: string;
  provider_account_id: string;
  credential_reference: string;
  amount_minor: number;
  refunded_amount_minor: number;
  currency: string;
};

async function rpc<T>(backend: MaraServerBackendConfig, functionName: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${backend.url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: serviceHeaders(backend),
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "error",
  });
  if (!response.ok) throw new Error(`mara_mp_sandbox_refund_rpc_failed:${functionName}:${response.status}`);
  return await response.json() as T;
}

export async function executeMercadoPagoSandboxRefund(input: {
  backend: MaraServerBackendConfig;
  runtime: Extract<MercadoPagoSandboxExecutionRuntime, { configured: true }>;
  policy: Extract<MercadoPagoSandboxRefundPolicy, { enabled: true }>;
  paymentId: string;
  amountMinor: number | null;
  idempotencyKey: string;
}) {
  const paymentId = input.paymentId.trim();
  const idempotencyKey = input.idempotencyKey.trim();
  if (!paymentId) throw new Error("mara_mp_sandbox_refund_payment_id_required");
  if (idempotencyKey.length < 8 || idempotencyKey.length > 255) {
    throw new Error("mara_mp_sandbox_refund_idempotency_key_invalid");
  }
  if (input.amountMinor !== null && (!Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0)) {
    throw new Error("mara_mp_sandbox_refund_amount_invalid");
  }

  const rows = await rpc<RefundContextRow[]>(input.backend, "mara_mp_sandbox_refund_context_v1", {
    p_payment_id: paymentId,
  });
  const context = rows[0];
  if (!context) throw new Error("mara_mp_sandbox_refund_context_not_found");

  const remainingMinor = Number(context.amount_minor) - Number(context.refunded_amount_minor);
  if (!Number.isSafeInteger(remainingMinor) || remainingMinor <= 0) {
    throw new Error("mara_mp_sandbox_refund_nothing_remaining");
  }
  if (input.amountMinor !== null && input.amountMinor > remainingMinor) {
    throw new Error("mara_mp_sandbox_refund_exceeds_remaining");
  }

  const providerRefund = await refundMercadoPagoSandboxPayment({
    providerPaymentId: context.provider_payment_id,
    providerAccountId: context.provider_account_id,
    credentialReference: context.credential_reference,
    amountMinor: input.amountMinor,
    currency: context.currency,
    idempotencyKey,
  }, input.runtime.transport, input.runtime.vault);

  if (providerRefund.status !== "succeeded") {
    return {
      providerRefundId: providerRefund.providerRefundId,
      providerStatus: providerRefund.status,
      materialized: false as const,
      reason: "provider_refund_not_succeeded" as const,
    };
  }

  if (providerRefund.amountMinor > remainingMinor) {
    throw new Error("mara_mp_sandbox_provider_refund_exceeds_remaining");
  }

  const refundId = await rpc<unknown>(input.backend, "materialize_mara_payment_refund_v1", {
    p_payment_id: paymentId,
    p_provider_refund_id: providerRefund.providerRefundId,
    p_refund_amount_minor: providerRefund.amountMinor,
    p_provider_created_at: providerRefund.providerCreatedAt,
    p_provider_event_id: `refund_api:${providerRefund.providerRefundId}`,
  });

  if (typeof refundId !== "string" || refundId.length < 32) {
    throw new Error("mara_mp_sandbox_refund_materialization_invalid");
  }

  return {
    providerRefundId: providerRefund.providerRefundId,
    providerStatus: providerRefund.status,
    materialized: true as const,
    refundId,
  };
}
