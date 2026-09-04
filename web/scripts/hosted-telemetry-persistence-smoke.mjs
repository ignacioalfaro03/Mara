import crypto from "node:crypto";

const baseUrl = normalizeBaseUrl(process.env.BASE_URL || "http://127.0.0.1:3000");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeBaseUrl(value) {
  const trimmed = value.trim().replace(/\/$/, "");
  assert(trimmed.length > 0, "BASE_URL is required");
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

const response = await fetch(`${baseUrl}/api/telemetry`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: "page_view",
    properties: {
      surface: "/qa-telemetry-preview",
      entry_source: "direct",
    },
    timestamp: new Date().toISOString(),
    sessionId: crypto.randomUUID(),
  }),
});

assert(response.status === 200, `/api/telemetry returned ${response.status}`);

let body;
try {
  body = await response.json();
} catch {
  throw new Error("/api/telemetry did not return JSON");
}

assert(body?.ok === true, `/api/telemetry ok was ${body?.ok}`);
assert(body?.persisted === true, `/api/telemetry persisted was ${body?.persisted}`);

console.log("MARA_TELEMETRY_PERSISTENCE_SMOKE PASS");
