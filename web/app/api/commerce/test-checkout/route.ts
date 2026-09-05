import { NextResponse } from "next/server";
import { getServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders, type CommerceCheckoutIntentRow } from "@/lib/commerce/backend";
import { getPaymentRuntime, signWebhookPayload, verifyTestCheckoutSignature } from "@/lib/commerce/config";
import { fulfillSignedTestWebhook } from "@/lib/commerce/payment-fulfillment";

export const runtime = "nodejs";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function html(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function readIntent(intentId: string) {
  const config = getServerBackendConfig();
  if (!config) return { ok: false as const, error: "commerce_backend_not_configured" as const, intent: null };

  const response = await fetch(`${config.url}/rest/v1/commerce_checkout_intents?select=*&id=eq.${encodeURIComponent(intentId)}&limit=1`, {
    headers: serviceHeaders(config, false),
    cache: "no-store",
  });

  if (!response.ok) return { ok: false as const, error: "commerce_checkout_read_failed" as const, intent: null };
  const rows = (await response.json()) as CommerceCheckoutIntentRow[];
  return { ok: true as const, error: null, intent: rows[0] ?? null };
}

function unavailable(message: string, status = 403) {
  return html(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mara test checkout</title><body style="font-family:Arial;background:#0a0a0a;color:#f4f1eb;padding:32px"><main style="max-width:620px"><p>${escapeHtml(message)}</p><a href="/experience" style="color:#efe4d6">Volver con Mara</a></main></body>`, status);
}

function readParams(request: Request) {
  const url = new URL(request.url);
  const intentId = url.searchParams.get("intent") ?? "";
  const signature = url.searchParams.get("signature") ?? "";
  return { intentId, signature };
}

function invalidLink() {
  return unavailable("Este checkout de prueba no es valido.", 400);
}

export async function GET(request: Request) {
  const payment = getPaymentRuntime();
  if (!payment.configured || payment.provider !== "signed_test") {
    return unavailable("El checkout de prueba no esta activo en este despliegue.", 404);
  }

  const { intentId, signature } = readParams(request);
  if (!UUID_LIKE.test(intentId) || !verifyTestCheckoutSignature(intentId, signature, payment.webhookSecret)) {
    return invalidLink();
  }

  const result = await readIntent(intentId);
  if (!result.ok) return unavailable("No pude leer la intencion de checkout.", 503);
  if (!result.intent) return unavailable("La intencion de checkout ya no existe.", 404);

  return html(`<!doctype html>
<html lang="es">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Checkout de prueba · Mara Vera</title>
<body style="margin:0;background:#0a0a0a;color:#f4f1eb;font-family:Arial,Helvetica,sans-serif">
  <main style="min-height:100svh;display:grid;place-items:center;padding:24px">
    <section style="width:min(520px,100%);border:1px solid #2a2927;background:#111;padding:32px">
      <p style="color:#aaa39a;font-size:12px;letter-spacing:.14em;text-transform:uppercase">SIGNED TEST · NO COBRA DINERO REAL</p>
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:42px;margin:12px 0">Confirmar pago de prueba</h1>
      <p style="color:#c9c1b8">Este paso simula la confirmacion server-side del proveedor para verificar webhook, idempotencia, fulfillment y Supabase.</p>
      <form method="post" action="/api/commerce/test-checkout?intent=${escapeHtml(intentId)}&signature=${escapeHtml(signature)}">
        <button type="submit" style="min-height:48px;padding:0 18px;border:1px solid #efe4d6;background:#efe4d6;color:#111;cursor:pointer">Confirmar pago de prueba</button>
      </form>
      <p style="color:#aaa39a;font-size:12px;margin-top:18px">El navegador no marca la compra como pagada. La confirmacion pasa por firma HMAC y funcion service-role.</p>
    </section>
  </main>
</body>
</html>`);
}

export async function POST(request: Request) {
  const payment = getPaymentRuntime();
  if (!payment.configured || payment.provider !== "signed_test") {
    return unavailable("El checkout de prueba no esta activo en este despliegue.", 404);
  }

  const { intentId, signature } = readParams(request);
  if (!UUID_LIKE.test(intentId) || !verifyTestCheckoutSignature(intentId, signature, payment.webhookSecret)) {
    return invalidLink();
  }

  const result = await readIntent(intentId);
  if (!result.ok) return unavailable("No pude leer la intencion de checkout.", 503);
  if (!result.intent) return unavailable("La intencion de checkout ya no existe.", 404);
  if (result.intent.status === "completed") {
    return NextResponse.redirect(new URL("/experience?commerce=return", request.url), 303);
  }
  if (result.intent.status !== "pending" || !result.intent.provider_checkout_id) {
    return unavailable("Esta intencion de checkout no puede confirmarse.", 409);
  }

  const rawPayload = JSON.stringify({
    eventType: "payment_succeeded",
    providerEventId: `evt_test_${intentId}`,
    providerCheckoutId: result.intent.provider_checkout_id,
    providerPaymentId: `pay_test_${intentId}`,
    amountMinor: result.intent.amount_minor,
    currency: result.intent.currency,
  });
  const fulfillment = await fulfillSignedTestWebhook(rawPayload, signWebhookPayload(rawPayload, payment.webhookSecret));

  if (!fulfillment.ok) {
    return unavailable("La confirmacion firmada no pudo completar el fulfillment.", fulfillment.status);
  }

  return NextResponse.redirect(new URL("/experience?commerce=return", request.url), 303);
}
