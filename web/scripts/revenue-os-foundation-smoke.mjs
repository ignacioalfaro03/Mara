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
  if (await confirm.count()) {
    await confirm.waitFor({ state: "visible", timeout: 5000 });
    await confirm.click();
    await page.getByRole("dialog").waitFor({ state: "detached", timeout: 5000 }).catch(() => undefined);
  }
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

  const root = await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  assert(root?.status() === 200, `Home returned ${root?.status()}`);
  await passAgeGate(page);
  await page.getByText("Convierte seguidores en clientes recurrentes.").waitFor();
  await page.getByText("Audience → Customers → Intelligence → Revenue").waitFor();
  assert((await page.getByText("Mara Vera", { exact: false }).count()) === 0, "Revenue OS root must not present Mara Vera as product identity");
  assert((await page.locator('img[alt="Mara Vera"]').count()) === 0, "Revenue OS root must not render the legacy Mara Vera hero asset");
  assert((await page.getByRole("link", { name: "Para creadores" }).count()) >= 1, "Public navigation must expose creator acquisition");
  assert((await page.getByRole("link", { name: "Creator OS" }).count()) >= 1, "Public navigation must expose Creator OS");
  await assertNoHorizontalOverflow(page, "/");

  const creators = await page.goto(`${baseUrl}/creators`, { waitUntil: "networkidle" });
  assert(creators?.status() === 200, `/creators returned ${creators?.status()}`);
  await passAgeGate(page);
  await page.getByText("Gana más con la audiencia que ya tienes.").waitFor();
  await page.getByText("Necesitas saber qué vender, a quién y qué hacer después.").waitFor();
  assert((await page.getByText("TU WORLD ES UN NEGOCIO", { exact: false }).count()) === 0, "Creator acquisition must not use deprecated World-first positioning");
  await assertNoHorizontalOverflow(page, "/creators");

  const creatorOs = await page.goto(`${baseUrl}/creator`, { waitUntil: "networkidle" });
  assert(creatorOs?.status() === 200, `/creator returned ${creatorOs?.status()}`);
  await passAgeGate(page);
  await page.getByText("Tu negocio, tus clientes y tu siguiente oportunidad.").waitFor();
  await page.getByText("MARA · CREATOR REVENUE OS").waitFor();
  await assertNoHorizontalOverflow(page, "/creator");

  const title = await page.title();
  assert(title.includes("Mara"), `Unexpected document title: ${title}`);

  console.log("MARA_REVENUE_OS_FOUNDATION_SMOKE PASS");
} finally {
  await browser.close();
}
