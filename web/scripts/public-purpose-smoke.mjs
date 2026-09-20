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

  const anonymousPremiumAsset = await context.request.get(`${baseUrl}/api/commerce/content/night-note`);
  assert(anonymousPremiumAsset.status() === 401, `premium asset must require auth, got ${anonymousPremiumAsset.status()}`);

  // Founder contract V3: Home sells the Creator Site thesis. Legacy commerce remains regression evidence only.
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByRole("heading", { name: "Convierte tu audiencia en un negocio mejor." }).waitFor();
  await page.getByRole("link", { name: "Crear mi sitio en Mara" }).waitFor();
  await page.getByText("MARA.COM/TU-NOMBRE").waitFor();

  await page.goto(`${baseUrl}/shop`, { waitUntil: "networkidle" });
  await page.getByText(/Empieza por algo pequeño/).waitFor();
  await page.getByText("La nota de esta noche").waitFor();
  await page.getByText("US$4.99").waitFor();

  await page.getByRole("link", { name: "Ver experiencia" }).click();
  await page.waitForURL(/\/shop\/night-note$/);
  await page.getByRole("heading", { name: "La nota de esta noche" }).waitFor();
  await page.getByText("Aún no disponible").waitFor();
  assert(await page.getByRole("button", { name: "Desbloquear" }).count() === 0, "checkout must stay closed until private fulfillment is explicitly ready");

  // Library must derive ownership from server truth. Anonymous visitors are asked to authenticate.
  await page.goto(`${baseUrl}/library`, { waitUntil: "networkidle" });
  await page.getByText(/Tu acceso vive en tu cuenta/).waitFor();
  await page.getByRole("link", { name: "Crear cuenta o entrar" }).waitFor();

  // Legacy Mara Vera interaction remains isolated as prototype evidence and is not linked from the canonical Home.
  await page.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await page.getByText("Tengo una idea. Tú acomódate; yo pongo la historia.").waitFor();
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
  await meetPage.getByText("Tengo una idea. Tú acomódate; yo pongo la historia.").waitFor();
  await meetContext.close();

  const telemetry = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: {
      event: "hero_cta_click",
      properties: {
        surface: "home",
        placement: "primary",
        target: "storefront",
        entry_source: "direct",
      },
      timestamp: new Date().toISOString(),
    },
  });
  assert(telemetry.status() === 200, `Storefront CTA telemetry returned ${telemetry.status()}`);

  console.log("MARA_PUBLIC_PURPOSE_SMOKE PASS");
} finally {
  await browser.close();
}
