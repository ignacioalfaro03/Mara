import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const options = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "es-CL" };
const json = (route, data, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
async function visit(page, path) {
  await page.goto(baseUrl + path, { waitUntil: "networkidle" });
  const gate = page.getByRole("button", { name: "Sí, tengo 18+" });
  if (await gate.isVisible()) await gate.click();
}
async function start(page) {
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByRole("button", { name: "Hecho", exact: true }).waitFor();
}
async function events(page, name) {
  return page.evaluate((event) => window.qaEvents.filter((item) => item.event === event), name);
}
try {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    window.qaEvents = [];
    window.addEventListener("mara:analytics", (event) => window.qaEvents.push(event.detail));
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await visit(page, "/");
  const cta = await page.getByRole("link", { name: "Probar a Mara gratis" }).boundingBox();
  assert(cta && cta.y + cta.height <= 844, "Mobile landing free-sample CTA is below the first viewport");
  await page.getByRole("link", { name: "Probar a Mara gratis" }).click();
  await start(page);
  // Negative language must not be mistaken for 'ya/listo' completion.
  await page.getByLabel("Mensaje para Mara").fill("no estoy listo");
  await page.getByRole("button", { name: "Enviar", exact: true }).click();
  assert.equal((await events(page, "ritual_completed")).length, 0);
  await page.getByRole("button", { name: "Hoy manda tú" }).click();
  await page.getByRole("button", { name: "Directo", exact: true }).click();
  await page.getByText(/Mini escena: Sofi entra a la cocina/).waitFor();
  await page.getByRole("button", { name: "Ya", exact: true }).click();
  await page.getByText(/Duró un coro su dignidad/).waitFor();
  await page.getByTestId("dm-continuity-cta").waitFor();
  assert.equal((await events(page, "memory_recall_engaged")).length, 0, "First-session completion is not recall engagement");

  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Volviste.", { exact: true }).waitFor();
  assert.equal((await events(page, "launch_return_continued")).length, 0, "Return exposure is not continuation");
  await page.getByRole("button", { name: "Hoy manda tú" }).click();
  await page.getByText(/la que pidió repetir la canción fue ella/).waitFor();
  assert.equal((await events(page, "memory_recall_engaged")).length, 1);
  await page.getByRole("button", { name: "Ya", exact: true }).click();
  const drop = page.getByTestId("dm-private-drop");
  await drop.waitFor();
  assert(await drop.getByRole("button", { name: "Aún no disponible" }).isDisabled());
  await drop.getByRole("button", { name: "Ahora no", exact: true }).click();
  assert.equal((await events(page, "commercial_post_offer_continued")).length, 0, "Dismissal alone is not continued engagement");
  await page.getByLabel('Mensaje para Mara').fill('sigamos con la historia');
  await page.getByRole('button', {name:'Enviar', exact:true}).click();
  assert.equal((await events(page, 'commercial_post_offer_continued')).length, 1, 'Actual subsequent action must count once');
  await page.getByTestId("sofi-world-door").getByRole("link").click();
  await page.getByRole("button", { name: "Ya lo vi" }).click();
  await page.getByTestId("return-to-mara").click();
  await page.getByRole("button", { name: "Cuéntame tu versión" }).click();
  await page.getByText(/cantó el segundo coro más fuerte que yo/).waitFor();
  const engagement = await events(page, "memory_recall_engaged");
  await page.getByRole("button", { name: "Cerrar callback" }).click();
  assert.equal((await events(page, "memory_recall_engaged")).length, engagement.length, "Closing World callback is not engagement");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Volviste.", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Hoy manda tú" }).click();
  await page.getByText(/Elegí una canción que las dos nos sabemos mal/).waitFor();
  await page.getByRole("button", { name: "Ya", exact: true }).click();
  await page.getByText(/lavamos las dos cucharas/).first().waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText(/Ya conoces el final/).waitFor();
  assert.equal(await page.getByRole("button", { name: "Hoy manda tú" }).count(), 0, "Finite story must not pretend to contain infinite new scenes");

  // Reset in another tab must clear World + DM, preserve age consent, and
  // remove already-rendered private callbacks from the original tab.
  const accountPage = await context.newPage();
  await visit(accountPage, "/auth");
  await accountPage.getByRole("button", { name: "Borrar copia local" }).click();
  await page.getByRole("button", { name: "Entrar", exact: true }).waitFor();
  const cache = await accountPage.evaluate(() => ({
    world: localStorage.getItem("mara_world_knowledge_v1"), callback: localStorage.getItem("mara_sofi_callback_seen_v1"),
    age: localStorage.getItem("mara_age_gate_passed"),
  }));
  assert.equal(cache.world, null); assert.equal(cache.callback, null); assert.equal(cache.age, "true");
  assert.deepEqual(errors, [], "Browser runtime errors");
  await context.close();

  // A verified different account must not see or import the old owner's cache.
  const switched = await browser.newContext(options);
  await switched.addInitScript(() => {
    localStorage.setItem("mara_age_gate_passed", "true");
    localStorage.setItem("mara_device_account_v1", "account-a");
    localStorage.setItem("mara_dm_state_v1", JSON.stringify({ started: true, ritualCompletedAt: "2026-09-01T00:00:00Z", preferredPrivateStyle: "direct", privateSessionCount: 2 }));
    localStorage.setItem("mara_world_knowledge_v1", JSON.stringify({ sofi_found_footage_v1: "2026-09-01T00:00:00Z" }));
  });
  await switched.route("**/api/auth/me", (route) => json(route, { authenticated: true, user: { id: "account-b" } }));
  await switched.route("**/api/relationship/ritual", (route) => json(route, { ritual: null }));
  await switched.route("**/api/relationship/private-moment", (route) => json(route, { privateMoment: { preferredStyle: null, sessionCount: 0 } }));
  await switched.route("**/api/world/sofi", (route) => json(route, { knowledge: { discovered: false } }));
  const clean = await switched.newPage();
  await visit(clean, "/experience");
  await clean.getByRole("button", { name: "Entrar", exact: true }).waitFor();
  assert.equal(await clean.getByTestId("sofi-mara-callback").count(), 0);
  assert.equal(await clean.getByText("Volviste.", { exact: true }).count(), 0);
  await start(clean);
  await clean.getByRole("button", { name: "Hecho", exact: true }).click();
  assert.equal(await clean.getByTestId("dm-continuity-cta").count(), 0, "Authenticated users must not get signup CTAs");
  await switched.close();
  // An existing cookie alone cannot adopt an unowned anonymous projection.
  const automatic = await browser.newContext(options);
  await automatic.addInitScript(() => {
    localStorage.setItem('mara_age_gate_passed','true');
    localStorage.setItem('mara_dm_state_v1',JSON.stringify({ritualCompletedAt:'2026-09-01T00:00:00Z',privateSessionCount:2}));
  });
  await automatic.route('**/api/auth/me', route => json(route,{authenticated:true,user:{id:'existing-account'}}));
  const autoPage = await automatic.newPage();
  await visit(autoPage,'/experience');
  await autoPage.getByRole('button',{name:'Entrar',exact:true}).waitFor();
  assert.equal(await autoPage.getByText('Volviste.',{exact:true}).count(),0);
  await automatic.close();

  // Fail closed on unverifiable account ownership, then recover on retry.
  const failure = await browser.newContext(options);
  await failure.addInitScript(() => { localStorage.setItem('mara_age_gate_passed','true'); localStorage.setItem('mara_device_account_v1','account-a'); });
  let broken = true;
  await failure.route('**/api/auth/me',route => broken ? json(route,{},503) : json(route,{authenticated:true,user:{id:'account-a'}}));
  const failedPage = await failure.newPage();
  await visit(failedPage,'/experience');
  await failedPage.getByText('No pude recuperar tu cuenta. Tu historia sigue guardada.').waitFor();
  assert.equal(await failedPage.getByLabel('Chat privado con Mara').count(),0);
  broken = false;
  await failedPage.getByRole('button',{name:'Reintentar'}).click();
  await failedPage.getByRole('button',{name:'Entrar',exact:true}).waitFor();
  await failure.close();
  console.log("MARA_LAUNCH_LOOP_SMOKE PASS");
} finally { await browser.close(); }
