import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
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
  const store = createMercadoPagoSandboxWebhookStore(backend);

  try {
    const result = await processMercadoPagoSandboxWebhook({
      rawBody,
      requestUrl: request.url,
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
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

    // This route proves signature -> binding -> provider re-fetch -> acceptance.
    // Financial materialization is intentionally a later gate. Never report a
    // purchase as fulfilled from this harness.
    return NextResponse.json({
      accepted: true,
      disposition: result.disposition,
      providerPaymentId: result.providerPaymentId,
      checkoutIntentId: result.checkoutIntentId,
      issues: result.issues,
      materialized: false,
    });
  } catch {
    return NextResponse.json({ error: "mercado_pago_sandbox_webhook_processing_failed" }, { status: 503 });
  }
}
