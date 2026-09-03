import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL;
const qaEmail = process.env.QA_EMAIL;
const qaPassword = process.env.QA_PASSWORD;

if (!baseUrl || !qaEmail || !qaPassword) {
  throw new Error("BASE_URL, QA_EMAIL and QA_PASSWORD are required");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function acceptAgeGate(page) {
  const dialog = page.getByRole("dialog");
  try {
    await dialog.waitFor({ state: "visible", timeout: 6000 });
    await dialog.locator("button").first().click();
    await dialog.waitFor({ state: "hidden", timeout: 6000 }).catch(() => {});
  } catch {
    // The gate may already be accepted in this browser context.
  }
}

async function getRelationship(page) {
  return page.evaluate(async () => {
    const response = await fetch("/api/relationship", { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    return { status: response.status, body };
  });
}

async function waitForRelationship(page, predicate, label, timeoutMs = 30000) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeoutMs) {
    last = await getRelationship(page);
    if (last.status === 200 && predicate(last.body?.state)) return last.body.state;
    await page.waitForTimeout(500);
  }
  throw new Error(`${label} timed out; last=${JSON.stringify(last)}`);
}

async function signIn(page) {
  await page.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  await acceptAgeGate(page);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByLabel("Correo").fill(qaEmail);
  await page.getByLabel("Contraseña").fill(qaPassword);
  await page.getByRole("button", { name: "Seguir", exact: true }).click();
  await page.waitForURL(/\/experience\?account=ready/, { timeout: 30000 });
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
};

let contextA;
let contextB;
let contextC;

try {
  const probeContext = await browser.newContext(contextOptions);
  const memoryHealth = await probeContext.request.get(`${baseUrl}/api/health-memory`);
  assert(memoryHealth.status() === 200, `/api/health-memory returned ${memoryHealth.status()}`);
  const memoryBody = await memoryHealth.json();
  assert(memoryBody?.configured === true, "Hosted preview memory backend is not configured");
  await probeContext.close();

  // Browser A: play before registration and create a literal private preference.
  contextA = await browser.newContext(contextOptions);
  const pageA = await contextA.newPage();
  await pageA.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await acceptAgeGate(pageA);
  await pageA.getByText("Llegaste justo.").waitFor();
  await pageA.getByRole("button", { name: "Métete." }).click();
  await pageA.getByText("Negro o crema.").waitFor();
  await pageA.getByRole("button", { name: "Negro." }).click();
  await pageA.getByText("Obvio.").waitFor();
  await pageA.getByRole("button", { name: "Espera." }).click();
  await pageA.getByText("¿Cuál te gusta más?").waitFor();
  await pageA.getByRole("button", { name: "Elegir la segunda foto de Mara" }).click();
  await pageA.getByText("La segunda. Mmm.").waitFor();
  await pageA.getByRole("button", { name: "Ahora sí." }).click();
  await pageA.getByText("Te pillé mirando.").waitFor();
  await pageA.getByRole("button", { name: "Voy hacia ti." }).click();
  await pageA.getByText("Eso fue rápido.").waitFor();
  await pageA.getByRole("button", { name: "Ajá." }).click();
  await pageA.getByText("Tu teléfono vibra dos veces.").waitFor();
  await pageA.getByRole("button", { name: "Voy." }).click();
  await pageA.getByText("Sabía.").waitFor();
  await pageA.getByRole("button", { name: "Ya." }).click();
  await pageA.getByText("No. Ahora espera tú.").waitFor();
  await pageA.getByRole("button", { name: "Déjalo ahí." }).click();

  const anonymousState = JSON.parse(
    await pageA.evaluate(() => window.localStorage.getItem("mara_launch_state_v1")),
  );
  assert(anonymousState?.completed === true, "Anonymous session did not complete");
  assert(anonymousState?.poseChoice === "pose_b", "Anonymous pose_b choice was not kept locally");

  await pageA.getByRole("link", { name: "Haz que me acuerde" }).waitFor({ timeout: 10000 });
  await pageA.getByRole("link", { name: "Haz que me acuerde" }).click();
  await pageA.getByText("¿Quieres que me acuerde?").waitFor();
  await pageA.getByLabel("Correo").fill(qaEmail);
  await pageA.getByLabel("Contraseña").fill(qaPassword);
  await pageA.getByLabel("Confirmo que tengo 18 años o más.").check();
  await pageA.getByRole("button", { name: "Que te acuerdes" }).click();

  let accountReady = false;
  try {
    await pageA.waitForURL(/\/experience\?account=ready/, { timeout: 10000 });
    accountReady = true;
  } catch {
    const confirmation = pageA.getByText(/Revisa tu correo para confirmar la cuenta/i);
    await confirmation.waitFor({ timeout: 5000 });
    console.log(`MARA_QA_WAITING_CONFIRMATION email=${qaEmail}`);
    console.log("MARA_QA_CONFIRMATION_BYPASS_FOR_E2E_REQUIRED");

    await pageA.getByRole("button", { name: "Entrar", exact: true }).click();
    await pageA.getByLabel("Correo").fill(qaEmail);
    await pageA.getByLabel("Contraseña").fill(qaPassword);

    const deadline = Date.now() + 8 * 60 * 1000;
    while (Date.now() < deadline) {
      const button = pageA.getByRole("button", { name: "Seguir", exact: true });
      await button.waitFor({ state: "visible" });
      await button.click();
      try {
        await pageA.waitForURL(/\/experience\?account=ready/, { timeout: 5000 });
        accountReady = true;
        break;
      } catch {
        await pageA.waitForTimeout(5000);
      }
    }
  }

  assert(accountReady, "QA account was not confirmed within the E2E wait window");
  await pageA.getByText("Volviste.").waitFor({ timeout: 15000 });

  const persisted = await waitForRelationship(
    pageA,
    (state) => state?.launchCompleted === true && state?.lastVisualChoice === "pose_b",
    "initial hosted relationship persistence",
  );
  assert(persisted.returnCount === 0, `Initial returnCount expected 0, got ${persisted.returnCount}`);

  const signout = await pageA.evaluate(async () => {
    const response = await fetch("/api/auth/signout", { method: "POST" });
    return response.status;
  });
  assert(signout === 204, `Signout expected 204, got ${signout}`);
  const signedOut = await pageA.evaluate(async () => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    return response.json();
  });
  assert(signedOut?.authenticated === false, "Browser A remained authenticated after signout");
  await contextA.close();
  contextA = null;

  // Browser B: no Mara localStorage. The callback must therefore come from server memory.
  contextB = await browser.newContext(contextOptions);
  const pageB = await contextB.newPage();
  await signIn(pageB);
  await pageB.getByText("Volviste.").waitFor({ timeout: 15000 });
  await pageB.getByText("La última vez te quedaste con la segunda. Sí, me fijé.").waitFor({ timeout: 15000 });
  await pageB.getByText(/Solo me acuerdo/).waitFor();

  const hydratedRaw = await pageB.evaluate(() => window.localStorage.getItem("mara_launch_state_v1"));
  assert(hydratedRaw, "Browser B did not hydrate remote memory into its local cache");
  const hydrated = JSON.parse(hydratedRaw);
  assert(hydrated.completed === true, "Browser B did not hydrate launch completion");
  assert(hydrated.poseChoice === "pose_b", `Browser B expected pose_b, got ${hydrated.poseChoice}`);

  await pageB.getByRole("button", { name: "Métete." }).click();
  const afterReturn = await waitForRelationship(
    pageB,
    (state) => state?.returnCount >= 1 && state?.lastVisualChoice === "pose_b" && state?.launchCompleted === true,
    "hosted return increment",
  );
  assert(afterReturn.returnCount >= 1, "Return count did not increment on Browser B");
  await contextB.close();
  contextB = null;

  // Browser C: authenticated stale snapshot must not degrade newer server truth.
  contextC = await browser.newContext(contextOptions);
  const pageC = await contextC.newPage();
  await signIn(pageC);
  await pageC.getByText("Volviste.").waitFor({ timeout: 15000 });
  const beforeStale = await waitForRelationship(pageC, (state) => state?.returnCount >= 1, "state before stale write");
  const staleFirstSeenAt = beforeStale.firstSeenAt ?? new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const staleWrite = await pageC.evaluate(async ({ firstSeenAt }) => {
    const response = await fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        returnCount: 0,
        firstSeenAt,
        lastSeenAt: firstSeenAt,
        lastVisualChoice: "pose_a",
        launchCompleted: false,
      }),
    });
    return response.status;
  }, { firstSeenAt: staleFirstSeenAt });
  assert(staleWrite === 204, `Stale relationship write returned ${staleWrite}`);

  const afterStale = await waitForRelationship(
    pageC,
    (state) => state?.returnCount >= 1 && state?.lastVisualChoice === "pose_b" && state?.launchCompleted === true,
    "monotonic hosted relationship merge",
  );
  assert(afterStale.returnCount >= beforeStale.returnCount, "Stale write reduced return_count");
  assert(afterStale.lastVisualChoice === "pose_b", "Stale write replaced the server visual preference");
  assert(afterStale.launchCompleted === true, "Stale write reverted launch_completed");

  console.log("MARA_HOSTED_MEMORY_E2E PASS");
  console.log(`MARA_QA_EMAIL=${qaEmail}`);
} finally {
  if (contextA) await contextA.close().catch(() => {});
  if (contextB) await contextB.close().catch(() => {});
  if (contextC) await contextC.close().catch(() => {});
  await browser.close();
}
