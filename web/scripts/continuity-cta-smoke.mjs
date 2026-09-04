import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
});
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await passAgeGate(page);

  assert(await page.getByTestId("dm-continuity-cta").count() === 0, "Continuity CTA must not appear before Mara delivers value");

  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  assert(await page.getByTestId("dm-continuity-cta").count() === 0, "Continuity CTA must not appear on ritual exposure");

  await page.getByRole("button", { name: "Hecho" }).click();
  await page.getByText(/No me mandes prueba. Te creo/).waitFor();
  await page.getByTestId("dm-continuity-cta").waitFor();
  await page.getByRole("button", { name: "¿Quieres que me acuerde?" }).click();
  await page.waitForURL(/\/auth$/, { timeout: 10000 });
  await page.getByText(/¿Quieres que me acuerde\?|Volviste\./).waitFor();

  const dismissPage = await context.newPage();
  await dismissPage.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await passAgeGate(dismissPage);
  await dismissPage.evaluate(() => window.localStorage.removeItem("mara_dm_state_v1"));
  await dismissPage.reload({ waitUntil: "networkidle" });
  await dismissPage.getByRole("button", { name: "Entrar" }).click();
  await dismissPage.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  await dismissPage.getByRole("button", { name: "Hecho" }).click();
  await dismissPage.getByTestId("dm-continuity-cta").waitFor();
  await dismissPage.getByRole("button", { name: "Ahora no" }).first().click();
  assert(await dismissPage.getByTestId("dm-continuity-cta").count() === 0, "Dismissed continuity CTA must not keep nagging in the same state");
  await dismissPage.getByRole("button", { name: "Hoy manda tú" }).waitFor();

  console.log("MARA_CONTINUITY_CTA_SMOKE PASS");
} finally {
  await browser.close();
}