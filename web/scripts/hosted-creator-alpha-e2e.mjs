import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");
const expectedSha = process.env.EXPECTED_SHA?.trim();
const qaToken = process.env.QA_BOOTSTRAP_TOKEN?.trim();
const protectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
const runTag = `${process.env.GITHUB_RUN_ID ?? Date.now()}-${process.env.GITHUB_RUN_ATTEMPT ?? "1"}`.toLowerCase();

if (!baseUrl || !expectedSha || !qaToken) {
  throw new Error("BASE_URL, EXPECTED_SHA and QA_BOOTSTRAP_TOKEN are required");
}

const password = `MaraQa-${runTag}-${crypto.randomUUID()}`.slice(0, 72);
const identities = {
  creatorA: `mara.qa.${runTag}.creator-a@example.com`,
  customerA: `mara.qa.${runTag}.customer-a@example.com`,
  customerB: `mara.qa.${runTag}.customer-b@example.com`,
  creatorB: `mara.qa.${runTag}.creator-b@example.com`,
};
const worldSlug = `qa-world-${runTag}`.replace(/[^a-z0-9-]/g, "-").slice(0, 70);
const worldName = `QA World ${runTag}`;
const demandTitle = `QA audio ${runTag}`;
const offerTitle = `QA personalized ${runTag}`;
const weaknessText = `QA preference ${runTag}`;
const evidenceDir = path.resolve("artifacts/creator-alpha-e2e");
fs.mkdirSync(evidenceDir, { recursive: true });

const apiProtectionHeaders = protectionBypass
  ? { "x-vercel-protection-bypass": protectionBypass }
  : {};
const browserProtectionHeaders = protectionBypass
  ? {
      "x-vercel-protection-bypass": protectionBypass,
      "x-vercel-set-bypass-cookie": "true",
    }
  : {};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function qaUser(body) {
  const response = await fetch(`${baseUrl}/api/internal/qa-user`, {
    method: "POST",
    headers: {
      ...apiProtectionHeaders,
      "Content-Type": "application/json",
      "x-mara-qa-token": qaToken,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok !== true) {
    throw new Error(`QA user action failed: status=${response.status} error=${payload?.error ?? "unknown"}`);
  }
  return payload;
}

async function acceptAgeGate(page) {
  const button = page.getByRole("button", { name: "Sí, tengo 18+" });
  if (await button.isVisible({ timeout: 2500 }).catch(() => false)) {
    await button.click();
  }
}

async function signIn(page, email) {
  await page.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  await acceptAgeGate(page);
  const enterTab = page.getByRole("button", { name: "Entrar", exact: true });
  if (await enterTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await enterTab.click();
  }
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Seguir", exact: true }).click();
  await page.waitForURL(/\/experience\?account=ready/, { timeout: 30000 });
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(evidenceDir, `${name}.png`), fullPage: true });
}

async function activateCreator(page) {
  await page.goto(`${baseUrl}/creator`, { waitUntil: "networkidle" });
  const activate = page.getByRole("button", { name: "Activar Creator Alpha" });
  await activate.waitFor({ state: "visible", timeout: 15000 });
  await Promise.all([
    page.waitForURL(/\/creator(?:\?.*)?$/, { timeout: 30000 }),
    activate.click(),
  ]);
  await page.getByText(/CREATOR OS · pilot · free/i).waitFor({ timeout: 15000 });
}

async function createWorld(page) {
  const worldForm = page.locator('form[action="/api/creator/worlds"]');
  await worldForm.locator('input[name="displayName"]').fill(worldName);
  await worldForm.locator('input[name="slug"]').fill(worldSlug);
  await worldForm.locator('textarea[name="description"]').fill("Controlled Creator Alpha browser proof.");
  await worldForm.locator('select[name="visibility"]').selectOption("public");
  await Promise.all([
    page.waitForURL(/\/creator(?:\?.*)?$/, { timeout: 30000 }),
    worldForm.getByRole("button", { name: "Crear World" }).click(),
  ]);
  await page.getByRole("link", { name: worldName }).waitFor({ timeout: 15000 });
}

