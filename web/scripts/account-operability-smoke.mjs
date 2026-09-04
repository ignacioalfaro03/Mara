import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
const contextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
};

try {
  // Anonymous/local control: clear Mara continuity without removing the 18+ gate.
  const resetContext = await browser.newContext(contextOptions);
  await resetContext.addInitScript(() => {
    window.localStorage.setItem("mara_age_gate_passed", "true");
    window.localStorage.setItem("mara_dm_state_v1", JSON.stringify({ started: true }));
    window.localStorage.setItem("mara_launch_state_v1", JSON.stringify({ completed: true }));
    window.localStorage.setItem("mara_pending_preference_events_v1", "[]");
    window.sessionStorage.setItem("mara_dm_checkout_request_v1", "qa-checkout");
  });
  const resetPage = await resetContext.newPage();
  await resetPage.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  await resetPage.getByRole("button", { name: "Borrar copia local" }).click();
  await resetPage.getByText(/Borré la copia local de Mara/).waitFor();

  const resetState = await resetPage.evaluate(() => ({
    ageGate: window.localStorage.getItem("mara_age_gate_passed"),
    dm: window.localStorage.getItem("mara_dm_state_v1"),
    launch: window.localStorage.getItem("mara_launch_state_v1"),
    pending: window.localStorage.getItem("mara_pending_preference_events_v1"),
    checkout: window.sessionStorage.getItem("mara_dm_checkout_request_v1"),
  }));
  assert(resetState.ageGate === "true", "Local reset must not clear the 18+ gate");
  assert(resetState.dm === null, "Local reset did not clear DM state");
  assert(resetState.launch === null, "Local reset did not clear legacy launch state");
  assert(resetState.pending === null, "Local reset did not clear pending preference cache");
  assert(resetState.checkout === null, "Local reset did not clear checkout request cache");
  await resetContext.close();

  // Authenticated control contract: the UI exposes sign-out only when auth/me says authenticated.
  let signoutCalled = false;
  const authContext = await browser.newContext(contextOptions);
  await authContext.addInitScript(() => {
    window.localStorage.setItem("mara_age_gate_passed", "true");
    window.localStorage.setItem("mara_dm_state_v1", JSON.stringify({ started: true }));
    window.sessionStorage.setItem("mara_dm_checkout_request_v1", "qa-checkout-auth");
  });
  await authContext.route("**/api/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: true, backendConfigured: true, user: { id: "qa-user", email: "qa@example.com" } }),
    });
  });
  await authContext.route("**/api/auth/signout", async (route) => {
    signoutCalled = true;
    await route.fulfill({ status: 204, body: "" });
  });

  const authPage = await authContext.newPage();
  await authPage.goto(`${baseUrl}/auth`, { waitUntil: "networkidle" });
  const signout = authPage.getByRole("button", { name: "Cerrar sesión" });
  await signout.waitFor({ state: "visible" });
  await signout.click();
  await authPage.getByText(/Sesión cerrada y copia local borrada/).waitFor();
  assert(signoutCalled, "Sign-out UI did not call /api/auth/signout");

  const signedOutState = await authPage.evaluate(() => ({
    ageGate: window.localStorage.getItem("mara_age_gate_passed"),
    dm: window.localStorage.getItem("mara_dm_state_v1"),
    checkout: window.sessionStorage.getItem("mara_dm_checkout_request_v1"),
  }));
  assert(signedOutState.ageGate === "true", "Sign-out must not clear the 18+ gate");
  assert(signedOutState.dm === null, "Sign-out did not clear local DM state");
  assert(signedOutState.checkout === null, "Sign-out did not clear checkout request cache");
  await authContext.close();

  console.log("MARA_ACCOUNT_OPERABILITY_SMOKE PASS");
} finally {
  await browser.close();
}
