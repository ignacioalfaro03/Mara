import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const publicPaths = ["/", "/meet-mara", "/legal", "/premium"];
const labPaths = [
  "/experience/caprichos-lab",
  "/experience/commerce-lab",
  "/experience/economics-lab",
  "/experience/media-companion-lab",
  "/experience/orchestration-lab",
  "/experience/rituals-lab",
  "/experience/segment-lab",
  "/experience/wtp-lab",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertNoHorizontalOverflow(page, path) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(overflow <= 1, `${path} has horizontal overflow of ${overflow}px`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
});
const page = await context.newPage();

try {
  const health = await context.request.get(`${baseUrl}/api/health`);
  assert(health.status() === 200, `/api/health returned ${health.status()}`);
  const healthBody = await health.json();
  assert(healthBody?.status === "ok", `/api/health status is ${healthBody?.status}`);
  assert(healthBody?.service === "mara-vera-web", `/api/health service is ${healthBody?.service}`);
  assert(healthBody?.release === "public-alpha", `/api/health release is ${healthBody?.release}`);
  assert(health.headers()["cache-control"]?.includes("no-store"), "/api/health must not be cached");

  const home = await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  assert(home?.status() === 200, `Home returned ${home?.status()}`);
  await page.getByRole("dialog").waitFor();
  await page.getByRole("dialog").locator("button").first().click();
  await page.locator('img[alt="Mara Vera"]').first().waitFor();
  const maraLoaded = await page.locator('img[alt="Mara Vera"]').first().evaluate((img) => img.complete && img.naturalWidth > 0);
  assert(maraLoaded, "Canonical Mara image did not load");
  await assertNoHorizontalOverflow(page, "/");

  for (const path of publicPaths.slice(1)) {
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    assert(response?.status() === 200, `${path} returned ${response?.status()}`);
    await assertNoHorizontalOverflow(page, path);
  }

  const premiumText = await page.locator("body").innerText();
  assert(!premiumText.includes("US$9.99"), "Premium route exposes experimental price");
  assert(!premiumText.toLowerCase().includes("checkout") || premiumText.includes("no hay suscripción ni checkout"), "Premium route suggests an active checkout");

  await page.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await assertNoHorizontalOverflow(page, "/experience");
  await page.getByRole("button", { name: "Dale" }).click();
  for (let index = 0; index < 4; index += 1) {
    await page.locator(".livingChoice").first().click();
  }
  await page.getByRole("button", { name: "Sigue" }).click();
  await page.getByRole("button", { name: "Déjalo ahí" }).click();

  const storedState = await page.evaluate(() => window.localStorage.getItem("mara_launch_state_v1"));
  assert(storedState && JSON.parse(storedState).completed === true, "Launch experience did not persist completed state");

  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("VOLVISTE").waitFor();
  await page.getByText(/Me había quedado algo pendiente contigo/).waitFor();
  await assertNoHorizontalOverflow(page, "/experience return");

  for (const path of labPaths) {
    const response = await context.request.get(`${baseUrl}${path}`);
    assert(response.status() === 404, `${path} should be 404 in production but returned ${response.status()}`);
  }

  const allowedTelemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: { event: "page_view", properties: { surface: "launch_smoke" }, timestamp: new Date().toISOString() },
  });
  assert(allowedTelemetry.status() === 200, `Allowed telemetry returned ${allowedTelemetry.status()}`);

  const rejectedTelemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: { event: "raw_intimate_text", properties: { text: "must-not-log" } },
  });
  assert(rejectedTelemetry.status() === 400, `Unknown telemetry event should be rejected, got ${rejectedTelemetry.status()}`);

  console.log("MARA_LAUNCH_SMOKE PASS");
} finally {
  await browser.close();
}
