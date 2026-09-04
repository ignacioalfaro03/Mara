import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const publicPaths = ["/", "/meet-mara", "/legal"];
const parkedPaths = ["/premium"];
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

async function passAgeGate(page) {
  const alreadyPassed = await page
    .evaluate(() => window.localStorage.getItem("mara_age_gate_passed") === "true")
    .catch(() => false);
  if (alreadyPassed) return;

  const confirm = page.getByRole("button", { name: "Sí, tengo 18+" });
  await confirm.waitFor({ state: "visible", timeout: 5000 });
  await confirm.click();
  await page.getByRole("dialog").waitFor({ state: "detached", timeout: 5000 }).catch(() => undefined);
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
};
const context = await browser.newContext(contextOptions);
const page = await context.newPage();

try {
  const health = await context.request.get(`${baseUrl}/api/health`);
  assert(health.status() === 200, `/api/health returned ${health.status()}`);
  const healthBody = await health.json();
  assert(healthBody?.status === "ok", `/api/health status is ${healthBody?.status}`);
  assert(healthBody?.service === "mara-vera-web", `/api/health service is ${healthBody?.service}`);
  assert(healthBody?.release === "public-alpha", `/api/health release is ${healthBody?.release}`);

  const memoryHealth = await context.request.get(`${baseUrl}/api/health-memory`);
  assert(memoryHealth.status() === 200, `/api/health-memory returned ${memoryHealth.status()}`);
  const memoryHealthBody = await memoryHealth.json();
  assert(typeof memoryHealthBody?.configured === "boolean", "Memory health must expose configured boolean");

  const commerceLaunch = await context.request.get(`${baseUrl}/api/commerce/launch`);
  assert(commerceLaunch.status() === 200, `/api/commerce/launch returned ${commerceLaunch.status()}`);
  const commerceLaunchBody = await commerceLaunch.json();
  assert(commerceLaunchBody?.offers?.fixed?.slug === "private_after_scene_note_v1", "Launch commerce fixed offer missing");
  assert(commerceLaunchBody?.offers?.fixed?.amountMinor === 499, "Launch fixed offer must remain USD 4.99 in minor units");
  assert(["configured", "not_configured"].includes(commerceLaunchBody?.payment?.status), "Commerce provider status contract changed");

  const authPage = await context.request.get(`${baseUrl}/auth`);
  assert(authPage.status() === 200, `/auth returned ${authPage.status()}`);

  if (!memoryHealthBody.configured) {
    const ritualRead = await context.request.get(`${baseUrl}/api/relationship/ritual`);
    assert(ritualRead.status() === 503, `Backendless ritual read should return 503, got ${ritualRead.status()}`);
    const privateMomentRead = await context.request.get(`${baseUrl}/api/relationship/private-moment`);
    assert(privateMomentRead.status() === 503, `Backendless private moment read should return 503, got ${privateMomentRead.status()}`);
  }

  const home = await page.goto(`${baseUrl}/?src=ig&campaign=must-not-leak`, { waitUntil: "networkidle" });
  assert(home?.status() === 200, `Home returned ${home?.status()}`);
  await passAgeGate(page);
  await page.getByText("Llegaste justo.").waitFor();
  await assertMaraImageLoaded(page, "home");
  await assertNoHorizontalOverflow(page, "/");

  for (const path of publicPaths.slice(1)) {
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    assert(response?.status() === 200, `${path} returned ${response?.status()}`);
    await assertNoHorizontalOverflow(page, path);
  }

  for (const path of parkedPaths) {
    const response = await context.request.get(`${baseUrl}${path}`);
    assert(response.status() === 404, `${path} is parked and should return 404, got ${response.status()}`);
  }

  await page.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await passAgeGate(page);
  await assertNoHorizontalOverflow(page, "/experience");
  await assertMaraImageLoaded(page, "dm experience");
  await page.getByText("No quiero que esto se sienta como una app. Háblame aquí.").waitFor();
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByText("Hoy mando yo un poco.").waitFor();
  await page.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  await page.getByRole("button", { name: "Hecho" }).click();
  await page.getByText(/No me mandes prueba. Te creo/).waitFor();

  const storedState = await page.evaluate(() => window.localStorage.getItem("mara_dm_state_v1"));
  assert(storedState, "DM experience did not persist local continuity");
  const parsedState = JSON.parse(storedState);
  assert(parsedState.started === true, "DM experience did not persist started state");
  assert(parsedState.ritualOffered === true, "DM experience did not persist ritual offer state");
  assert(typeof parsedState.ritualCompletedAt === "string", "DM ritual completion was not persisted locally");

  await page.reload({ waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByText("Volviste.").waitFor();
  await page.getByText(/me acuerdo de la hamburguesa, las papas y el chocolate/).waitFor();
  assert(await page.getByTestId("dm-private-drop").count() === 0, "Return callback must not auto-open commerce anymore");

  await page.getByRole("button", { name: "Hoy manda tú" }).click();
  await page.getByText(/no vas a navegar un catálogo/).waitFor();
  await page.getByRole("button", { name: "Directo" }).click();
  await page.getByText("Bien. Directo.").waitFor();
  await page.getByRole("button", { name: "Ya" }).click();
  await page.getByText("Ya. Por hoy queda ahí.").waitFor();
  assert(await page.getByTestId("dm-private-drop").count() === 0, "First private moment must keep commerce closed");

  const firstPrivateState = await page.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(firstPrivateState.preferredPrivateStyle === "direct", "Explicit private style was not stored locally");
  assert(firstPrivateState.privateSessionCount === 1, `Expected first private session count=1, got ${firstPrivateState.privateSessionCount}`);

  await page.reload({ waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByRole("button", { name: "Hoy manda tú" }).waitFor();
  await page.getByRole("button", { name: "Hoy manda tú" }).click();
  await page.getByText(/Ya sé que prefieres que vaya directo/).waitFor();
  await page.getByRole("button", { name: "Ya" }).click();
  await page.getByText("Esta vez sí te dejé algo aparte.").waitFor();
  await page.getByTestId("dm-private-drop").waitFor();
  await page.getByText("Nota privada de la noche").waitFor();
  await page.getByText(/\$4\.99/).waitFor();

  const secondPrivateState = await page.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(secondPrivateState.privateSessionCount === 2, `Expected second private session count=2, got ${secondPrivateState.privateSessionCount}`);
  assert(typeof secondPrivateState.lastPrivateOfferAt === "string", "Offer view must create a local cooldown timestamp");

  await page.getByTestId("dm-private-drop").getByRole("button", { name: "Ahora no" }).click();
  await page.getByText("No pasa nada. Seguimos igual.").waitFor();
  await assertNoHorizontalOverflow(page, "/experience private moment");

  const remoteContext = await browser.newContext(contextOptions);
  await remoteContext.route("**/api/relationship/ritual", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ritual: { ritualKey: "junk_food_date_v1", completedAt: "2026-09-03T20:00:00.000Z" } }),
      });
      return;
    }
    await route.fulfill({ status: 204, body: "" });
  });
  await remoteContext.route("**/api/relationship/private-moment", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          privateMoment: {
            preferredStyle: "slow",
            sessionCount: 2,
            lastSessionAt: "2026-09-03T20:30:00.000Z",
            lastOfferAt: null,
            commercial: { decision: "offer_now", reason: "repeat_session_context" },
          },
        }),
      });
      return;
    }
    await route.fulfill({ status: 204, contentType: "application/json", body: "{}" });
  });

  const remotePage = await remoteContext.newPage();
  await remotePage.goto(`${baseUrl}/experience`, { waitUntil: "domcontentloaded" });
  await passAgeGate(remotePage);
  await remotePage.getByText("Volviste.").waitFor();
  await remotePage.waitForFunction(() => {
    const raw = window.localStorage.getItem("mara_dm_state_v1");
    if (!raw) return false;
    return JSON.parse(raw).preferredPrivateStyle === "slow";
  });
  await remotePage.getByRole("button", { name: "Hoy manda tú" }).click();
  await remotePage.getByText(/Ya sé que prefieres ir con calma/).waitFor();
  const remoteState = await remotePage.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(remoteState.ritualCompletedAt === "2026-09-03T20:00:00.000Z", "Remote ritual memory did not hydrate into the DM cache");
  assert(remoteState.preferredPrivateStyle === "slow", "Remote private preference did not hydrate into the DM cache");
  assert(remoteState.privateSessionCount === 2, "Remote private session count did not hydrate into the DM cache");
  await remoteContext.close();

  for (const path of labPaths) {
    const response = await context.request.get(`${baseUrl}${path}`);
    assert(response.status() === 404, `${path} should be 404 in production but returned ${response.status()}`);
  }

  const allowedTelemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: {
      event: "commerce_checkout_blocked",
      properties: {
        surface: "launch_smoke",
        entry_source: "x",
        offer_slug: "private_after_scene_note_v1",
        offer_type: "fixed_unlock",
        amount_bucket: "under_5",
        currency: "USD",
        provider_status: "not_configured",
      },
      timestamp: new Date().toISOString(),
    },
  });
  assert(allowedTelemetry.status() === 200, `Allowed telemetry returned ${allowedTelemetry.status()}`);

  for (const event of [
    "session_started",
    "cta_clicked",
    "first_interaction",
    "memory_recall_rendered",
    "memory_recall_engaged",
    "first_preference_signal",
    "preference_updated",
    "offer_viewed",
    "offer_clicked",
    "paywall_impression",
    "ritual_viewed",
    "ritual_skipped",
    "commercial_offer_dismissed",
    "commercial_post_offer_continued",
  ]) {
    const response = await context.request.post(`${baseUrl}/api/telemetry`, {
      data: {
        event,
        properties: {
          surface: "launch_smoke",
          target: "junk_food_date_v1",
          entry_source: "direct",
        },
        timestamp: new Date().toISOString(),
      },
    });
    assert(response.status() === 200, `${event} telemetry returned ${response.status()}`);
  }

  const internalLaunch = await context.request.get(`${baseUrl}/api/internal/launch`);
  assert([401, 404].includes(internalLaunch.status()), `Internal launch summary must be protected, got ${internalLaunch.status()}`);

  const rejectedTelemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: { event: "raw_intimate_text", properties: { text: "must-not-log" } },
  });
  assert(rejectedTelemetry.status() === 400, `Unknown telemetry event should be rejected, got ${rejectedTelemetry.status()}`);

  console.log("MARA_LAUNCH_SMOKE PASS");
} finally {
  await browser.close();
}
