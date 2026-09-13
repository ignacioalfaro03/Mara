import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const script = 'scripts/payment-isolated-e2e-harness.mjs';
const manifest = JSON.parse(fs.readFileSync('payment-activation-manifest.json', 'utf8'));

function run(args = [], env = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const dry = run();
assert(dry.status === 0, `dry-run must pass: ${dry.stderr}`);
const dryPayload = JSON.parse(dry.stdout);
assert(dryPayload.mode === 'DRY_RUN', 'default mode must be DRY_RUN');
assert(dryPayload.manifestStatus === 'NO_GO', 'manifest must remain NO_GO');
assert(Array.isArray(dryPayload.requiredProofSequence), 'proof sequence must be surfaced');
assert(dryPayload.requiredProofSequence.length === manifest.requiredProofSequence.length, 'proof sequence must match manifest');

const prod = run(['--execute'], {
  MARA_E2E_ENV: 'isolated-nonprod',
  MARA_E2E_CONFIRM: 'RUN_ISOLATED_SANDBOX',
  SUPABASE_PROJECT_REF: 'hctykprkwenhatbjxkpb',
  VERCEL_ENV: 'preview',
  NODE_ENV: 'test',
});
assert(prod.status !== 0, 'connected production Supabase ref must fail closed');
assert(prod.stderr.includes('connected production Supabase project ref is forbidden'), 'production-ref rejection must be explicit');

const vercelProd = run(['--execute'], {
  MARA_E2E_ENV: 'isolated-nonprod',
  MARA_E2E_CONFIRM: 'RUN_ISOLATED_SANDBOX',
  SUPABASE_PROJECT_REF: 'isolated-test-ref',
  VERCEL_ENV: 'production',
  NODE_ENV: 'test',
});
assert(vercelProd.status !== 0, 'VERCEL_ENV=production must fail closed');

const safe = run(['--execute'], {
  MARA_E2E_ENV: 'isolated-nonprod',
  MARA_E2E_CONFIRM: 'RUN_ISOLATED_SANDBOX',
  SUPABASE_PROJECT_REF: 'isolated-test-ref',
  VERCEL_ENV: 'preview',
  NODE_ENV: 'test',
});
assert(safe.status === 0, `isolated guard should pass: ${safe.stderr}`);
assert(safe.stdout.includes('No provider or database mutation is implemented'), 'scaffold must explicitly remain non-mutating');

console.log('payment-isolated-e2e-harness contract: PASS');
