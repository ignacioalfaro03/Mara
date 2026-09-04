import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!baseUrl || !supabaseUrl || !supabasePublishableKey || !supabaseServiceRoleKey) {
  throw new Error(
    "BASE_URL, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and SUPABASE_SERVICE_ROLE_KEY are required",
  );
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function qaCredentials(label) {
  const nonce = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  return {
    email: `mara-private-${label}-${nonce}@example.com`,
    password: `Mara-${crypto.randomUUID()}-9a!`,
  };
}

async function adminCreateUser(credentials) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      email_confirm: true,
    }),
  });
  const body = await response.json().catch(() => ({}));
  assert(response.ok && body?.id, `Admin QA user creation failed status=${response.status}`);
  return body.id;
}

async function adminDeleteUser(userId) {
  if (!userId) return;
  await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  }).catch(() => undefined);
}

async function passwordToken(credentials) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabasePublishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const body = await response.json().catch(() => ({}));
  assert(response.ok && body?.access_token, `Password token failed status=${response.status}`);
  return body.access_token;
}

async function directRelationshipRows(accessToken, userId) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/relationship_state?select=user_id,last_ritual_key,last_ritual_completed_at,preferred_private_style,private_session_count,last_private_session_at,last_private_offer_at&user_id=eq.${encodeURIComponent(userId)}`,
    {
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const body = await response.json().catch(() => null);
  assert(response.ok && Array.isArray(body), `Direct relationship read failed status=${response.status}`);
  return body;
}

async function passAgeGate(page) {
  const alreadyPassed = await page
    .evaluate(() => window.localStorage.getItem("mara_age_gate_passed") === "true")
    .catch(() => false);
  if (alreadyPassed) return;
  const button = page.getByRole("button", { name: "Sí, tengo 18+" });
  await button.waitFor({ state: "visible", timeout: 8000 });
  await button.click();
  await page.getByRole("dialog").waitFor({ state: "detached", timeout: 8000 }).catch(() => undefined);
}

async function signIn(page, credentials) {
  await page.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  await passAgeGate(page);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByLabel("Correo").fill(credentials.email);
  await page.getByLabel("Contraseña").fill(credentials.password);
  await page.getByRole("button", { name: "Seguir", exact: true }).click();
  await page.waitForURL(/\/experience\?account=ready/, { timeout: 30000 });
  await passAgeGate(page);
}

async function apiJson(page, path, init) {
  return page.evaluate(
    async ({ path, init }) => {
      const response = await fetch(path, { ...init, cache: "no-store" });
      const body = await response.json().catch(() => ({}));
      return { status: response.status, body };
    },
    { path, init },
  );
}

async function waitForApi(page, path, predicate, label, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await apiJson(page, path);
    if (last.status === 200 && predicate(last.body)) return last.body;
    await page.waitForTimeout(500);
  }
  throw new Error(`${label} timed out last=${JSON.stringify(last)}`);
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
};

const userA = qaCredentials("a");
const userB = qaCredentials("b");
let userAId;
let userBId;
let contextA;
let contextB;
let contextC;

try {
  userAId = await adminCreateUser(userA);
  userBId = await adminCreateUser(userB);

  const probeContext = await browser.newContext(contextOptions);
  const memoryHealth = await probeContext.request.get(`${baseUrl}/api/health-memory`);
  assert(memoryHealth.status() === 200, `/api/health-memory returned ${memoryHealth.status()}`);
  const memoryBody = await memoryHealth.json();
  assert(memoryBody?.configured === true, "Hosted candidate is not configured against Supabase");
  await probeContext.close();

  // Device A: authenticated real write into the isolated Supabase project.
  contextA = await browser.newContext(contextOptions);
  const pageA = await contextA.newPage();
  await signIn(pageA, userA);
  await pageA.getByText("Llegaste justo.").waitFor({ timeout: 15000 });
  await pageA.getByRole("button", { name: "Entrar" }).click();
  await pageA.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();
  await pageA.getByRole("button", { name: "Hecho" }).click();
  await pageA.getByText(/No me mandes prueba. Te creo/).waitFor();

  await waitForApi(
    pageA,
    "/api/relationship/ritual",
    (body) => body?.ritual?.ritualKey === "junk_food_date_v1" && Boolean(body?.ritual?.completedAt),
    "real ritual persistence",
  );

  await pageA.getByRole("button", { name: "Hoy manda tú" }).click();
  await pageA.getByRole("button", { name: "Directo" }).click();
  await pageA.getByRole("button", { name: "Ya" }).click();
  await pageA.getByText("Ya. Por hoy queda ahí.").waitFor({ timeout: 15000 });

  const privateA = await waitForApi(
    pageA,
    "/api/relationship/private-moment",
    (body) => body?.privateMoment?.preferredStyle === "direct" && body?.privateMoment?.sessionCount === 1,
    "first real private moment persistence",
  );
  assert(privateA.privateMoment.commercial?.decision === "closed", "First real Private Moment must keep commerce closed");

  const tokenA = await passwordToken(userA);
  const ownRows = await directRelationshipRows(tokenA, userAId);
  assert(ownRows.length === 1, `User A should see exactly one own relationship row, got ${ownRows.length}`);
  assert(ownRows[0].preferred_private_style === "direct", "Direct Supabase read did not persist user A style");
  assert(ownRows[0].private_session_count === 1, "Direct Supabase read did not persist user A session count");
  assert(ownRows[0].last_ritual_key === "junk_food_date_v1", "Direct Supabase read did not persist ritual key");

  await contextA.close();
  contextA = null;

  // Device B: clean browser, same account. No route interception and no preloaded Mara localStorage.
  contextB = await browser.newContext(contextOptions);
  const pageB = await contextB.newPage();
  await signIn(pageB, userA);
  await pageB.getByText("Volviste.").waitFor({ timeout: 15000 });
  await pageB.waitForFunction(() => {
    const raw = window.localStorage.getItem("mara_dm_state_v1");
    if (!raw) return false;
    const state = JSON.parse(raw);
    return state.preferredPrivateStyle === "direct" && state.privateSessionCount >= 1 && Boolean(state.ritualCompletedAt);
  });

  await pageB.getByRole("button", { name: "Hoy manda tú" }).click();
  await pageB.getByText(/Ya sé que prefieres que vaya directo/).waitFor();
  await pageB.getByRole("button", { name: "Ya" }).click();
  await pageB.getByText("Esta vez sí te dejé algo aparte.").waitFor({ timeout: 15000 });
  await pageB.getByTestId("dm-private-drop").waitFor();

  const privateB = await waitForApi(
    pageB,
    "/api/relationship/private-moment",
    (body) =>
      body?.privateMoment?.preferredStyle === "direct" &&
      body?.privateMoment?.sessionCount >= 2 &&
      Boolean(body?.privateMoment?.lastOfferAt) &&
      body?.privateMoment?.commercial?.decision === "closed",
    "second-device private moment plus offer cooldown persistence",
  );
  assert(privateB.privateMoment.commercial?.decision === "closed", "Offer view should immediately place the real account into cooldown");
  assert(Boolean(privateB.privateMoment.lastOfferAt), "Real offer view was not persisted into cooldown state");

  await contextB.close();
  contextB = null;

  // RLS: a different authenticated user must not be able to read user A's relationship row directly.
  const tokenB = await passwordToken(userB);
  const leakedRows = await directRelationshipRows(tokenB, userAId);
  assert(leakedRows.length === 0, `RLS leak: user B could read ${leakedRows.length} row(s) belonging to user A`);

  // App-level user B state must also start clean.
  contextC = await browser.newContext(contextOptions);
  const pageC = await contextC.newPage();
  await signIn(pageC, userB);
  const userBRitual = await apiJson(pageC, "/api/relationship/ritual");
  assert(userBRitual.status === 200 && userBRitual.body?.ritual === null, "User B inherited user A ritual state");
  const userBPrivate = await apiJson(pageC, "/api/relationship/private-moment");
  assert(userBPrivate.status === 200, `User B private state returned ${userBPrivate.status}`);
  assert(userBPrivate.body?.privateMoment?.preferredStyle === null, "User B inherited user A private style");
  assert(userBPrivate.body?.privateMoment?.sessionCount === 0, "User B inherited user A private session count");

  console.log("MARA_HOSTED_PRIVATE_MOMENT_E2E PASS");
  console.log(`MARA_PROOF_BASE_URL=${baseUrl}`);
  console.log(`MARA_PROOF_SUPABASE_URL=${supabaseUrl}`);
} finally {
  if (contextA) await contextA.close().catch(() => undefined);
  if (contextB) await contextB.close().catch(() => undefined);
  if (contextC) await contextC.close().catch(() => undefined);
  await adminDeleteUser(userAId);
  await adminDeleteUser(userBId);
  await browser.close();
}
