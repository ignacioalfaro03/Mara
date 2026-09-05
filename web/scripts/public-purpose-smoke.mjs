import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function passAgeGate(page) {
  const passed = await page.evaluate(() => window.localStorage.getItem("mara_age_gate_passed") === "true").catch(() => false);
  if (passed) return;
  const confirm = page.getByRole("button", { name: "Sí, tengo 18+" });
  await confirm.waitFor({ state: "visible", timeout: 5000 });
  await confirm.click();
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
  const premium = await context.request.get(`${baseUrl}/premium`);
  assert(premium.status() === 404, `/premium is parked and must stay 404, got ${premium.status()}`);

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByText(/Tengo una idea para esta noche/).waitFor();
  await page.getByText(/Si no te tinca, me dices que no/).waitFor();
  await page.getByRole("link", { name: "A ver." }).click();
  await page.waitForURL(/\/experience/);
  await page.getByText("No quiero que esto se sienta como una app. Háblame aquí.").waitFor();
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByText("Hoy mando yo un poco.").waitFor();
  await page.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();

  const meetContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: "es-CL",
  });
  const meetPage = await meetContext.newPage();
  await meetPage.goto(`${baseUrl}/meet-mara`, { waitUntil: "networkidle" });
  await passAgeGate(meetPage);
  await meetPage.getByText(/Te propongo algo concreto/).waitFor();
  await meetPage.getByText(/no parto de cero/).waitFor();
  assert(await meetPage.getByText(/café frío/i).count() === 0, "Meet Mara must not invent current-day coffee lore");
  assert(await meetPage.getByText(/gym/i).count() === 0, "Meet Mara must not invent current-day gym lore");
  await meetPage.getByRole("link", { name: "Ven. A ver." }).click();
  await meetPage.waitForURL(/\/experience/);
  await meetPage.getByText("No quiero que esto se sienta como una app. Háblame aquí.").waitFor();
  await meetContext.close();

  const telemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: {
      event: "hero_cta_click",
      properties: {
        surface: "meet_mara",
        placement: "top",
        target: "launch_experience",
        entry_source: "direct",
      },
      timestamp: new Date().toISOString(),
    },
  });
  assert(telemetry.status() === 200, `Meet Mara CTA telemetry returned ${telemetry.status()}`);

  console.log("MARA_PUBLIC_PURPOSE_SMOKE PASS");
} finally {
  await browser.close();
}
