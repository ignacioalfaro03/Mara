import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const libPath = path.join(here, "..", "lib", "creator-os-lab.ts");
const pagePath = path.join(here, "..", "app", "experience", "creator-os-lab", "page.tsx");
const lib = fs.readFileSync(libPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");

assert(page.includes('process.env.NODE_ENV !== "development"'), "Creator OS lab must be DEV-only");
assert(page.includes("notFound()"), "Creator OS lab must fail closed outside development");

for (const required of [
  '"USER_DECLARED"',
  '"PURCHASE_BEHAVIOR"',
  '"DERIVED"',
  '"CREATOR"',
  '"MARA"',
  '"WAIT"',
  '"NO_ACTION"',
  "ACTION_COOLDOWN_DAYS",
  "earningsPerCreatorHour",
  "dashboardSummary",
]) {
  assert(lib.includes(required), `Missing Creator OS contract token: ${required}`);
}

for (const forbiddenField of [
  "legalName",
  "legal_name",
  "email:",
  "phone:",
  "phoneNumber",
  "governmentId",
  "government_id",
  "paymentCredential",
  "sexual_orientation",
  "health_condition",
  "mental_health",
  "financial_desperation",
  "loneliness_score",
  "dependency_score",
]) {
  assert(!lib.includes(forbiddenField), `Synthetic Fan 360 must not contain forbidden field: ${forbiddenField}`);
}

assert(lib.includes("fan.lastCreatorActionDaysAgo < ACTION_COOLDOWN_DAYS"), "Next Best Action must include cooldown logic");
assert(lib.includes("Empieza con valor gratuito, no con presión de compra."), "Dormant reactivation must not default to aggressive upsell");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const response = await fetch(`${baseUrl}/experience/creator-os-lab`, { redirect: "manual" });
assert.equal(response.status, 404, "Creator OS synthetic lab must not be reachable from production server");

console.log("MARA_CREATOR_OS_CONTRACT_SMOKE PASS");
