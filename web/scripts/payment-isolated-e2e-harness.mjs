import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'payment-activation-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const args = new Set(process.argv.slice(2));
const execute = args.has('--execute');
const prodProjectRef = 'hctykprkwenhatbjxkpb';
const env = {
  maraE2eEnv: process.env.MARA_E2E_ENV ?? '',
  confirm: process.env.MARA_E2E_CONFIRM ?? '',
  supabaseRef: process.env.SUPABASE_PROJECT_REF ?? '',
  vercelEnv: process.env.VERCEL_ENV ?? '',
  nodeEnv: process.env.NODE_ENV ?? '',
};

function fail(message) {
  console.error(`[payment-isolated-e2e] BLOCKED: ${message}`);
  process.exit(1);
}

function assertManifestSafety() {
  if (manifest.status !== 'NO_GO') fail('activation manifest must remain NO_GO');
  if (manifest.environmentPolicy?.allowed !== 'isolated-non-production-only') {
    fail('manifest must allow only isolated non-production environments');
  }
  if (manifest.environmentPolicy?.productionActivationAllowed !== false) {
    fail('production activation must remain disabled');
  }
  if (manifest.environmentPolicy?.connectedProductionMutationAllowed !== false) {
    fail('connected production mutation must remain disabled');
  }
}

function assertExecutionSafety() {
  if (!execute) return;
  if (env.maraE2eEnv !== 'isolated-nonprod') fail('MARA_E2E_ENV must equal isolated-nonprod');
  if (env.confirm !== 'RUN_ISOLATED_SANDBOX') fail('MARA_E2E_CONFIRM must equal RUN_ISOLATED_SANDBOX');
  if (!env.supabaseRef) fail('SUPABASE_PROJECT_REF is required for execution');
  if (env.supabaseRef === prodProjectRef) fail('connected production Supabase project ref is forbidden');
  if (env.vercelEnv === 'production') fail('VERCEL_ENV=production is forbidden');
  if (env.nodeEnv === 'production') fail('NODE_ENV=production is forbidden for this harness');
}

assertManifestSafety();
assertExecutionSafety();

const result = {
  mode: execute ? 'EXECUTION_GATED' : 'DRY_RUN',
  manifestStatus: manifest.status,
  environmentPolicy: manifest.environmentPolicy,
  blockerCount: manifest.hardBlockers?.filter((b) => b.required && !b.satisfied).length ?? 0,
  activationOrder: manifest.activationOrder,
  requiredProofSequence: manifest.requiredProofSequence,
  forbiddenBeforeGo: manifest.forbiddenBeforeGo,
};

console.log(JSON.stringify(result, null, 2));

if (execute) {
  console.log('[payment-isolated-e2e] Safety gate passed. No provider or database mutation is implemented by this scaffold.');
  console.log('[payment-isolated-e2e] Next authorized implementation step: wire isolated migrations and sandbox provider calls behind these guards.');
}
