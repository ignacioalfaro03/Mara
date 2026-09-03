import crypto from "node:crypto";
import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
const supabaseUrl = (process.env.SUPABASE_URL || "https://hctykprkwenhatbjxkpb.supabase.co").replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const webhookSecret = process.env.MARA_PAYMENT_WEBHOOK_SECRET || "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(baseUrl.startsWith("https://"), "BASE_URL must be an HTTPS Vercel Preview URL");
assert(baseUrl !== "https://mara-vera.vercel.app", "Hosted revenue E2E must never target the canonical production alias");
assert(serviceRoleKey.length > 20, "SUPABASE_SERVICE_ROLE_KEY is required for ephemeral QA user lifecycle");
assert(webhookSecret.length >= 24, "MARA_PAYMENT_WEBHOOK_SECRET must be at least 24 characters");

const qaTag = crypto.randomUUID();
const qaEmail = `mara.qa.revenue.${qaTag}@example.com`;
const qaPassword = `${crypto.randomBytes(18).toString("hex")}A!9`;
let qaUserId = null;
let providerEventId = null;
let browser = null;

const adminHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

async function readJson(response) {
  return response.json().catch(() => ({}));
}

async function createQaUser() {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      email: qaEmail,
      password: qaPassword,
      email_confirm: true,
      user_metadata: { qa_purpose: "hosted_revenue_e2e" },
    }),
  });
  const body = await readJson(response);
  assert(response.ok && typeof body?.id === "string", `QA user creation failed (${response.status})`);
  qaUserId = body.id;
}

async function cleanupQaState() {
  if (providerEventId) {
    await fetch(
      `${supabaseUrl}/rest/v1/commerce_webhook_events?provider=eq.signed_test&provider_event_id=eq.${encodeURIComponent(providerEventId)}`,
      { method: "DELETE", headers: adminHeaders },
    ).catch(() => null);
  }

  if (qaUserId) {
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(qaUserId)}`, {
      method: "DELETE",
      headers: adminHeaders,
    }).catch(() => null);
  }
}

async function verifyCleanup() {
  if (!qaUserId) return;

  const [intents, purchases, entitlements, contributions, webhookEvents] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/commerce_checkout_intents?select=id&user_id=eq.${encodeURIComponent(qaUserId)}`, { headers: adminHeaders }),
    fetch(`${supabaseUrl}/rest/v1/commerce_purchases?select=id&user_id=eq.${encodeURIComponent(qaUserId)}`, { headers: adminHeaders }),
    fetch(`${supabaseUrl}/rest/v1/commerce_entitlements?select=id&user_id=eq.${encodeURIComponent(qaUserId)}`, { headers: adminHeaders }),
    fetch(`${supabaseUrl}/rest/v1/commerce_contributions?select=id&user_id=eq.${encodeURIComponent(qaUserId)}`, { headers: adminHeaders }),
    providerEventId
      ? fetch(`${supabaseUrl}/rest/v1/commerce_webhook_events?select=id&provider=eq.signed_test&provider_event_id=eq.${encodeURIComponent(providerEventId)}`, { headers: adminHeaders })
      : Promise.resolve(null),
  ]);

  for (const [label, response] of [
    ["checkout intents", intents],
    ["purchases", purchases],
    ["entitlements", entitlements],
    ["contributions", contributions],
  ]) {
    assert(response.ok, `Cleanup verification could not read ${label}`);
    const rows = await response.json();
    assert(Array.isArray(rows) && rows.length === 0, `QA cleanup left ${label} behind`);
  }

  if (webhookEvents) {
    assert(webhookEvents.ok, "Cleanup verification could not read webhook ledger");
    const rows = await webhookEvents.json();
    assert(Array.isArray(rows) && rows.length === 0, "QA cleanup left webhook ledger rows behind");
  }
}

