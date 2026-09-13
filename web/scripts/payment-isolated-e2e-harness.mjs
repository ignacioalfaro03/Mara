import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifestPath = path.join(ROOT, "payment-activation-manifest.json");

function fail(message) {
  throw new Error(`[MARA_PAYMENT_E2E_BLOCKED] ${message}`);
}

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function assertManifestShape(manifest) {
  if (manifest.status !== "NO_GO") fail(`activation manifest must remain NO_GO before external proof; got ${manifest.status}`);
  if (manifest.environmentPolicy?.allowed !== "isolated-non-production-only") fail("environment policy must be isolated-non-production-only");
  if (manifest.environmentPolicy?.productionActivationAllowed !== false) fail("production activation must remain disabled");
  if (manifest.environmentPolicy?.connectedProductionMutationAllowed !== false) fail("connected production mutation must remain disabled");
  if (!Array.isArray(manifest.requiredProofSequence) || manifest.requiredProofSequence.length === 0) fail("required proof sequence is missing");
  if (!Array.isArray(manifest.hardBlockers) || manifest.hardBlockers.length === 0) fail("hard blockers are missing");
}

function environmentGate(env = process.env) {
  const errors = [];
  if (env.MARA_ISOLATED_NONPROD !== "true") errors.push("MARA_ISOLATED_NONPROD=true is required");
  if (env.MARA_PAYMENT_E2E_EXECUTE !== "I_UNDERSTAND_NONPROD_ONLY") errors.push("explicit non-production execution acknowledgement is required");
  if (!env.NEXT_PUBLIC_SUPABASE_URL && !env.SUPABASE_URL) errors.push("isolated Supabase URL is required");

  const candidate = (env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || "").toLowerCase();
  const forbiddenHints = ["hctykprkwenhatbjxkpb", "mara_vera"];
  if (forbiddenHints.some((hint) => candidate.includes(hint))) errors.push("connected Mara Supabase project is explicitly forbidden for this harness");

  if (env.VERCEL_ENV === "production" || env.NODE_ENV === "production" && env.MARA_ALLOW_NODE_PRODUCTION !== "test-only") {
    errors.push("production execution context is forbidden");
  }
  return errors;
}

function buildDryRunPlan(manifest) {
  const blockers = manifest.hardBlockers.filter((item) => item.required && !item.satisfied).map((item) => item.id);
  return {
    mode: "dry-run",
    activationStatus: manifest.status,
    environmentPolicy: manifest.environmentPolicy.allowed,
    blockers,
    proofSequence: manifest.requiredProofSequence,
    mutations: [],
    nextAction: blockers.includes("isolated_nonprod_database")
      ? "Provision or authorize an isolated non-production database before any execution."
      : "Supply isolated non-production credentials and run the provider E2E sequence."
  };
}

function selfTest() {
  const manifest = readManifest();
  assertManifestShape(manifest);

  const emptyErrors = environmentGate({});
  if (emptyErrors.length < 3) fail("empty environment did not fail closed");

  const productionErrors = environmentGate({
    MARA_ISOLATED_NONPROD: "true",
    MARA_PAYMENT_E2E_EXECUTE: "I_UNDERSTAND_NONPROD_ONLY",
    SUPABASE_URL: "https://example.supabase.co",
    VERCEL_ENV: "production"
  });
  if (!productionErrors.some((entry) => entry.includes("production"))) fail("production context was not blocked");

  const connectedProjectErrors = environmentGate({
    MARA_ISOLATED_NONPROD: "true",
    MARA_PAYMENT_E2E_EXECUTE: "I_UNDERSTAND_NONPROD_ONLY",
    SUPABASE_URL: "https://hctykprkwenhatbjxkpb.supabase.co",
    NODE_ENV: "test"
  });
  if (!connectedProjectErrors.some((entry) => entry.includes("explicitly forbidden"))) fail("connected project was not blocked");

  const cleanErrors = environmentGate({
    MARA_ISOLATED_NONPROD: "true",
    MARA_PAYMENT_E2E_EXECUTE: "I_UNDERSTAND_NONPROD_ONLY",
    SUPABASE_URL: "https://isolated-example.supabase.co",
    NODE_ENV: "test"
  });
  if (cleanErrors.length !== 0) fail(`valid isolated test environment unexpectedly blocked: ${cleanErrors.join("; ")}`);

  const plan = buildDryRunPlan(manifest);
  if (plan.mutations.length !== 0 || plan.activationStatus !== "NO_GO") fail("dry-run plan is not mutation-free/NO_GO");
  console.log("MARA_PAYMENT_ISOLATED_E2E_HARNESS_SELFTEST PASS");
}

const args = new Set(process.argv.slice(2));
const manifest = readManifest();
assertManifestShape(manifest);

if (args.has("--self-test")) {
  selfTest();
  process.exit(0);
}

if (!args.has("--execute")) {
  console.log(JSON.stringify(buildDryRunPlan(manifest), null, 2));
  process.exit(0);
}

const gateErrors = environmentGate();
if (gateErrors.length) fail(gateErrors.join("; "));

// Deliberately fail until the isolated database and provider credentials are explicitly authorized.
// This file is a safety harness, not a hidden production activation path.
fail("execution adapter intentionally disabled until isolated non-production infrastructure is authorized and wired");
