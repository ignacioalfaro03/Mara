import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import {
  getMercadoPagoSandboxMaterializationPolicy,
  materializeAcceptedMercadoPagoSandboxPayment,
} from "@/lib/commerce/mercado-pago-sandbox-materialization";
import { getMercadoPagoSandboxExecutionRuntime } from "@/lib/commerce/mercado-pago-sandbox-runtime";
import { processMercadoPagoSandboxWebhook } from "@/lib/commerce/mercado-pago-sandbox-webhook";
import { createMercadoPagoSandboxWebhookStore } from "@/lib/commerce/mercado-pago-sandbox-webhook-store";
import {
  fulfillMaterializedPayment,
  getPaymentBackedFulfillmentPolicy,
} from "@/lib/commerce/payment-backed-fulfillment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const sandbox = getMercadoPagoSandboxExecutionRuntime();
  if (!sandbox.configured) {
    return NextResponse.json({ error: sandbox.reason }, { status: 404 });
  }

  const backend = getServerBackendConfig();
  if (!backend) {
    return NextResponse.json({ error: "supabase_server_not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const xRequestId = request.headers.get("x-request-id");
  const store = createMercadoPagoSandboxWebhookStore(backend);

  try {
    const result = await processMercadoPagoSandboxWebhook({
      rawBody,
      requestUrl: request.url,
      xSignature: request.headers.get("x-signature"),
      xRequestId,
      webhookSecret: sandbox.webhookSecret,
    }, {
      resolveAccountBinding: store.resolveAccountBinding,
      readCheckoutExpectation: store.readCheckoutExpectation,
      transport: sandbox.transport,
      vault: sandbox.vault,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const materializationPolicy = getMercadoPagoSandboxMaterializationPolicy();
    let materialized = false;
    let paymentId: string | null = null;
    let materializationReason: string | null = materializationPolicy.enabled ? null : materializationPolicy.reason;

    if (materializationPolicy.enabled && result.disposition === "materialize_succeeded") {
      const outcome = await materializeAcceptedMercadoPagoSandboxPayment({
        backend,
        webhookResult: result,
        providerEventId: xRequestId,
        policy: materializationPolicy,
      });
      materialized = outcome.materialized;
      materializationReason = outcome.materialized ? null : outcome.reason;
      paymentId = outcome.materialized ? outcome.paymentId : null;
    }

    const fulfillmentPolicy = getPaymentBackedFulfillmentPolicy();
    let fulfilled = false;
    let fulfillmentReason: string | null = fulfillmentPolicy.enabled ? null : fulfillmentPolicy.reason;

    if (fulfillmentPolicy.enabled) {
      if (!materialized || !paymentId) {
        fulfillmentReason = "materialized_payment_required";
      } else {
        const outcome = await fulfillMaterializedPayment({
          backend,
          paymentId,
          policy: fulfillmentPolicy,
        });
        fulfilled = outcome.fulfilled;
        fulfillmentReason = outcome.fulfilled ? null : "fulfillment_not_completed";
      }
    }

    return NextResponse.json({
      accepted: true,
      disposition: result.disposition,
      providerPaymentId: result.providerPaymentId,
      checkoutIntentId: result.checkoutIntentId,
      issues: result.issues,
      materialized,
      materializationReason,
      fulfilled,
      fulfillmentReason,
    });
  } catch {
    // Once either financial write or product fulfillment is explicitly enabled,
    // HTTP 503 lets provider retry converge through the idempotent database path.
    return NextResponse.json({ error: "mercado_pago_sandbox_webhook_processing_failed" }, { status: 503 });
  }
}
