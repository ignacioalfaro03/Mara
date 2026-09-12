import type { MaraServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders } from "@/lib/commerce/backend";

export type PaymentBackedFulfillmentPolicy =
  | { enabled: false; reason: "production_blocked" | "fulfillment_disabled" }
  | { enabled: true };

export function getPaymentBackedFulfillmentPolicy(): PaymentBackedFulfillmentPolicy {
  if (process.env.VERCEL_ENV === "production") {
    return { enabled: false, reason: "production_blocked" };
  }
  if (process.env.MARA_MP_SANDBOX_FULFILLMENT_ENABLED !== "true") {
    return { enabled: false, reason: "fulfillment_disabled" };
  }
  return { enabled: true };
}

export async function fulfillMaterializedPayment(input: {
  backend: MaraServerBackendConfig;
  paymentId: string;
  policy: Extract<PaymentBackedFulfillmentPolicy, { enabled: true }>;
}) {
  if (!input.paymentId.trim()) {
    throw new Error("mara_payment_backed_fulfillment_payment_id_required");
  }

  const response = await fetch(`${input.backend.url}/rest/v1/rpc/fulfill_mara_materialized_payment_v1`, {
    method: "POST",
    headers: serviceHeaders(input.backend),
    body: JSON.stringify({ p_payment_id: input.paymentId.trim() }),
    cache: "no-store",
    redirect: "error",
  });

  if (!response.ok) {
    throw new Error(`mara_payment_backed_fulfillment_failed:${response.status}`);
  }

  const purchaseId = await response.json() as unknown;
  if (typeof purchaseId !== "string" || purchaseId.length < 32) {
    throw new Error("mara_payment_backed_fulfillment_purchase_id_invalid");
  }

  return { fulfilled: true as const, purchaseId };
}
