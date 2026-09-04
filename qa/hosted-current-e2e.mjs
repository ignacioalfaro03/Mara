import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL;
const emailA = process.env.QA_EMAIL_A;
const passwordA = process.env.QA_PASSWORD_A;
const emailB = process.env.QA_EMAIL_B;
const passwordB = process.env.QA_PASSWORD_B;
const preprovisioned = process.env.QA_PREPROVISIONED === "1";

if (!baseUrl || !emailA || !passwordA || !emailB || !passwordB) {
  throw new Error("BASE_URL and both QA credential pairs are required");
}

const results = {};
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function passAgeGate(page) {
  const confirm = page.getByRole("button", { name: "Sí, tengo 18+" });
  if (await confirm.count()) {
    await confirm.first().click().catch(() => undefined);
    await page.getByRole("dialog").waitFor({ state: "detached", timeout: 5000 }).catch(() => undefined);
  }
}

async function api(page, path, options = {}) {
  return page.evaluate(async ({ path, options }) => {
    const response = await fetch(path, { cache: "no-store", credentials: "same-origin", ...options });
    const body = await response.json().catch(() => null);
    return { status: response.status, body };
  }, { path, options });
}

async function signin(page, email, password, { assertClean = false } = {}) {
  if (assertClean) {
    const preNavCookies = await page.context().cookies(baseUrl);
    const maraAuthCookies = preNavCookies.filter((cookie) => cookie.name === "mara_access_token" || cookie.name === "mara_refresh_token");
    assert(maraAuthCookies.length === 0, `browser inherited Mara auth cookies ${maraAuthCookies.map((cookie) => cookie.name).join(",")}`);
  }

  await page.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  await passAgeGate(page);

  if (assertClean) {
    const localState = await page.evaluate(() => ({
      dm: window.localStorage.getItem("mara_dm_state_v1"),
      ritual: window.localStorage.getItem("mara_launch_ritual_v1"),
      localKeys: Object.keys(window.localStorage),
      sessionKeys: Object.keys(window.sessionStorage),
    }));
    assert(localState.dm === null && localState.ritual === null, `browser inherited Mara continuity state ${JSON.stringify(localState)}`);
    console.log(`MARA_CLEAN_BROWSER_BASELINE ${JSON.stringify({ localKeys: localState.localKeys, sessionKeys: localState.sessionKeys })}`);
  }

  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Seguir", exact: true }).click();
  await page.waitForURL(/\/experience\?account=ready/, { timeout: 30000 });
}