async function saveTasteAndWeakness(page) {
  await page.goto(`${baseUrl}/world/${worldSlug}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Audio", exact: true }).click();
  await page.waitForLoadState("networkidle");

  const weaknessForm = page.locator('form[action="/api/weakness"]');
  await weaknessForm.locator('textarea[name="valueText"]').fill(weaknessText);
  const visibleCheckbox = weaknessForm.locator('input[name="creatorVisible"]');
  if (!(await visibleCheckbox.isChecked())) await visibleCheckbox.check();
  await Promise.all([
    page.waitForURL(new RegExp(`/world/${worldSlug}$`), { timeout: 30000 }),
    weaknessForm.getByRole("button", { name: "Guardar", exact: true }).click(),
  ]);
  await page.locator('form[action="/api/weakness"] textarea[name="valueText"]').waitFor();
  assert(
    (await page.locator('form[action="/api/weakness"] textarea[name="valueText"]').inputValue()) === weaknessText,
    "Weakness did not persist through the real World UI",
  );
}

async function createDemandAndCommit(page) {
  const demandForm = page.locator('form[action="/api/demand"]');
  await demandForm.locator('input[name="title"]').fill(demandTitle);
  await demandForm.locator('textarea[name="description"]').fill("Short personalized audio requested through the QA World.");
  await demandForm.locator('select[name="fulfillmentType"]').selectOption("digital_product");
  await demandForm.locator('input[name="category"]').fill("Digital product");
  await demandForm.locator('select[name="privacyMode"]').selectOption("pseudonymous");
  await demandForm.locator('input[name="wtp"]').fill("15000");
  await Promise.all([
    page.waitForURL(new RegExp(`/world/${worldSlug}$`), { timeout: 30000 }),
    demandForm.getByRole("button", { name: "Quiero que esto exista" }).click(),
  ]);
  await page.getByRole("heading", { name: demandTitle }).waitFor({ timeout: 15000 });

  const item = page.locator("li").filter({ has: page.getByRole("heading", { name: demandTitle }) }).first();
  const signal = item.locator('form[action="/api/demand/signal"]');
  await signal.locator('select[name="level"]').selectOption("commit");
  await signal.locator('select[name="privacyMode"]').selectOption("pseudonymous");
  await signal.locator('input[name="wtp"]').fill("15000");
  await Promise.all([
    page.waitForURL(new RegExp(`/world/${worldSlug}$`), { timeout: 30000 }),
    signal.getByRole("button", { name: "Actualizar mi interés" }).click(),
  ]);
  await page.getByText(/1 compromisos\./).waitFor({ timeout: 15000 });
}

async function addPrivateSecondCommit(page) {
  await page.goto(`${baseUrl}/world/${worldSlug}`, { waitUntil: "networkidle" });
  const item = page.locator("li").filter({ has: page.getByRole("heading", { name: demandTitle }) }).first();
  const signal = item.locator('form[action="/api/demand/signal"]');
  await signal.locator('select[name="level"]').selectOption("commit");
  await signal.locator('select[name="privacyMode"]').selectOption("private");
  await signal.locator('input[name="wtp"]').fill("18000");
  await Promise.all([
    page.waitForURL(new RegExp(`/world/${worldSlug}$`), { timeout: 30000 }),
    signal.getByRole("button", { name: "Actualizar mi interés" }).click(),
  ]);
  await page.getByText(/2 compromisos\./).waitFor({ timeout: 15000 });
}

async function createOfferFromDemand(page) {
  await page.goto(`${baseUrl}/creator`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: demandTitle }).waitFor({ timeout: 15000 });
  await page.getByText(/2 commit\./).waitFor({ timeout: 15000 });
  await screenshot(page, "01-creator-demand-aggregate");

  await page.getByRole("link", { name: "Create offer from this demand" }).click();
  await page.waitForURL(/\/creator\?demand=/, { timeout: 15000 });

  const offerForm = page.locator('form[action="/api/creator/offers"]');
  await offerForm.locator('input[name="title"]').fill(offerTitle);
  await offerForm.locator('textarea[name="description"]').fill("QA personalized delivery from validated demand.");
  await offerForm.locator('select[name="offerFamily"]').selectOption("personalized_digital");
  await offerForm.locator('input[name="price"]').fill("12000");
  await offerForm.locator('input[name="fulfillmentConcept"]').fill("digital_delivery");
  await offerForm.locator('select[name="status"]').selectOption("active");
  await Promise.all([
    page.waitForURL(/\/creator(?:\?.*)?$/, { timeout: 30000 }),
    offerForm.getByRole("button", { name: "Crear oferta" }).click(),
  ]);
}

async function purchaseOffer(page) {
  await page.goto(`${baseUrl}/world/${worldSlug}`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: offerTitle }).waitFor({ timeout: 15000 });
  const offerCard = page.locator("article").filter({ has: page.getByRole("heading", { name: offerTitle }) }).first();
  await Promise.all([
    page.waitForURL(/\/api\/commerce\/test-checkout\?/, { timeout: 30000 }),
    offerCard.getByRole("button", { name: "Probar desbloqueo" }).click(),
  ]);
  await page.getByText(/SIGNED TEST · NO COBRA DINERO REAL/).waitFor();
  await screenshot(page, "02-signed-test-checkout");
  await Promise.all([
    page.waitForURL(/\/experience\?commerce=return/, { timeout: 30000 }),
    page.getByRole("button", { name: "Confirmar pago de prueba" }).click(),
  ]);
}

async function assertPendingFulfillment(page) {
  await page.goto(`${baseUrl}/creator`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Fulfill this first." }).waitFor({ timeout: 15000 });
  const fulfillForm = page.locator('form[action="/api/creator/fulfillment"]').first();
  const purchaseId = await fulfillForm.locator('input[name="purchaseId"]').inputValue();
  assert(/^[0-9a-f-]{36}$/i.test(purchaseId), "Creator dashboard did not expose a valid pending purchase id");
  await screenshot(page, "03-pending-fulfillment");
  return purchaseId;
}

async function assertCreatorIsolation(page, purchaseId) {
  await activateCreator(page);
  const body = await page.locator("body").innerText();
  assert(!body.includes(demandTitle), "Creator B can see Creator A demand");
  assert(!body.includes(offerTitle), "Creator B can see Creator A offer");

  const attempt = await page.evaluate(async ({ purchaseId }) => {
    const body = new URLSearchParams({ purchaseId, returnTo: "/creator" });
    const response = await fetch("/api/creator/fulfillment", { method: "POST", body });
    return { status: response.status, json: await response.json().catch(() => ({})) };
  }, { purchaseId });
  assert(
    attempt.status === 404 && attempt.json?.error === "purchase_not_authorized",
    `Cross-creator fulfillment was not rejected safely: ${JSON.stringify(attempt)}`,
  );
}

async function fulfillAsOwner(page) {
  await page.goto(`${baseUrl}/creator`, { waitUntil: "networkidle" });
  const fulfill = page.getByRole("button", { name: "Marcar entregado" }).first();
  await Promise.all([
    page.waitForURL(/\/creator(?:\?.*)?$/, { timeout: 30000 }),
    fulfill.click(),
  ]);
  await page.getByText("No hay entregas pendientes.").waitFor({ timeout: 15000 });
  await page.getByRole("heading", { name: "No vendas nada ahora." }).waitFor({ timeout: 15000 });
  await screenshot(page, "04-owner-after-fulfillment");
}

async function assertCustomerHistory(page) {
  await page.goto(`${baseUrl}/me/history`, { waitUntil: "networkidle" });
  await page.getByText(/PURCHASE COMPLETED/i).first().waitFor({ timeout: 15000 });
  await page.getByText(/FULFILLMENT COMPLETED/i).first().waitFor({ timeout: 15000 });
  await screenshot(page, "05-customer-history");
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
  extraHTTPHeaders: Object.keys(browserProtectionHeaders).length ? browserProtectionHeaders : undefined,
};

const created = [];
const contexts = [];
let primaryError = null;

try {
  for (const email of Object.values(identities)) {
    const result = await qaUser({ action: "create", email, password });
    created.push({ email, userId: result.userId });
  }
  console.log("MARA_CREATOR_ALPHA_QA_IDENTITIES PASS");

  const probe = await browser.newContext(contextOptions);
  contexts.push(probe);
  const health = await probe.request.get(`${baseUrl}/api/health`);
  assert(health.status() === 200, `/api/health returned ${health.status()}`);
  const healthBody = await health.json();
  assert(healthBody.commit === expectedSha, `Expected release SHA ${expectedSha}, got ${healthBody.commit}`);
  console.log("MARA_CREATOR_ALPHA_EXACT_SHA PASS");

  const creatorAContext = await browser.newContext(contextOptions);
  const customerAContext = await browser.newContext(contextOptions);
  const customerBContext = await browser.newContext(contextOptions);
  const creatorBContext = await browser.newContext(contextOptions);
  contexts.push(creatorAContext, customerAContext, customerBContext, creatorBContext);

  const creatorA = await creatorAContext.newPage();
  const customerA = await customerAContext.newPage();
  const customerB = await customerBContext.newPage();
  const creatorB = await creatorBContext.newPage();

  await signIn(creatorA, identities.creatorA);
  await activateCreator(creatorA);
  await createWorld(creatorA);
  console.log("MARA_CREATOR_ALPHA_CREATOR_WORLD PASS");

  await signIn(customerA, identities.customerA);
  await saveTasteAndWeakness(customerA);
  await createDemandAndCommit(customerA);
  console.log("MARA_CREATOR_ALPHA_CUSTOMER_SIGNAL PASS");

  await signIn(customerB, identities.customerB);
  await addPrivateSecondCommit(customerB);
  console.log("MARA_CREATOR_ALPHA_PRIVATE_AGGREGATION PASS");

  await createOfferFromDemand(creatorA);
  console.log("MARA_CREATOR_ALPHA_DEMAND_TO_OFFER PASS");

  await purchaseOffer(customerA);
  const purchaseId = await assertPendingFulfillment(creatorA);
  console.log("MARA_CREATOR_ALPHA_PURCHASE_PENDING PASS");

  await signIn(creatorB, identities.creatorB);
  await assertCreatorIsolation(creatorB, purchaseId);
  console.log("MARA_CREATOR_ALPHA_CROSS_CREATOR_ISOLATION PASS");

  await fulfillAsOwner(creatorA);
  await assertCustomerHistory(customerA);
  console.log("MARA_CREATOR_ALPHA_FULFILLMENT_HISTORY PASS");

  const summary = {
    ok: true,
    releaseSha: expectedSha,
    worldSlug,
    checks: [
      "creator_activation",
      "world_creation",
      "taste_and_weakness",
      "demand_creation",
      "two_customer_commit_aggregation",
      "private_commit_aggregation",
      "demand_to_offer",
      "signed_test_purchase",
      "pending_manual_fulfillment",
      "cross_creator_isolation",
      "creator_fulfillment",
      "customer_history",
      "creator_wait_state",
    ],
    paymentBoundary: "signed_test_only",
    canonicalProductionTouched: false,
  };
  fs.writeFileSync(path.join(evidenceDir, "summary.json"), JSON.stringify(summary, null, 2));
  console.log("MARA_CREATOR_ALPHA_BROWSER_E2E PASS");
} catch (error) {
  primaryError = error;
  fs.writeFileSync(
    path.join(evidenceDir, "summary.json"),
    JSON.stringify({ ok: false, releaseSha: expectedSha, error: error instanceof Error ? error.message : String(error) }, null, 2),
  );
  throw error;
} finally {
  for (const context of contexts.reverse()) {
    await context.close().catch(() => undefined);
  }
  await browser.close().catch(() => undefined);

  const cleanupErrors = [];
  for (const { userId } of created.reverse()) {
    try {
      await qaUser({ action: "delete", userId });
    } catch (error) {
      cleanupErrors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (cleanupErrors.length) {
    console.error("MARA_CREATOR_ALPHA_QA_CLEANUP_FAILED", cleanupErrors.join(" | "));
    if (!primaryError) {
      throw new Error(`Creator Alpha QA cleanup failed: ${cleanupErrors.join(" | ")}`);
    }
  } else {
    console.log("MARA_CREATOR_ALPHA_QA_CLEANUP PASS");
  }
}
