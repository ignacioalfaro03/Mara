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
    await dialog.waitFor({ state: "visible", timeout: 5000 });
    await dialog.locator("button").first().click();
    await dialog.waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
  } catch {
    // Already accepted or not present on this route.
  }
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
    await page.waitForTimeout(400);
  }
  throw new Error(`${label} timed out; last=${JSON.stringify(last)}`);
}

async function signOut(page) {
  const result = await page.evaluate(async () => {
    const response = await fetch("/api/auth/signout", { method: "POST" });
    const me = await fetch("/api/auth/me", { cache: "no-store" });
    return { signoutStatus: response.status, me: await me.json() };
  });
  assert(result.signoutStatus === 204, `Signout expected 204, got ${result.signoutStatus}`);
  assert(result.me?.authenticated === false, "Session remained authenticated after signout");
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
};

let browserB;
let browserC;

try {
  const probe = await browser.newContext(contextOptions);
  const health = await probe.request.get(`${baseUrl}/api/health-memory`);
  assert(health.status() === 200, `/api/health-memory returned ${health.status()}`);
  const healthBody = await health.json();
  assert(healthBody?.configured === true, "Real Supabase memory backend is not configured");
  await probe.close();

  // Browser B starts with no Mara local storage. Everything it knows must arrive from the account.
  browserB = await browser.newContext(contextOptions);
  const pageB = await browserB.newPage();
  await signIn(pageB);
  await pageB.getByText("Volviste.").waitFor({ timeout: 15000 });
  await pageB.getByText(/La última vez elegiste una foto/).waitFor({ timeout: 15000 });
  await pageB.getByText(/Solo me acuerdo/).waitFor();

  const hydratedRaw = await pageB.evaluate(() => window.localStorage.getItem("mara_launch_state_v1"));
  assert(hydratedRaw, "Clean Browser B did not hydrate server relationship memory");
  const hydrated = JSON.parse(hydratedRaw);
  assert(hydrated.completed === true, "Browser B did not hydrate launch_completed");
  assert(hydrated.returnCount === 4, `Browser B expected returnCount 4, got ${hydrated.returnCount}`);
  assert(hydrated.poseChoice === "pose_b", `Browser B expected pose_b, got ${hydrated.poseChoice}`);

  await pageB.getByRole("button", { name: "Métete." }).click();
  await pageB.waitForFunction(() => {
    const raw = window.localStorage.getItem("mara_launch_state_v1");
    return raw ? JSON.parse(raw).returnCount === 5 : false;
  });

  const afterReturn = await waitForRelationship(
    pageB,
    (state) => state?.returnCount === 5 && state?.lastVisualChoice === "pose_b" && state?.launchCompleted === true,
    "real Browser B 4→5 continuation",
  );
  assert(afterReturn.returnCount === 5, `Server return count expected 5, got ${afterReturn.returnCount}`);
  await signOut(pageB);
  await browserB.close();
  browserB = null;

  // Browser C also starts clean, then deliberately submits an older snapshot.
  browserC = await browser.newContext(contextOptions);
  const pageC = await browserC.newPage();
  await signIn(pageC);
  await pageC.getByText("Volviste.").waitFor({ timeout: 15000 });
  const beforeStale = await waitForRelationship(pageC, (state) => state?.returnCount === 5, "state before stale write");
  const staleFirstSeenAt = beforeStale.firstSeenAt ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const staleStatus = await pageC.evaluate(async ({ firstSeenAt }) => {
    const response = await fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        returnCount: 1,
        firstSeenAt,
        lastSeenAt: firstSeenAt,
        lastVisualChoice: "pose_a",
        launchCompleted: false,
      }),
    });
    return response.status;
  }, { firstSeenAt: staleFirstSeenAt });
  assert(staleStatus === 204, `Stale snapshot POST expected 204, got ${staleStatus}`);

  const afterStale = await waitForRelationship(
    pageC,
    (state) => state?.returnCount === 5 && state?.lastVisualChoice === "pose_b" && state?.launchCompleted === true,
    "real monotonic stale-state protection",
  );
  assert(afterStale.returnCount === 5, "Stale device reduced return_count");
  assert(afterStale.lastVisualChoice === "pose_b", "Stale device replaced server pose_b with pose_a");
  assert(afterStale.launchCompleted === true, "Stale device reverted launch_completed");
  await signOut(pageC);

  console.log("MARA_REAL_RETURN_MEMORY_E2E PASS");
  console.log(`MARA_QA_EMAIL=${qaEmail}`);
} finally {
  if (browserB) await browserB.close().catch(() => {});
  if (browserC) await browserC.close().catch(() => {});
  await browser.close();
}
