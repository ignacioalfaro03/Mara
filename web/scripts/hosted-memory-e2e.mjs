import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL;
const qaEmail = process.env.QA_EMAIL;
const qaPassword = process.env.QA_PASSWORD;
const qaBootstrapToken = process.env.QA_BOOTSTRAP_TOKEN?.trim();
const protectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();

if (!baseUrl || !qaEmail || !qaPassword) {
  throw new Error("BASE_URL, QA_EMAIL and QA_PASSWORD are required");
}

const apiProtectionHeaders = protectionBypass
  ? { "x-vercel-protection-bypass": protectionBypass }
  : {};
const browserProtectionHeaders = protectionBypass
  ? {
      "x-vercel-protection-bypass": protectionBypass,
      "x-vercel-set-bypass-cookie": "true",
    }
  : {};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function manageQaUser(body) {
  assert(qaBootstrapToken, "QA_BOOTSTRAP_TOKEN is required for QA user management");
  const response = await fetch(`${baseUrl}/api/internal/qa-user`, {
    method: "POST",
    headers: {
      ...apiProtectionHeaders,
      "Content-Type": "application/json",
      "x-mara-qa-token": qaBootstrapToken,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok !== true) {
    throw new Error(`QA user management failed: status=${response.status} error=${payload?.error ?? "unknown"}`);
  }
  return payload;
}

async function acceptAgeGate(page) {
  const alreadyPassed = await page
    .evaluate(() => window.localStorage.getItem("mara_age_gate_passed") === "true")
    .catch(() => false);
  if (alreadyPassed) return;

  const confirm = page.getByRole("button", { name: "Sí, tengo 18+" });
  try {
    await confirm.waitFor({ state: "visible", timeout: 6000 });
    await confirm.click();
    await page.getByRole("dialog").waitFor({ state: "detached", timeout: 6000 }).catch(() => undefined);
  } catch {
    // Some authenticated navigations can arrive after the gate was accepted in the same context.
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

async function signOut(page) {
  const status = await page.evaluate(async () => {
    const response = await fetch("/api/auth/signout", { method: "POST" });
    return response.status;
  });
  assert(status === 204, `Signout expected 204, got ${status}`);
}

async function readJson(page, path) {
  return page.evaluate(async (url) => {
    const response = await fetch(url, { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    return { status: response.status, body };
  }, path);
}

async function waitForApi(page, path, predicate, label, timeoutMs = 30000) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeoutMs) {
    last = await readJson(page, path);
    if (last.status === 200 && predicate(last.body)) return last.body;
    await page.waitForTimeout(400);
  }
  throw new Error(`${label} timed out; last=${JSON.stringify(last)}`);
}

async function writeRelationship(page, state) {
  return page.evaluate(async (payload) => {
    const response = await fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.status;
  }, state);
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
  extraHTTPHeaders: Object.keys(browserProtectionHeaders).length ? browserProtectionHeaders : undefined,
};

let contextA;
let contextB;
let contextC;
let qaUserId = null;
let primaryError = null;

try {
  const created = await manageQaUser({ action: "create", email: qaEmail, password: qaPassword });
  qaUserId = created.userId;
  assert(typeof qaUserId === "string", "QA bootstrap did not return a user id");
  console.log("MARA_QA_BOOTSTRAP PASS");

  const probeContext = await browser.newContext(contextOptions);
  const memoryHealth = await probeContext.request.get(`${baseUrl}/api/health-memory`);
  assert(memoryHealth.status() === 200, `/api/health-memory returned ${memoryHealth.status()}`);
  const memoryBody = await memoryHealth.json();
  assert(memoryBody?.configured === true, "Hosted proof memory backend is not configured");
  await probeContext.close();

  // Browser A: complete the current launch ritual anonymously. This is the
  // local signal AccountEntry must flush to the server after sign-in.
  contextA = await browser.newContext(contextOptions);
  const pageA = await contextA.newPage();
  await pageA.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await acceptAgeGate(pageA);
  await pageA.getByText("No quiero que esto se sienta como una app. Háblame aquí.").waitFor();
  await pageA.getByRole("button", { name: "Entrar" }).click();
  await pageA.getByText("Hoy mando yo un poco.").waitFor();
  await pageA.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  await pageA.getByRole("button", { name: "Hecho" }).click();
  await pageA.getByText(/No me mandes prueba. Te creo/).waitFor();

  const anonymousDm = await pageA.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(anonymousDm.started === true, "Anonymous DM did not persist started=true");
  assert(anonymousDm.ritualOffered === true, "Anonymous DM did not persist ritual offer");
  assert(typeof anonymousDm.ritualCompletedAt === "string", "Anonymous ritual completion was not kept locally");

  // Sign-in on the same device must flush the anonymous ritual into account memory.
  await signIn(pageA);
  const ritualA = await waitForApi(
    pageA,
    "/api/relationship/ritual",
    (body) => body?.ritual?.ritualKey === "junk_food_date_v1" && typeof body?.ritual?.completedAt === "string",
    "ritual flush after sign-in",
  );
  const ritualCompletedAt = ritualA.ritual.completedAt;
  console.log("MARA_RITUAL_ACCOUNT_FLUSH PASS");

  // On the current product, private-style memory is a first-class continuity signal.
  await pageA.getByRole("button", { name: "Hoy manda tú" }).waitFor({ timeout: 15000 });
  await pageA.getByRole("button", { name: "Hoy manda tú" }).click();
  await pageA.getByText(/no vas a navegar un catálogo/).waitFor();
  await pageA.getByRole("button", { name: "Directo" }).click();
  await pageA.getByText("Bien. Directo.").waitFor();
  await pageA.getByRole("button", { name: "Ya" }).click();
  await pageA.getByText("Ya. Por hoy queda ahí.").waitFor();

  const privateA = await waitForApi(
    pageA,
    "/api/relationship/private-moment",
    (body) => body?.privateMoment?.preferredStyle === "direct" && body?.privateMoment?.sessionCount >= 1,
    "private style persistence on Browser A",
  );
  assert(privateA.privateMoment.sessionCount === 1, `Expected first private session count=1, got ${privateA.privateMoment.sessionCount}`);
  console.log("MARA_PRIVATE_MEMORY_A PASS");

  // Seed the generic relationship merge with newer server truth so Browser C
  // can prove a stale snapshot cannot roll it back.
  const firstSeenAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const latestSeenAt = new Date().toISOString();
  const seedStatus = await writeRelationship(pageA, {
    returnCount: 2,
    firstSeenAt,
    lastSeenAt: latestSeenAt,
    lastVisualChoice: "pose_b",
    launchCompleted: true,
  });
  assert(seedStatus === 204, `Relationship seed returned ${seedStatus}`);
  const seeded = await waitForApi(
    pageA,
    "/api/relationship",
    (body) => body?.state?.returnCount >= 2 && body?.state?.lastVisualChoice === "pose_b" && body?.state?.launchCompleted === true,
    "newer relationship seed",
  );

  await signOut(pageA);
  await contextA.close();
  contextA = null;

  // Browser B: fresh device, no Mara localStorage. Both ritual + explicit
  // private preference must hydrate from server account memory.
  contextB = await browser.newContext(contextOptions);
  const pageB = await contextB.newPage();
  await signIn(pageB);
  await pageB.getByText("Volviste.").waitFor({ timeout: 15000 });
  await pageB.getByText(/me acuerdo de la hamburguesa, las papas y el chocolate/).waitFor({ timeout: 15000 });
  await pageB.waitForFunction(() => {
    const raw = window.localStorage.getItem("mara_dm_state_v1");
    if (!raw) return false;
    const state = JSON.parse(raw);
    return typeof state.ritualCompletedAt === "string" && state.preferredPrivateStyle === "direct" && state.privateSessionCount >= 1;
  });

  const hydrated = await pageB.evaluate(() => JSON.parse(window.localStorage.getItem("mara_dm_state_v1") || "{}"));
  assert(hydrated.ritualCompletedAt === ritualCompletedAt, "Browser B did not hydrate the account ritual timestamp");
  assert(hydrated.preferredPrivateStyle === "direct", "Browser B did not hydrate preferred private style");
  assert(hydrated.privateSessionCount >= 1, "Browser B did not hydrate private session count");
  console.log("MARA_CROSS_DEVICE_HYDRATION PASS");

  // A second device action must continue from the remembered style and advance
  // server history rather than starting a disconnected local branch.
  await pageB.getByRole("button", { name: "Hoy manda tú" }).click();
  await pageB.getByText(/Ya sé que prefieres que vaya directo/).waitFor();
  await pageB.getByRole("button", { name: "Ya" }).click();
  const privateB = await waitForApi(
    pageB,
    "/api/relationship/private-moment",
    (body) => body?.privateMoment?.preferredStyle === "direct" && body?.privateMoment?.sessionCount >= 2,
    "cross-device private history increment",
  );
  assert(privateB.privateMoment.sessionCount >= 2, "Browser B did not advance server-backed private session history");
  console.log("MARA_CROSS_DEVICE_CONTINUITY PASS");
  await signOut(pageB);
  await contextB.close();
  contextB = null;

  // Browser C: authenticated stale generic snapshot must not degrade the newer
  // server truth seeded on Browser A.
  contextC = await browser.newContext(contextOptions);
  const pageC = await contextC.newPage();
  await signIn(pageC);
  const beforeStale = await waitForApi(
    pageC,
    "/api/relationship",
    (body) => body?.state?.returnCount >= 2 && body?.state?.lastVisualChoice === "pose_b" && body?.state?.launchCompleted === true,
    "relationship state before stale write",
  );

  const staleStatus = await writeRelationship(pageC, {
    returnCount: 0,
    firstSeenAt,
    lastSeenAt: firstSeenAt,
    lastVisualChoice: "pose_a",
    launchCompleted: false,
  });
  assert(staleStatus === 204, `Stale relationship write returned ${staleStatus}`);

  const afterStale = await waitForApi(
    pageC,
    "/api/relationship",
    (body) => body?.state?.returnCount >= 2 && body?.state?.lastVisualChoice === "pose_b" && body?.state?.launchCompleted === true,
    "monotonic relationship merge",
  );
  assert(afterStale.state.returnCount >= beforeStale.state.returnCount, "Stale write reduced return_count");
  assert(afterStale.state.lastVisualChoice === "pose_b", "Stale write replaced newer visual choice");
  assert(afterStale.state.launchCompleted === true, "Stale write reverted launch_completed");
  assert(Date.parse(afterStale.state.lastSeenAt) >= Date.parse(seeded.state.lastSeenAt), "Stale write moved last_seen_at backwards");
  console.log("MARA_STALE_STATE_PROTECTION PASS");

  console.log("MARA_HOSTED_MEMORY_E2E PASS");
} catch (error) {
  primaryError = error;
} finally {
  if (contextA) await contextA.close().catch(() => {});
  if (contextB) await contextB.close().catch(() => {});
  if (contextC) await contextC.close().catch(() => {});
  await browser.close();

  if (qaUserId) {
    try {
      await manageQaUser({ action: "delete", userId: qaUserId });
      console.log("MARA_QA_CLEANUP PASS");
    } catch (cleanupError) {
      if (!primaryError) primaryError = cleanupError;
      else console.error("MARA_QA_CLEANUP_FAILED", cleanupError instanceof Error ? cleanupError.message : String(cleanupError));
    }
  }
}

if (primaryError) throw primaryError;
