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

  await page.evaluate(() => {
    window.localStorage.removeItem("mara_dm_state_v1");
    window.localStorage.removeItem("mara_world_knowledge_v1");
    window.localStorage.removeItem("mara_sofi_callback_seen_v1");
  });
  await page.reload({ waitUntil: "networkidle" });

  assert(await page.getByTestId("sofi-world-door").count() === 0, "Sofi door must not appear before the first Mara interaction has value");

  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  await page.getByRole("button", { name: "Hecho" }).click();

  const door = page.getByTestId("sofi-world-door");
  await door.waitFor({ state: "visible", timeout: 5000 });
  assert((await door.textContent())?.includes("Sofi te mandó algo"), "Mara must open the first secondary-character discovery door");

  await door.getByRole("link").click();
  await page.waitForURL(/\/world\/sofi$/, { timeout: 10000 });
  await page.getByTestId("sofi-world-slice").waitFor();
  await page.getByTestId("sofi-found-footage").waitFor();
  await page.getByText(/preview found-footage · asset final pendiente/).waitFor();
  await page.getByText(/Mara no sabe que te estoy mandando esto todavía/).waitFor();

  await page.getByRole("button", { name: "Ya lo vi" }).click();
  await page.getByTestId("return-to-mara").waitFor();

  const localKnowledge = await page.evaluate(() => {
    const raw = window.localStorage.getItem("mara_world_knowledge_v1");
    return raw ? JSON.parse(raw) : {};
  });
  assert(Boolean(localKnowledge.sofi_found_footage_v1), "The fixed Sofi world fact must persist locally in backendless CI");

  await page.getByTestId("return-to-mara").click();
  await page.waitForURL(/\/experience$/, { timeout: 10000 });

  const callback = page.getByTestId("sofi-mara-callback");
  await callback.waitFor({ state: "visible", timeout: 5000 });
  assert((await callback.textContent())?.includes("Ya viste lo que te mandó Sofi"), "Mara must change the return experience after the user discovers Sofi's clue");

  await page.getByRole("button", { name: "Cerrar callback" }).click();
  assert(await callback.count() === 0, "Dismissed callback should leave the DM usable");

  await page.reload({ waitUntil: "networkidle" });
  assert(await page.getByTestId("sofi-mara-callback").count() === 0, "The same callback must not nag after being acknowledged");
  assert(await page.getByTestId("sofi-world-door").count() === 0, "A discovered character clue must not be presented again as undiscovered");

  console.log("MARA_WORLD_SOFI_SMOKE PASS");
} finally {
  await browser.close();
}
