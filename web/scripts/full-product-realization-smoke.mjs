import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const outDir = path.resolve("artifacts/full-product-realization");
const viewports = [
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
];
const publicPaths = ["/", "/app", "/app/discover", "/app/messages", "/app/me", "/creators", "/creator"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function passAgeGate(page) {
  const alreadyPassed = await page.evaluate(() => window.localStorage.getItem("mara_age_gate_passed") === "true").catch(() => false);
  if (alreadyPassed) return;
  const confirm = page.getByRole("button", { name: /Tengo 18\+.*entrar/i });
  await confirm.waitFor({ state: "visible", timeout: 5_000 });
  await confirm.click();
  await page.getByRole("dialog").waitFor({ state: "detached", timeout: 5_000 }).catch(() => undefined);
}

async function noOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 2, `${label} has ${overflow}px horizontal overflow`);
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      locale: "es-CL",
      isMobile: viewport.width <= 430,
      hasTouch: viewport.width <= 430,
    });
    const page = await context.newPage();

    for (const route of publicPaths) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
      assert(response?.status() === 200, `${route} returned ${response?.status()} at ${viewport.name}`);
      await passAgeGate(page);
      await noOverflow(page, `${route} @ ${viewport.name}`);
    }

    await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle", timeout: 30_000 });
    await passAgeGate(page);
    for (const label of ["Inicio", "Descubrir", "Mensajes", "Tú"]) {
      assert(await page.getByText(label, { exact: true }).count() > 0, `Consumer navigation missing ${label} @ ${viewport.name}`);
    }
    assert(await page.getByText("Abre Mara.", { exact: true }).count() > 0, `Consumer Mara anchor missing @ ${viewport.name}`);

    if (viewport.width === 390 || viewport.width === 1440) {
      await page.screenshot({ path: path.join(outDir, `consumer-home-${viewport.name}.png`), fullPage: true });
      await page.goto(`${baseUrl}/app/discover`, { waitUntil: "networkidle", timeout: 30_000 });
      await passAgeGate(page);
      await page.screenshot({ path: path.join(outDir, `discover-${viewport.name}.png`), fullPage: true });
      await page.goto(`${baseUrl}/app/messages`, { waitUntil: "networkidle", timeout: 30_000 });
      await passAgeGate(page);
      await page.screenshot({ path: path.join(outDir, `messages-${viewport.name}.png`), fullPage: true });
      await page.goto(`${baseUrl}/app/me`, { waitUntil: "networkidle", timeout: 30_000 });
      await passAgeGate(page);
      await page.screenshot({ path: path.join(outDir, `me-${viewport.name}.png`), fullPage: true });
    }

    await context.close();
  }

  const apiContext = await browser.newContext();
  const health = await apiContext.request.get(`${baseUrl}/api/health`);
  assert(health.status() === 200, `/api/health returned ${health.status()}`);
  const healthBody = await health.json();
  assert(healthBody?.status === "ok", `/api/health status is ${healthBody?.status}`);

  const commerce = await apiContext.request.get(`${baseUrl}/api/commerce/launch`);
  assert(commerce.status() === 200, `/api/commerce/launch returned ${commerce.status()}`);
  const commerceBody = await commerce.json();
  assert(["configured", "not_configured"].includes(commerceBody?.payment?.status), "Payment boundary contract changed");

  const follow = await apiContext.request.get(`${baseUrl}/api/follow?creatorId=00000000-0000-4000-8000-000000000000`);
  assert([200, 400, 401, 404].includes(follow.status()), `/api/follow leaked unexpected status ${follow.status()}`);

  const messages = await apiContext.request.get(`${baseUrl}/api/messages?threadId=00000000-0000-4000-8000-000000000000`);
  assert([200, 401, 404].includes(messages.status()), `/api/messages leaked unexpected status ${messages.status()}`);

  const requests = await apiContext.request.get(`${baseUrl}/api/requests`);
  assert([200, 401, 404].includes(requests.status()), `/api/requests leaked unexpected status ${requests.status()}`);

  const internalQa = await apiContext.request.post(`${baseUrl}/api/internal/qa-user`, {
    data: { action: "create", email: "mara.full.product.qa@example.com", password: "not-a-real-password" },
  });
  assert([401, 404].includes(internalQa.status()), `Internal QA route unexpectedly exposed with ${internalQa.status()}`);

  await apiContext.close();
  console.log("MARA_FULL_PRODUCT_REALIZATION_SMOKE PASS");
} finally {
  await browser.close();
}
