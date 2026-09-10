import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const protectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
const publicPaths = ["/", "/make-it-happen", "/creators", "/shop", "/library", "/activity", "/creator", "/world/sofi"];
const labPaths = [
  "/experience/caprichos-lab",
  "/experience/commerce-lab",
  "/experience/creator-os-lab",
  "/experience/demand-marketplace-lab",
  "/experience/economics-lab",
  "/experience/media-companion-lab",
  "/experience/orchestration-lab",
  "/experience/revenue-engine-lab",
  "/experience/rituals-lab",
  "/experience/segment-lab",
  "/experience/wtp-lab",
];

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

async function maraImageLoaded(page, label) {
  const image = page.locator('img[alt="Mara Vera"]').first();
  await image.waitFor({ state: "visible", timeout: 5_000 });
  await page.waitForFunction(() => {
    const image = document.querySelector('img[alt="Mara Vera"]');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  });
  const source = await image.getAttribute("src");
  assert(source?.includes("mara-v2-reference.webp"), `${label} is not using the founder-approved Mara V2 asset`);
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
  extraHTTPHeaders: protectionBypass
    ? {
        "x-vercel-protection-bypass": protectionBypass,
        "x-vercel-set-bypass-cookie": "true",
      }
    : undefined,
};

const context = await browser.newContext(contextOptions);
const page = await context.newPage();

try {
  const health = await context.request.get(`${baseUrl}/api/health`);
  assert(health.status() === 200, `/api/health returned ${health.status()}`);
  const healthBody = await health.json();
  assert(healthBody?.status === "ok", `/api/health status is ${healthBody?.status}`);
  assert(healthBody?.service === "mara-vera-web", `/api/health service is ${healthBody?.service}`);

  const commerce = await context.request.get(`${baseUrl}/api/commerce/launch`);
  assert(commerce.status() === 200, `/api/commerce/launch returned ${commerce.status()}`);
  const commerceBody = await commerce.json();
  assert(commerceBody?.offers?.fixed?.slug === "private_after_scene_note_v1", "Creator Zero fixed offer contract changed");
  assert(["configured", "not_configured"].includes(commerceBody?.payment?.status), "Payment boundary contract changed");

  const home = await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  assert(home?.status() === 200, `Home returned ${home?.status()}`);
  await passAgeGate(page);
  await page.getByText("Lo que quieres puede empezar aquí", { exact: false }).waitFor({ timeout: 5_000 });
  await noOverflow(page, "/");
  const homeText = await page.locator("body").innerText();
  for (const forbidden of ["No tienes que hablar conmigo todo el día", "cantando con una cuchara", "la noche del chocolate"]) {
    assert(!homeText.includes(forbidden), `Old product framing leaked on home: ${forbidden}`);
  }

  for (const path of publicPaths.slice(1)) {
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    assert(response?.status() === 200, `${path} returned ${response?.status()}`);
    await noOverflow(page, path);
  }

  await page.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await passAgeGate(page);
  await maraImageLoaded(page, "Creator Zero");
  await noOverflow(page, "/experience");
  await page.getByText("Entraste.", { exact: true }).waitFor();
  await page.getByText(/No necesito saber todo de ti todavía/).waitFor();
  await page.getByRole("button", { name: "Dime" }).click();
  await page.getByText("Esta vez marco yo el ritmo.", { exact: true }).waitFor();
  await page.getByText(/Cierra la puerta\. Baja un poco la luz/).waitFor();
  await page.getByRole("button", { name: "Hecho" }).click();
  await page.getByText("Eso pensé.", { exact: true }).waitFor();
  await page.getByText(/Te voy a dejar ver una escena privada/).waitFor();

  const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(stored.started === true, "Creator Zero did not persist started state");
  assert(stored.ritualOffered === true, "Creator Zero did not persist first rule state");
  assert(typeof stored.ritualCompletedAt === "string", "Creator Zero did not persist completed first rule");

  await page.reload({ waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByText("Volviste.", { exact: true }).waitFor();
  await page.getByText(/Me acuerdo de que seguiste mi primera regla/).waitFor();
  assert(await page.getByTestId("dm-private-drop").count() === 0, "Return must not auto-open commerce");

  await page.getByRole("button", { name: "Quiero tu parte" }).click();
  await page.getByText(/eliges cómo te lo cuento/).waitFor();
  await page.getByRole("button", { name: "Directo" }).click();
  await page.getByText("Bien. Sin vueltas.", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Sigue" }).click();
  await page.getByText(/Hasta ahí por hoy/).waitFor();

  const firstPrivate = await page.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(firstPrivate.preferredPrivateStyle === "direct", "Explicit Creator Zero preference was not stored");
  assert(firstPrivate.privateSessionCount === 1, `Expected privateSessionCount=1, got ${firstPrivate.privateSessionCount}`);

  await page.reload({ waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByRole("button", { name: "Quiero tu parte" }).click();
  await page.getByText(/Ya sé que no te gusta que dé vueltas/).waitFor();
  await page.getByRole("button", { name: "Sigue" }).click();
  await page.getByText(/Hay una nota que dejé fuera de esta conversación/).waitFor();
  await page.getByTestId("dm-private-drop").waitFor();

  const secondPrivate = await page.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(secondPrivate.privateSessionCount === 2, `Expected privateSessionCount=2, got ${secondPrivate.privateSessionCount}`);
  assert(typeof secondPrivate.lastPrivateOfferAt === "string", "Commercial cooldown timestamp was not stored");

  await page.getByTestId("dm-private-drop").getByRole("button", { name: "Ahora no" }).click();
  await page.getByText(/Un “ahora no” sigue siendo un no/).waitFor();
  await noOverflow(page, "/experience private moment");

  const stopContext = await browser.newContext(contextOptions);
  const stopPage = await stopContext.newPage();
  await stopPage.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await passAgeGate(stopPage);
  const input = stopPage.getByRole("textbox", { name: "Mensaje para Mara Vera" });
  await input.fill("no");
  await stopPage.getByRole("button", { name: "Enviar" }).click();
  await stopPage.getByText(/Hasta aquí\. Si vuelves, seguimos desde donde tú elegiste parar/).waitFor();
  await stopContext.close();

  for (const path of labPaths) {
    const response = await context.request.get(`${baseUrl}${path}`);
    assert(response.status() === 404, `${path} should remain 404 outside development, got ${response.status()}`);
  }

  const internalQa = await context.request.post(`${baseUrl}/api/internal/qa-user`, {
    data: { action: "create", email: "mara.qa.probe@example.com", password: "not-a-real-proof-password" },
  });
  assert([401, 404].includes(internalQa.status()), `Internal QA route accepted unauthenticated proof action with status ${internalQa.status()}`);

  console.log("MARA_DESIGN_RELEASE_SMOKE PASS");
} finally {
  await context.close();
  await browser.close();
}