async function authenticateForQa(page, email, password, label, options = {}) {
  if (preprovisioned) {
    await signin(page, email, password, options);
    console.log(`MARA_QA_PRECONFIRMED_${label}`);
    return;
  }

  await page.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByLabel("Confirmo que tengo 18 años o más.").check();
  await page.getByRole("button", { name: "Que te acuerdes", exact: true }).click();

  const ready = page.waitForURL(/\/experience\?account=ready/, { timeout: 8000 }).then(() => true).catch(() => false);
  if (await ready) return;

  await page.getByText(/Revisa tu correo para confirmar la cuenta/i).waitFor({ timeout: 10000 });
  console.log(`MARA_QA_WAITING_CONFIRMATION_${label}`);

  const deadline = Date.now() + 7 * 60 * 1000;
  while (Date.now() < deadline) {
    const enterTab = page.getByRole("button", { name: "Entrar", exact: true });
    if (await enterTab.count()) await enterTab.click().catch(() => undefined);
    await page.getByLabel("Correo").fill(email);
    await page.getByLabel("Contraseña").fill(password);
    await page.getByRole("button", { name: "Seguir", exact: true }).click();
    const signedIn = await page.waitForURL(/\/experience\?account=ready/, { timeout: 5000 }).then(() => true).catch(() => false);
    if (signedIn) {
      console.log(`MARA_QA_CONFIRMED_${label}`);
      return;
    }
    await page.waitForTimeout(4000);
  }
  throw new Error(`QA account ${label} was not confirmed in time`);
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
  const probe = await browser.newContext(contextOptions);
  const health = await probe.request.get(`${baseUrl}/api/health`);
  const memory = await probe.request.get(`${baseUrl}/api/health-memory`);
  assert(health.status() === 200, `health=${health.status()}`);
  assert(memory.status() === 200, `health-memory=${memory.status()}`);
  const memoryBody = await memory.json();
  assert(memoryBody?.configured === true, "memory backend not configured");
  await probe.close();
  results.health = "pass";
  results.health_memory = "pass";

  // Browser A: anonymous value first, then continuity auth into a preconfirmed QA fixture.
  contextA = await browser.newContext(contextOptions);
  const pageA = await contextA.newPage();
  await pageA.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await passAgeGate(pageA);
  await pageA.getByRole("button", { name: "Entrar", exact: true }).click();
  await pageA.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  await pageA.getByRole("button", { name: "Hecho", exact: true }).click();
  await pageA.getByText(/No me mandes prueba. Te creo/).waitFor();
  await pageA.getByTestId("dm-continuity-cta").waitFor();
  await pageA.getByRole("button", { name: "¿Quieres que me acuerde?", exact: true }).click();
  await pageA.waitForURL(/\/auth$/, { timeout: 10000 });

  await authenticateForQa(pageA, emailA, passwordA, "A");
  await pageA.getByText("Volviste.").waitFor({ timeout: 15000 });
  await pageA.getByText(/me acuerdo de la hamburguesa, las papas y el chocolate/).waitFor({ timeout: 15000 });
  results.memory_callback_a = "pass";

  const migrated = await api(pageA, "/api/relationship/ritual");
  results.anonymous_to_auth_ritual = migrated.status === 200 && Boolean(migrated.body?.ritual) ? "pass" : "fail";
  console.log(`MARA_ANON_TO_AUTH_RITUAL ${results.anonymous_to_auth_ritual}`);
  assert(results.anonymous_to_auth_ritual === "pass", `anonymous ritual did not migrate ${JSON.stringify(migrated)}`);

  // Authenticated Private Moment should persist an explicit preference.
  await pageA.getByRole("button", { name: "Hoy manda tú", exact: true }).click();
  await pageA.getByText(/no vas a navegar un catálogo/).waitFor();
  await pageA.getByRole("button", { name: "Directo", exact: true }).click();
  await pageA.getByText("Bien. Directo.").waitFor();
  await pageA.getByRole("button", { name: "Ya", exact: true }).click();
  await pageA.getByText("Ya. Por hoy queda ahí.").waitFor();
  const privateA = await api(pageA, "/api/relationship/private-moment");
  assert(privateA.status === 200, `private memory A status=${privateA.status}`);
  assert(privateA.body?.privateMoment?.preferredStyle === "direct", `private style not persisted ${JSON.stringify(privateA)}`);
  assert(privateA.body?.privateMoment?.sessionCount >= 1, `private count not persisted ${JSON.stringify(privateA)}`);
  results.private_preference_persisted = "pass";

  // Hosted monotonic stale-state protection on current API.
  const now = new Date();
  const firstSeenAt = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const newest = await api(pageA, "/api/relationship", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnCount: 4, firstSeenAt, lastSeenAt: now.toISOString(), lastVisualChoice: "pose_b", launchCompleted: true }),
  });
  assert(newest.status === 204, `new relationship write=${newest.status}`);
  const stale = await api(pageA, "/api/relationship", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnCount: 1, firstSeenAt, lastSeenAt: firstSeenAt, lastVisualChoice: "pose_a", launchCompleted: false }),
  });
  assert(stale.status === 204, `stale relationship write=${stale.status}`);
  const monotonic = await api(pageA, "/api/relationship");
  assert(monotonic.status === 200, `relationship read=${monotonic.status}`);
  assert(monotonic.body?.state?.returnCount >= 4, `return count degraded ${JSON.stringify(monotonic)}`);
  assert(monotonic.body?.state?.lastVisualChoice === "pose_b", `visual preference degraded ${JSON.stringify(monotonic)}`);
  assert(monotonic.body?.state?.launchCompleted === true, `launch completion degraded ${JSON.stringify(monotonic)}`);
  results.stale_state_protection = "pass";

  const signoutA = await api(pageA, "/api/auth/signout", { method: "POST" });
  assert(signoutA.status === 204, `signout A=${signoutA.status}`);
  await contextA.close(); contextA = null;

  // Browser B: completely fresh browser context, same account, no copied storage or Mara auth cookies.
  contextB = await browser.newContext(contextOptions);
  const pageB = await contextB.newPage();
  await signin(pageB, emailA, passwordA, { assertClean: true });
  await pageB.getByText("Volviste.").waitFor({ timeout: 15000 });
  await pageB.getByText(/me acuerdo de la hamburguesa, las papas y el chocolate/).waitFor({ timeout: 15000 });
  await pageB.waitForFunction(() => {
    const raw = window.localStorage.getItem("mara_dm_state_v1");
    if (!raw) return false;
    const state = JSON.parse(raw);
    return Boolean(state.ritualCompletedAt) && state.preferredPrivateStyle === "direct" && state.privateSessionCount >= 1;
  }, null, { timeout: 20000 });
  results.clean_browser_hydration = "pass";

  await pageB.getByRole("button", { name: "Hoy manda tú", exact: true }).click();
  await pageB.getByText(/Ya sé que prefieres que vaya directo/).waitFor({ timeout: 15000 });
  results.memory_changes_ux = "pass";
  await pageB.screenshot({ path: "browser-b-memory.png", fullPage: true });

  const signoutB = await api(pageB, "/api/auth/signout", { method: "POST" });
  assert(signoutB.status === 204, `signout B=${signoutB.status}`);
  await contextB.close(); contextB = null;

  // User B: separate preconfirmed account in a clean browser; app state must remain empty.
  contextC = await browser.newContext(contextOptions);
  const pageC = await contextC.newPage();
  await authenticateForQa(pageC, emailB, passwordB, "B", { assertClean: true });
  const ritualB = await api(pageC, "/api/relationship/ritual");
  const privateB = await api(pageC, "/api/relationship/private-moment");
  const relationshipB = await api(pageC, "/api/relationship");
  assert(ritualB.status === 200 && ritualB.body?.ritual === null, `User B saw ritual A ${JSON.stringify(ritualB)}`);
  assert(privateB.status === 200 && (privateB.body?.privateMoment?.preferredStyle ?? null) === null && (privateB.body?.privateMoment?.sessionCount ?? 0) === 0, `User B saw private A ${JSON.stringify(privateB)}`);
  assert(relationshipB.status === 200 && relationshipB.body?.state === null, `User B saw relationship A ${JSON.stringify(relationshipB)}`);
  results.cross_user_app_isolation = "pass";

  const telemetry = await contextC.request.post(`${baseUrl}/api/telemetry`, {
    data: { event: "session_started", properties: { surface: "hosted_activation_qa", entry_source: "direct" }, timestamp: new Date().toISOString() },
  });
  assert(telemetry.status() === 200, `telemetry endpoint=${telemetry.status()}`);
  results.telemetry_endpoint = "pass";

  console.log(`MARA_HOSTED_CURRENT_E2E_SUMMARY ${JSON.stringify(results)}`);
  console.log("MARA_HOSTED_CURRENT_E2E PASS");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const infra = /rate limit|429|ECONN|ENOTFOUND|ERR_NAME|ERR_CONNECTION|browserType\.launch|Executable doesn't exist|health=|health-memory=/i.test(message);
  console.error(`${infra ? "MARA_QA_INFRA_FAILURE" : "MARA_QA_PRODUCT_FAILURE"} ${message}`);
  throw error;
} finally {
  if (contextA) await contextA.close().catch(() => {});
  if (contextB) await contextB.close().catch(() => {});
  if (contextC) await contextC.close().catch(() => {});
  await browser.close();
}
