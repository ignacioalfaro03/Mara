import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import {
  getMercadoPagoSandboxMaterializationPolicy,
  materializeAcceptedMercadoPagoSandboxPayment,
} from "@/lib/commerce/mercado-pago-sandbox-materialization";
import { getMercadoPagoSandboxExecutionRuntime } from "@/lib/commerce/mercado-pago-sandbox-runtime";
import { processMercadoPagoSandboxWebhook } from "@/lib/commerce/mercado-pago-sandbox-webhook";
import { createMercadoPagoSandboxWebhookStore } from "@/lib/commerce/mercado-pago-sandbox-webhook-store";

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

    const policy = getMercadoPagoSandboxMaterializationPolicy();
    let materialized = false;
    let materializationReason: string | null = policy.enabled ? null : policy.reason;

    if (policy.enabled && result.disposition === "materialize_succeeded") {
      const outcome = await materializeAcceptedMercadoPagoSandboxPayment({
        backend,
        webhookResult: result,
        providerEventId: xRequestId,
        policy,
      });
      materialized = outcome.materialized;
      materializationReason = outcome.materialized ? null : outcome.reason;
    }

    // Financial capture materialization may run only after provider re-fetch and
    // acceptance. Product purchase/entitlement/fulfillment remains a separate gate.
    return NextResponse.json({
      accepted: true,
      disposition: result.disposition,
      providerPaymentId: result.providerPaymentId,
      checkoutIntentId: result.checkoutIntentId,
      issues: result.issues,
      materialized,
      materializationReason,
      fulfilled: false,
    });
  } catch {
    // Once materialization is explicitly enabled, returning 503 causes provider
    // retry rather than acknowledging a financial write that may have failed.
    return NextResponse.json({ error: "mercado_pago_sandbox_webhook_processing_failed" }, { status: 503 });
  }
}
