const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function postTelemetry(payload) {
  const response = await fetch(`${baseUrl}/api/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

const ordinary = await postTelemetry({
  event: "ritual_completed",
  properties: {
    surface: "dm_ritual",
    target: "junk_food_date_v1",
    entry_source: "direct",
  },
  timestamp: new Date().toISOString(),
  sessionId: crypto.randomUUID(),
});

assert(ordinary.response.status === 200, `ordinary telemetry returned ${ordinary.response.status}`);
assert(ordinary.body?.ok === true, "ordinary telemetry was not accepted");
assert(ordinary.body?.decisionEligible === false, "non-Vercel/local runtime must not be decision eligible");
assert(ordinary.body?.suppressed === true, "ordinary non-canonical telemetry must be suppressed");
assert(ordinary.body?.persisted === false, "suppressed ordinary telemetry must not persist");

const technicalProbe = await postTelemetry({
  event: "page_view",
  properties: {
    surface: "/qa-telemetry-preview",
    entry_source: "direct",
  },
  timestamp: new Date().toISOString(),
  sessionId: crypto.randomUUID(),
});

assert(technicalProbe.response.status === 200, `QA probe returned ${technicalProbe.response.status}`);
assert(technicalProbe.body?.ok === true, "QA persistence probe was not accepted");
assert(technicalProbe.body?.decisionEligible === false, "QA persistence probe must never be decision eligible");
assert(technicalProbe.body?.suppressed === false, "fixed QA persistence probe must reach the persistence path");

console.log("MARA_TELEMETRY_ENVIRONMENT_SMOKE PASS");
