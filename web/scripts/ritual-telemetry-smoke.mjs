import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const orphanPublicEvents = [
  "ritual_play_intent",
  "launch_session_completed",
  "visual_choice_completed",
  "prediction_hit",
  "prediction_miss",
  "meet_mara_view",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "es-CL",
});

try {
  await context.addInitScript(() => {
    window.localStorage.setItem("mara_age_gate_passed", "true");
    window.__maraSmokeEvents = [];
    window.addEventListener("mara:analytics", (event) => {
      window.__maraSmokeEvents.push(event.detail);
    });
  });

  const page = await context.newPage();
  await page.goto(`${baseUrl}/experience`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByText(/Esta noche: hamburguesa, papas, bebida y una barra de chocolate/).waitFor();

  const exposureEvents = await page.evaluate(() => window.__maraSmokeEvents);
  assert(exposureEvents.some((record) => record.event === "ritual_viewed"), "Ritual exposure did not emit ritual_viewed");
  assert(!exposureEvents.some((record) => record.event === "ritual_play_intent"), "Ritual exposure incorrectly emitted ritual_play_intent");
  assert(!exposureEvents.some((record) => record.event === "ritual_completed"), "Ritual completion appeared before user completion");

  await page.getByRole("button", { name: "Hecho" }).click();
  await page.getByText(/No me mandes prueba. Te creo/).waitFor();

  const completionEvents = await page.evaluate(() => window.__maraSmokeEvents);
  assert(
    completionEvents.some((record) => record.event === "experience_completed" && record.properties?.surface === "dm_ritual"),
    "Concrete ritual completion did not emit the underlying dm_ritual completion",
  );
  assert(
    completionEvents.some((record) => record.event === "ritual_completed" && record.properties?.surface === "dm_ritual"),
    "Concrete ritual completion did not emit ritual_completed",
  );
  assert(!completionEvents.some((record) => record.event === "ritual_play_intent"), "Legacy fake ritual_play_intent leaked after completion");

  const endpoint = await context.request.post(`${baseUrl}/api/telemetry`, {
    data: {
      event: "ritual_completed",
      properties: {
        surface: "dm_ritual",
        target: "junk_food_date_v1",
        entry_source: "direct",
      },
      timestamp: new Date().toISOString(),
    },
  });
  assert(endpoint.status() === 200, `ritual_completed telemetry returned ${endpoint.status()}`);

  for (const event of orphanPublicEvents) {
    const response = await context.request.post(`${baseUrl}/api/telemetry`, {
      data: {
        event,
        properties: { surface: "launch_smoke", entry_source: "direct" },
        timestamp: new Date().toISOString(),
      },
    });
    assert(response.status() === 400, `${event} is orphaned and must be rejected publicly, got ${response.status()}`);
  }

  console.log("MARA_RITUAL_TELEMETRY_SMOKE PASS");
} finally {
  await browser.close();
}
