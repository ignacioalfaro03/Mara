import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const libPath = path.join(here, "..", "lib", "demand-marketplace-lab.ts");
const pagePath = path.join(here, "..", "app", "experience", "demand-marketplace-lab", "page.tsx");
const clientPath = path.join(here, "..", "app", "experience", "demand-marketplace-lab", "DemandMarketplaceLab.tsx");
const foundationPath = path.join(root, "docs", "foundation", "MARA_FOUNDATIONAL_THESIS.md");
const amendmentPath = path.join(root, "MARA_PRIVATE_DEMAND_NETWORK_FOUNDER_AMENDMENT.md");

const lib = fs.readFileSync(libPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");
const client = fs.readFileSync(clientPath, "utf8");
const foundation = fs.readFileSync(foundationPath, "utf8");
const amendment = fs.readFileSync(amendmentPath, "utf8");

// The historical Demand Marketplace may remain as a development lab while its
// useful primitives are evaluated. It must never become production surface or
// regain product-authority status.
assert(page.includes('process.env.NODE_ENV !== "development"'), "Demand Marketplace Lab must be DEV-only");
assert(page.includes("notFound()"), "Demand Marketplace Lab must fail closed outside development");
assert(foundation.includes("MARA IS THE REVENUE OS FOR CREATORS"), "Revenue OS foundation must remain authoritative");
assert(
  foundation.includes("CREATOR → OFFER → FAN → CHECKOUT → PAYMENT → CUSTOMER → CRM → OPPORTUNITY → SECOND PURCHASE"),
  "Canonical Revenue OS business loop must remain authoritative",
);
assert(
  foundation.includes("generic discovery marketplace") && foundation.includes("complex IRL marketplace"),
  "Marketplace-first strategies must remain outside the near-term foundation",
);
assert(amendment.includes("DEPRECATED / HISTORICAL"), "Private Demand Network founder amendment must remain deprecated");
assert(amendment.includes("NOT PRODUCT AUTHORITY"), "Private Demand Network must not regain product authority");
assert(amendment.includes("optional, evidence-driven input to creator opportunities"), "Demand may survive only as an optional opportunity input");

// Preserve the isolated synthetic lab's safety and modeling contracts. These
// checks protect reusable demand primitives without endorsing the old strategy.
for (const required of [
  'id: "mara-audio-collection-online"',
  'id: "mara-masked-night-chillan"',
  'fulfillmentType: "DIGITAL_PRODUCT"',
  'fulfillmentType: "MEMBERSHIP"',
  'fulfillmentType: "COLLAB"',
  'fulfillmentType: "PHYSICAL_EXPERIENCE"',
  'privacyMode: "PSEUDONYMOUS"',
  "pledgedCount",
  "pledgedGmvMinor",
  "verifiedDemandGmvMinor",
  "findSimilarDemand",
  "demandSimilarityScore",
  "weightedAverageWtpMinor",
  "isPhysicalDemand",
]) {
  assert(lib.includes(required), `Missing isolated demand-model token: ${required}`);
}

for (const forbidden of [
  "payment completed",
  "payment approved",
  "host contratado",
  "reserva confirmada",
  "guaranteed demand",
  "identity fully anonymous",
  "vip buys consent",
]) {
  assert(!client.toLowerCase().includes(forbidden.toLowerCase()), `Demand lab must not claim real-world execution: ${forbidden}`);
}

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const response = await fetch(`${baseUrl}/experience/demand-marketplace-lab`, { redirect: "manual" });
assert.equal(response.status, 404, "Demand Marketplace Lab must not be reachable from production server");

console.log("MARA_DEMAND_INPUT_ISOLATION_CONTRACT_SMOKE PASS");
