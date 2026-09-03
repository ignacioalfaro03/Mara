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

async function assertMaraImageLoaded(page, contextLabel) {
  const image = page.locator('img[alt="Mara Vera"]').first();
  await image.waitFor();
  await page.waitForFunction(() => {
    const img = document.querySelector('img[alt="Mara Vera"]');
    return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
  });
  const dimensions = await image.evaluate((img) => ({ width: img.naturalWidth, height: img.naturalHeight }));
  assert(dimensions.width > 0 && dimensions.height > 0, `${contextLabel}: canonical Mara image did not decode`);
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

  const home = await page.goto(`${baseUrl}/?src=ig&campaign=must-not-leak`, { waitUntil: "networkidle" });
  assert(home?.status() === 200, `Home returned ${home?.status()}`);
  await page.getByRole("dialog").waitFor();
  await page.getByRole("dialog").locator("button").first().click();
  await page.getByText("Llegaste justo.").waitFor();
  await page.getByText(/Necesito una decisión rápida/).waitFor();
  await assertMaraImageLoaded(page, "home");
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
  await assertMaraImageLoaded(page, "experience intro");
  await page.getByRole("button", { name: "Métete." }).click();

  await page.getByText("Negro o crema.").waitFor();
  await page.getByRole("button", { name: "Negro." }).click();
  await page.getByText("Obvio.").waitFor();
  await page.getByRole("button", { name: "Espera." }).click();

  await page.getByText("¿Cuál te gusta más?").waitFor();
  await page.getByRole("button", { name: "Elegir la primera foto de Mara" }).click();
  await page.getByText("La primera. Ya.").waitFor();
  await page.getByRole("button", { name: "Ahora sí." }).click();

  await page.getByText("Te pillé mirando.").waitFor();
  await page.getByRole("button", { name: "Voy hacia ti." }).click();
  await page.getByText("Eso fue rápido.").waitFor();
  await page.getByRole("button", { name: "Ajá." }).click();

  await page.getByText("Tu teléfono vibra dos veces.").waitFor();
  await page.getByRole("button", { name: "Voy." }).click();
  await page.getByText("Sabía.").waitFor();
  await page.getByRole("button", { name: "Ya." }).click();

  await page.getByText("No. Ahora espera tú.").waitFor();
  await page.getByRole("button", { name: "Déjalo ahí." }).click();

  const storedState = await page.evaluate(() => window.localStorage.getItem("mara_launch_state_v1"));
  assert(storedState, "Launch experience did not persist state");
  const parsedState = JSON.parse(storedState);
  assert(parsedState.completed === true, "Launch experience did not persist completed state");
  assert(parsedState.outfitChoice === "black", "Outfit consequence was not persisted");
  assert(parsedState.poseChoice === "pose_a", "Visual preference was not persisted locally");
  assert(parsedState.barChoice === "approach", "Bar behavior was not persisted");
  assert(parsedState.messageChoice === "follow", "Message behavior was not persisted");
  assert(parsedState.signals?.approaches === 1, "Approach signal was not persisted");
  assert(parsedState.signals?.follows === 1, "Follow signal was not persisted");
  assert(typeof parsedState.firstSeenAt === "string", "Launch experience did not persist firstSeenAt locally");

  const returningTelemetryPromise = page.waitForRequest((request) => {
    if (request.url() !== `${baseUrl}/api/telemetry` || request.method() !== "POST") return false;
    try {
      return request.postDataJSON()?.event === "returning_user";
    } catch {
      return false;
    }
  });

  await page.reload({ waitUntil: "networkidle" });
  const returningTelemetry = await returningTelemetryPromise;
  const returningPayload = returningTelemetry.postDataJSON();
  assert(returningPayload?.properties?.return_count_bucket === "1", "First return must emit return_count_bucket=1");
  assert(returningPayload?.properties?.days_since_first_bucket === "same_day", "Immediate smoke return must emit days_since_first_bucket=same_day");
  assert(returningPayload?.properties?.entry_source === "ig", "Session source attribution must persist as entry_source=ig");
  assert(!("campaign" in (returningPayload?.properties ?? {})), "Arbitrary campaign query data must not leave the browser");
  assert(!("anonymous_id" in (returningPayload?.properties ?? {})), "Return telemetry must not contain an anonymous identifier");

  await page.getByText("Volviste.").waitFor();
  await page.getByText(/La última vez te dije “ven” y viniste/).waitFor();
  await page.getByText(/Solo me acuerdo/).waitFor();
  await assertMaraImageLoaded(page, "return");
  await page.getByRole("button", { name: "Métete." }).click();
  await page.getByText("Estoy por saltarme el último ejercicio.").waitFor();
  await page.getByRole("button", { name: "Termínalo." }).click();
  await page.getByText("Pesado. Ya. Lo termino.").waitFor();
  await page.getByRole("button", { name: "Déjalo ahí." }).click();
  await assertNoHorizontalOverflow(page, "/experience return");

  for (const path of labPaths) {
    const response = await context.request.get(`${baseUrl}${path}`);
    assert(response.status() === 404, `${path} should be 404 in production but returned ${response.status()}`);
  }

  const allowedTelemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: {
      event: "returning_user",
      properties: {
        surface: "launch_smoke",
        entry_source: "x",
        return_count_bucket: "3-4",
        days_since_first_bucket: "3-7d",
      },
      timestamp: new Date().toISOString(),
    },
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
