import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const libPath = path.join(here, "..", "lib", "demand-marketplace-lab.ts");
const pagePath = path.join(here, "..", "app", "experience", "demand-marketplace-lab", "page.tsx");
const clientPath = path.join(here, "..", "app", "experience", "demand-marketplace-lab", "DemandMarketplaceLab.tsx");
const strategyPath = path.join(root, "docs", "strategy", "MARA_PRIVATE_DEMAND_NETWORK_V2.md");
const amendmentPath = path.join(root, "MARA_PRIVATE_DEMAND_NETWORK_FOUNDER_AMENDMENT.md");
const auditPath = path.join(root, "docs", "audits", "PRIVATE_DEMAND_NETWORK_PRODUCT_AUDIT.md");

const lib = fs.readFileSync(libPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");
const client = fs.readFileSync(clientPath, "utf8");
const strategy = fs.readFileSync(strategyPath, "utf8");
const amendment = fs.readFileSync(amendmentPath, "utf8");
const audit = fs.readFileSync(auditPath, "utf8");

assert(page.includes('process.env.NODE_ENV !== "development"'), "Demand Marketplace Lab must be DEV-only");
assert(page.includes("notFound()"), "Demand Marketplace Lab must fail closed outside development");

for (const required of [
  "PRIVATE DEMAND NETWORK FOR CREATOR WORLDS",
  "DEMAND FIRST. SUPPLY SECOND.",
  "CREATOR PROVIDES GRAVITY",
  "COMMUNITY PROVIDES ACTIVITY",
  "VERIFIED PSEUDONYMITY",
  "MY HISTORY",
  "EVENT VIP",
  "ROLE MARKETPLACE",
  "MARA IRL",
  "A PAYMENT OR TICKET NEVER PURCHASES ANOTHER PERSON'S CONSENT",
  "NO MERGE unless Ignacio explicitly writes `mergea`",
]) {
  assert(
    strategy.includes(required) || amendment.includes(required) || audit.includes(required),
    `Missing Private Demand Network strategy token: ${required}`,
  );
}

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
  assert(lib.includes(required), `Missing private demand model token: ${required}`);
}

for (const required of [
  "PRIVATE DEMAND NETWORK",
  "¿Qué quieres que exista?",
  "ME SUMO · WANT",
  "PLEDGE",
  "COMMIT",
  "MAKE IT HAPPEN",
  "WHAT YOUR WORLD WANTS",
  "MY HISTORY · RETENTION PROOF",
  "Privacy ·",
  "Este V2 guarda historia solo en estado local",
  "no cobran dinero",
]) {
  assert(client.toUpperCase().includes(required.toUpperCase()), `Missing Private Demand Network UX contract: ${required}`);
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

console.log("MARA_PRIVATE_DEMAND_NETWORK_CONTRACT_SMOKE PASS");