try {
  await createQaUser();

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: "es-CL",
  });

  const launchResponse = await context.request.get(`${baseUrl}/api/commerce/launch`);
  assert(launchResponse.status() === 200, `/api/commerce/launch returned ${launchResponse.status()}`);
  const launch = await launchResponse.json();
  assert(launch?.source === "supabase", `Commerce launch source must be supabase, got ${launch?.source}`);
  assert(launch?.backendConfigured === true, "Hosted commerce backend is not configured");
  assert(launch?.payment?.status === "configured", `Payment status must be configured, got ${launch?.payment?.status}`);
  assert(launch?.payment?.provider === "signed_test", `Expected signed_test provider, got ${launch?.payment?.provider}`);
  assert(launch?.offers?.fixed?.slug === "private_after_scene_note_v1", "Fixed launch offer missing");
  assert(launch?.offers?.fixed?.amountMinor === 499, "Fixed launch offer price changed unexpectedly");
  assert(launch?.offers?.capricho?.slug === "black_bag_capricho_01", "Capricho offer missing");
  assert(launch?.goals?.capricho?.slug === "black_bag_01", "Capricho goal missing");

  const signinResponse = await context.request.post(`${baseUrl}/api/auth/signin`, {
    data: { email: qaEmail, password: qaPassword },
  });
  assert(signinResponse.status() === 200, `QA signin failed with ${signinResponse.status()}`);

  const initialMeResponse = await context.request.get(`${baseUrl}/api/commerce/me`);
  assert(initialMeResponse.status() === 200, `/api/commerce/me initial read returned ${initialMeResponse.status()}`);
  const initialMe = await initialMeResponse.json();
  assert(initialMe.purchases?.length === 0, "Ephemeral QA user unexpectedly has purchases");
  assert(initialMe.entitlements?.length === 0, "Ephemeral QA user unexpectedly has entitlements");
  assert(initialMe.contributions?.length === 0, "Ephemeral QA user unexpectedly has contributions");

  const clientRequestId = crypto.randomUUID();
  const checkoutPayload = {
    offerSlug: "private_after_scene_note_v1",
    clientRequestId,
  };

  const checkoutResponse = await context.request.post(`${baseUrl}/api/commerce/checkout`, { data: checkoutPayload });
  assert(checkoutResponse.status() === 201, `Fixed checkout creation returned ${checkoutResponse.status()}`);
  const checkout = await checkoutResponse.json();
  assert(checkout?.provider === "signed_test", `Checkout provider is ${checkout?.provider}`);
  assert(checkout?.testMode === true, "Hosted revenue E2E must run in signed test mode");
  assert(checkout?.status === "pending", `New checkout status is ${checkout?.status}`);
  assert(typeof checkout?.intentId === "string", "Checkout intent id missing");
  assert(typeof checkout?.checkoutUrl === "string", "Checkout URL missing");
  assert(new URL(checkout.checkoutUrl).origin === new URL(baseUrl).origin, "Test checkout URL escaped the Preview origin");

  const retryResponse = await context.request.post(`${baseUrl}/api/commerce/checkout`, { data: checkoutPayload });
  assert(retryResponse.status() === 200, `Idempotent checkout retry returned ${retryResponse.status()}`);
  const retry = await retryResponse.json();
  assert(retry?.intentId === checkout.intentId, "Checkout retry created a different intent");
  assert(retry?.checkoutUrl === checkout.checkoutUrl, "Checkout retry changed the provider URL");

  const conflictResponse = await context.request.post(`${baseUrl}/api/commerce/checkout`, {
    data: {
      offerSlug: "black_bag_capricho_01",
      amountMinor: 100,
      clientRequestId,
    },
  });
  assert(conflictResponse.status() === 409, `Idempotency conflict should return 409, got ${conflictResponse.status()}`);
  const conflict = await conflictResponse.json();
  assert(conflict?.error === "checkout_idempotency_conflict", `Unexpected idempotency error ${conflict?.error}`);

  const page = await context.newPage();
  const checkoutPage = await page.goto(checkout.checkoutUrl, { waitUntil: "domcontentloaded" });
  assert(checkoutPage?.status() === 200, `Signed test checkout page returned ${checkoutPage?.status()}`);
  await page.getByRole("button", { name: "Confirmar pago de prueba" }).click();
  await page.waitForURL((url) => url.pathname === "/experience" && url.searchParams.get("commerce") === "return");

  const fulfilledMeResponse = await context.request.get(`${baseUrl}/api/commerce/me`);
  assert(fulfilledMeResponse.status() === 200, `/api/commerce/me fulfilled read returned ${fulfilledMeResponse.status()}`);
  const fulfilledMe = await fulfilledMeResponse.json();
  const purchase = fulfilledMe.purchases?.find((item) => item.offerSlug === "private_after_scene_note_v1");
  assert(purchase?.status === "succeeded", "Fixed purchase was not persisted as succeeded");
  assert(purchase?.amountMinor === 499 && purchase?.currency === "USD", "Persisted fixed purchase amount/currency mismatch");
  assert(purchase?.provider === "signed_test", `Persisted provider is ${purchase?.provider}`);
  assert(typeof purchase?.fulfilledAt === "string", "Persisted purchase has no fulfillment timestamp");
  assert(
    fulfilledMe.entitlements?.some((item) => item.key === "private_after_scene_note_v1" && item.status === "active"),
    "Fixed purchase did not create the expected active entitlement",
  );

  providerEventId = `evt_test_${checkout.intentId}`;
  const duplicatePayload = JSON.stringify({
    eventType: "payment_succeeded",
    providerEventId,
    providerCheckoutId: `checkout_test_${checkout.intentId}`,
    providerPaymentId: `pay_test_${checkout.intentId}`,
    amountMinor: 499,
    currency: "USD",
  });
  const duplicateSignature = crypto.createHmac("sha256", webhookSecret).update(duplicatePayload).digest("hex");
  const duplicateWebhookResponse = await context.request.post(`${baseUrl}/api/commerce/webhooks/signed-test`, {
    data: duplicatePayload,
    headers: {
      "content-type": "application/json",
      "mara-test-signature": duplicateSignature,
    },
  });
  assert(duplicateWebhookResponse.status() === 200, `Duplicate signed webhook returned ${duplicateWebhookResponse.status()}`);
  const duplicateWebhook = await duplicateWebhookResponse.json();
  assert(duplicateWebhook?.ok === true, "Duplicate signed webhook was not accepted idempotently");
  assert(duplicateWebhook?.purchaseId === purchase.id, "Duplicate signed webhook resolved to a different purchase");

  const afterDuplicateResponse = await context.request.get(`${baseUrl}/api/commerce/me`);
  const afterDuplicate = await afterDuplicateResponse.json();
  const fixedPurchases = afterDuplicate.purchases?.filter((item) => item.offerSlug === "private_after_scene_note_v1") ?? [];
  assert(fixedPurchases.length === 1, `Duplicate webhook created ${fixedPurchases.length} fixed purchases`);
  const fixedEntitlements = afterDuplicate.entitlements?.filter((item) => item.key === "private_after_scene_note_v1" && item.status === "active") ?? [];
  assert(fixedEntitlements.length === 1, `Duplicate webhook created ${fixedEntitlements.length} active fixed entitlements`);

  await page.reload({ waitUntil: "domcontentloaded" });
  const finalMeResponse = await context.request.get(`${baseUrl}/api/commerce/me`);
  assert(finalMeResponse.status() === 200, `Reload commerce read returned ${finalMeResponse.status()}`);
  const finalMe = await finalMeResponse.json();
  assert(
    finalMe.entitlements?.some((item) => item.key === "private_after_scene_note_v1" && item.status === "active"),
    "Entitlement did not survive a hosted reload",
  );

  console.log("MARA_HOSTED_REVENUE_E2E PASS");
  console.log(`VERIFIED_PREVIEW=${baseUrl}`);
  console.log(`VERIFIED_INTENT=${checkout.intentId}`);
  console.log(`VERIFIED_PURCHASE=${purchase.id}`);
} finally {
  if (browser) await browser.close().catch(() => null);
  await cleanupQaState();
  await verifyCleanup();
  console.log("MARA_HOSTED_REVENUE_QA_CLEANUP PASS");
}
