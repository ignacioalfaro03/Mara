import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const libPath = path.join(here, "..", "lib", "demand-marketplace-lab.ts");
const pagePath = path.join(here, "..", "app", "experience", "demand-marketplace-lab", "page.tsx");
const clientPath = path.join(here, "..", "app", "experience", "demand-marketplace-lab", "DemandMarketplaceLab.tsx");
const strategyPath = path.join(root, "docs", "strategy", "MARA_DEMAND_TO_EXPERIENCE_MARKETPLACE_V1.md");
const amendmentPath = path.join(root, "MARA_DEMAND_TO_EXPERIENCE_FOUNDER_AMENDMENT.md");

const lib = fs.readFileSync(libPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");
const client = fs.readFileSync(clientPath, "utf8");
const strategy = fs.readFileSync(strategyPath, "utf8");
const amendment = fs.readFileSync(amendmentPath, "utf8");

assert(page.includes('process.env.NODE_ENV !== "development"'), "Demand Marketplace Lab must be DEV-only");
assert(page.includes("notFound()"), "Demand Marketplace Lab must fail closed outside development");

for (const required of [
  "VERIFIED DEMAND GMV",
  "MARA ORCHESTRATES. HOSTS EXECUTE.",
  "HOST WANTED",
  "BRING THIS TO MY CITY",
  "DemandRequest",
  "DemandCluster",
  "NO MERGE unless Ignacio explicitly writes `mergea`",
]) {
  assert(strategy.includes(required) || amendment.includes(required), `Missing demand marketplace strategy token: ${required}`);
}

for (const required of [
  'id: "mara-masked-night-chillan"',
  'stage: "HOST_WANTED"',
  "verifiedDemandGmvMinor",
  "interestGmvMinor",
  "findSimilarDemand",
  "demandSimilarityScore",
  "weightedAverageWtpMinor",
]) {
  assert(lib.includes(required), `Missing demand marketplace model token: ${required}`);
}

for (const required of [
  "ME SUMO",
  "¿Cuánto pagarías?",
  "PROPONER EXPERIENCIA",
  "YA HAY ALGO PARECIDO",
  "SOY HOST / ME INTERESA",
  "Este botón no cobra dinero",
]) {
  assert(client.includes(required), `Missing demand marketplace UX contract: ${required}`);
}

for (const forbidden of [
  "payment completed",
  "payment approved",
  "host contratado",
  "reserva confirmada",
  "guaranteed demand",
]) {
  assert(!client.toLowerCase().includes(forbidden.toLowerCase()), `Demand lab must not claim real-world execution: ${forbidden}`);
}

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const response = await fetch(`${baseUrl}/experience/demand-marketplace-lab`, { redirect: "manual" });
assert.equal(response.status, 404, "Demand Marketplace Lab must not be reachable from production server");

console.log("MARA_DEMAND_MARKETPLACE_CONTRACT_SMOKE PASS");
