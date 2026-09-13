import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "payment-activation-manifest.json"), "utf8"));

const CONNECTED_PROJECT_HINTS = ["hctykprkwenhatbjxkpb", "mara_vera"];
const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "MERCADO_PAGO_CLIENT_ID",
  "MERCADO_PAGO_CLIENT_SECRET",
  "MERCADO_PAGO_WEBHOOK_SECRET",
  "MERCADO_PAGO_OAUTH_REDIRECT_URI",
  "MERCADO_PAGO_WEBHOOK_BASE_URL"
];

function fail(message) {
  throw new Error(`[MARA_NONPROD_ACTIVATION_BLOCKED] ${message}`);
}

function inspectEnvironment(env = process.env) {
  const reasons = [];
  const url = String(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "").toLowerCase();

  if (manifest.status !== "NO_GO") reasons.push(`activation manifest must remain NO_GO; got ${manifest.status}`);
  if (manifest.environmentPolicy?.allowed !== "isolated-non-production-only") reasons.push("manifest must allow isolated non-production only");
  if (manifest.environmentPolicy?.productionActivationAllowed !== false) reasons.push("production activation must remain disabled");
  if (manifest.environmentPolicy?.connectedProductionMutationAllowed !== false) reasons.push("connected production mutation must remain disabled");

  if (env.MARA_ISOLATED_NONPROD !== "true") reasons.push("MARA_ISOLATED_NONPROD=true is required");
  if (env.MARA_PAYMENT_ACTIVATION_PREFLIGHT !== "I_UNDERSTAND_ISOLATED_NONPROD_ONLY") reasons.push("explicit isolated non-production acknowledgement is required");
  if (env.VERCEL_ENV === "production") reasons.push("VERCEL_ENV=production is forbidden");
  if (env.NODE_ENV === "production" && env.MARA_ALLOW_NODE_PRODUCTION !== "test-only") reasons.push("NODE_ENV=production is forbidden");

  if (!url) reasons.push("isolated Supabase URL is required");
  if (CONNECTED_PROJECT_HINTS.some((hint) => url.includes(hint))) reasons.push("currently connected Mara Supabase project is explicitly forbidden");

  const missingEnv = REQUIRED_ENV.filter((name) => !env[name]);
  if (missingEnv.length) reasons.push(`missing required isolated/sandbox environment variables: ${missingEnv.join(", ")}`);

  const unsatisfiedBlockers = manifest.hardBlockers
    .filter((item) => item.required && !item.satisfied)
    .map((item) => item.id);

  const externalProofBlockers = new Set([
    "migration_history_reconciled",
    "isolated_nonprod_database",
    "reviewed_drafts_converted_to_migrations",
    "mercado_pago_sandbox_credentials",
    "provider_e2e_capture_refund_chargeback",
    "provider_settlement_report_reconciled",
    "security_advisors_clean"
  ]);

  const unresolvedBeforeExecution = unsatisfiedBlockers.filter((id) => externalProofBlockers.has(id));
  if (unresolvedBeforeExecution.length) reasons.push(`manifest blockers still unresolved: ${unresolvedBeforeExecution.join(", ")}`);

  return {
    ready: reasons.length === 0,
    status: manifest.status,
    mode: "isolated-non-production-preflight",
    reasons,
    requiredEnvNames: REQUIRED_ENV,
    missingEnv,
    unsatisfiedBlockers,
    productionMutationAllowed: false,
    secretsEchoed: false,
    mutations: []
  };
}

function selfTest() {
  const empty = inspectEnvironment({});
  if (empty.ready) fail("empty environment unexpectedly passed");
  if (!empty.reasons.some((reason) => reason.includes("MARA_ISOLATED_NONPROD"))) fail("missing isolation marker was not detected");
  if (!empty.reasons.some((reason) => reason.includes("missing required isolated/sandbox"))) fail("missing credential names were not detected");

  const connected = inspectEnvironment({
    MARA_ISOLATED_NONPROD: "true",
    MARA_PAYMENT_ACTIVATION_PREFLIGHT: "I_UNDERSTAND_ISOLATED_NONPROD_ONLY",
    SUPABASE_URL: "https://hctykprkwenhatbjxkpb.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test",
    MERCADO_PAGO_CLIENT_ID: "test",
    MERCADO_PAGO_CLIENT_SECRET: "test",
    MERCADO_PAGO_WEBHOOK_SECRET: "test",
    MERCADO_PAGO_OAUTH_REDIRECT_URI: "https://example.test/callback",
    MERCADO_PAGO_WEBHOOK_BASE_URL: "https://example.test"
  });
  if (!connected.reasons.some((reason) => reason.includes("explicitly forbidden"))) fail("connected project was not blocked");

  const production = inspectEnvironment({
    MARA_ISOLATED_NONPROD: "true",
    MARA_PAYMENT_ACTIVATION_PREFLIGHT: "I_UNDERSTAND_ISOLATED_NONPROD_ONLY",
    SUPABASE_URL: "https://isolated-example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test",
    MERCADO_PAGO_CLIENT_ID: "test",
    MERCADO_PAGO_CLIENT_SECRET: "test",
    MERCADO_PAGO_WEBHOOK_SECRET: "test",
    MERCADO_PAGO_OAUTH_REDIRECT_URI: "https://example.test/callback",
    MERCADO_PAGO_WEBHOOK_BASE_URL: "https://example.test",
    VERCEL_ENV: "production"
  });
  if (!production.reasons.some((reason) => reason.includes("production"))) fail("production context was not blocked");

  if (empty.secretsEchoed !== false || empty.mutations.length !== 0) fail("preflight must remain secret-safe and mutation-free");
  if (!empty.unsatisfiedBlockers.includes("isolated_nonprod_database")) fail("expected isolated database blocker is missing");

  console.log("MARA_PAYMENT_NONPROD_ACTIVATION_PREFLIGHT_SELFTEST PASS");
}

if (process.argv.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

const result = inspectEnvironment();
console.log(JSON.stringify(result, null, 2));
if (!result.ready) process.exitCode = 2;
