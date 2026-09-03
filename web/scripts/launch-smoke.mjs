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

async function passAgeGate(page) {
  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible().catch(() => false)) {
    await dialog.locator("button").first().click();
  }
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
  await page.getByTestId("dm-private-drop").waitFor();
  await page.getByText("Nota privada de la noche").waitFor();
  await page.getByText(/\$4\.99/).waitFor();
  await page.getByRole("button", { name: "Ahora no" }).click();
  await page.getByText("Está bien. Seguimos hablando igual.").waitFor();
  await assertNoHorizontalOverflow(page, "/experience return");

  const localAfterDismiss = await page.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(localAfterDismiss.dropDismissed === true, "Declining the private drop must persist without freezing the conversation");

  // Simulate a clean second device whose authenticated server memory already contains the ritual completion.
  // No intimate text is transported: the contract contains only a fixed ritual key + completion timestamp.
  const remoteContext = await browser.newContext(contextOptions);
  await remoteContext.route("**/api/relationship/ritual", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ritual: {
            ritualKey: "junk_food_date_v1",
            completedAt: "2026-09-03T20:00:00.000Z",
          },
        }),
      });
      return;
    }
    await route.fulfill({ status: 204, body: "" });
  });

  const remotePage = await remoteContext.newPage();
  await remotePage.goto(`${baseUrl}/experience`, { waitUntil: "domcontentloaded" });
  await passAgeGate(remotePage);
  await remotePage.getByText("Volviste.").waitFor();
  await remotePage.getByText(/me acuerdo de la hamburguesa, las papas y el chocolate/).waitFor();
  const remoteState = await remotePage.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(remoteState.ritualCompletedAt === "2026-09-03T20:00:00.000Z", "Remote ritual memory did not hydrate into the DM cache");
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

  const rejectedTelemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: { event: "raw_intimate_text", properties: { text: "must-not-log" } },
  });
  assert(rejectedTelemetry.status() === 400, `Unknown telemetry event should be rejected, got ${rejectedTelemetry.status()}`);

  console.log("MARA_LAUNCH_SMOKE PASS");
} finally {
  await browser.close();
}
