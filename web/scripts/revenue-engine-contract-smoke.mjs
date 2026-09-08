import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const libPath = path.join(here, "..", "lib", "revenue-engine-lab.ts");
const pagePath = path.join(here, "..", "app", "experience", "revenue-engine-lab", "page.tsx");
const strategyPath = path.join(here, "..", "..", "docs", "strategy", "MARA_REVENUE_EXPANSION_PLATFORM_V1.md");

const lib = fs.readFileSync(libPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");
const strategy = fs.readFileSync(strategyPath, "utf8");

assert(page.includes('process.env.NODE_ENV !== "development"'), "Revenue Engine Lab must be DEV-only");
assert(page.includes("notFound()"), "Revenue Engine Lab must fail closed outside development");
assert(page.includes("Hipótesis, no forecast."), "Lab must explicitly label synthetic assumptions");

for (const required of [
  'id: "marketplace-mara-sourced"',
  'id: "creator-pro"',
  'id: "mara-growth"',
  'id: "agency-os"',
  'id: "brand-marketplace"',
  'id: "creator-app-store"',
  "attributedAcquisitionCostMinor",
  "contributionMinor",
  "marginPercent",
  "doNotBuildRevenueIdeas",
]) {
  assert(lib.includes(required), `Missing revenue-engine contract token: ${required}`);
}

for (const forbidden of [
  "guaranteed revenue",
  "guaranteed income",
  "Stripe is approved",
  "production payment enabled",
]) {
  assert(!lib.toLowerCase().includes(forbidden.toLowerCase()), `Revenue lab must not claim: ${forbidden}`);
}

for (const strategicContract of [
  "MARA GROWTH ATTRIBUTION CONTRACT",
  "MARA-ATTRIBUTED CREATOR EARNINGS",
  "AGENCY OS",
  "BRAND MARKETPLACE",
  "CREATOR APP STORE ARCHITECTURE",
  "DO NOT BUILD",
  "NO MERGE unless Ignacio explicitly writes `mergea`",
]) {
  assert(strategy.includes(strategicContract), `Missing revenue strategy contract: ${strategicContract}`);
}

assert(strategy.includes("category walls"), "Brand marketplace must include category-wall/brand-safety architecture");
assert(strategy.includes("Creator-sourced demand should not automatically pay the same economics as Mara-sourced demand."), "Strategy must preserve source-aware economics");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const response = await fetch(`${baseUrl}/experience/revenue-engine-lab`, { redirect: "manual" });
assert.equal(response.status, 404, "Revenue Engine Lab must not be reachable from production server");

console.log("MARA_REVENUE_ENGINE_CONTRACT_SMOKE PASS");
