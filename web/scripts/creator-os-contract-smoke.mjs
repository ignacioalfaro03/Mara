import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const libPath = path.join(here, "..", "lib", "creator-os-lab.ts");
const commerceLibPath = path.join(here, "..", "lib", "creator-commerce-lab.ts");
const pagePath = path.join(here, "..", "app", "experience", "creator-os-lab", "page.tsx");
const lib = fs.readFileSync(libPath, "utf8");
const commerceLib = fs.readFileSync(commerceLibPath, "utf8");
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
  "createdAt",
  "scope",
  "consentStatus",
  "creatorVisible",
  "userEditable",
  "visiblePreferenceSignals",
]) {
  assert(lib.includes(required), `Missing Creator OS contract token: ${required}`);
}

for (const required of [
  '"REAL_ME"',
  '"CREATOR_PERSONA"',
  '"VIRTUAL_IDENTITY"',
  '"ASYNC_DIGITAL"',
  '"ACCESS"',
  '"TIME"',
  '"SUPPORT"',
  '"MARA_DISCOVERY"',
  "CreatorOffer",
  "Capricho",
  "ChannelPerformance",
  "syntheticOffers",
  "syntheticCaprichos",
  "syntheticChannels",
  "creatorCommerceSummary",
  "caprichoProgress",
  "gmvPerVisitorMinor",
]) {
  assert(commerceLib.includes(required), `Missing creator commerce contract token: ${required}`);
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
  assert(!commerceLib.includes(forbiddenField), `Synthetic creator commerce data must not contain forbidden field: ${forbiddenField}`);
}

assert(lib.includes("fan.lastCreatorActionDaysAgo < ACTION_COOLDOWN_DAYS"), "Next Best Action must include cooldown logic");
assert(lib.includes("Empieza con valor gratuito, no con presión de compra."), "Dormant reactivation must not default to aggressive upsell");
assert(lib.includes("fan.preferences.filter((signal) => signal.creatorVisible)"), "Creator-visible signal helper must enforce visibility");
assert(page.includes("visiblePreferenceSignals(fan)"), "Creator OS page must render only creator-visible signals");
assert(!page.includes("fan.preferences.map("), "Creator OS page must not bypass creator-visible filtering");
assert(page.includes("scope={signal.scope}"), "Fan 360 UI must expose signal scope provenance");
assert(page.includes("consent={signal.consentStatus}"), "Fan 360 UI must expose consent provenance");

assert(page.includes("Creator Store"), "Creator OS lab must expose Creator Store concept");
assert(page.includes("CAPRICHOS"), "Creator OS lab must expose Caprichos as a first-class rail");
assert(page.includes("BRING YOUR AUDIENCE"), "Creator OS lab must expose BYOA acquisition attribution");
assert(page.includes("syntheticOffers.map"), "Creator OS lab must render synthetic offers");
assert(page.includes("syntheticCaprichos.map"), "Creator OS lab must render synthetic Caprichos");
assert(page.includes("syntheticChannels.map"), "Creator OS lab must render synthetic source attribution");
assert(commerceLib.includes('channel.channel !== "MARA_DISCOVERY"'), "Creator-sourced GMV must remain distinguishable from Mara-sourced GMV");
assert(commerceLib.includes('channel.channel === "MARA_DISCOVERY"'), "Mara-sourced GMV must be explicitly attributable");
assert(commerceLib.includes('fulfillmentMode: "NO_DELIVERABLE"'), "Support/tip rail must be distinguishable from promised deliverables");
assert(commerceLib.includes("contributionMinimumMinor"), "Caprichos must support bounded minimum contribution metadata");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const response = await fetch(`${baseUrl}/experience/creator-os-lab`, { redirect: "manual" });
assert.equal(response.status, 404, "Creator OS synthetic lab must not be reachable from production server");

console.log("MARA_CREATOR_OS_CONTRACT_SMOKE PASS");
