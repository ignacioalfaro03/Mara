import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifestPath = path.join(root, 'payment-activation-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function buildBundle() {
  assert(manifest.status === 'NO_GO', 'Payment activation manifest must remain NO_GO before external proof.');
  assert(manifest.environmentPolicy?.productionActivationAllowed === false, 'Production activation must remain disabled.');
  assert(manifest.environmentPolicy?.connectedProductionMutationAllowed === false, 'Connected production mutation must remain disabled.');

  const blockers = manifest.hardBlockers ?? [];
  const required = blockers.filter((b) => b.required);
  const unsatisfied = required.filter((b) => !b.satisfied);

  assert(required.length > 0, 'Expected hard blockers.');
  assert(unsatisfied.length > 0, 'At least one hard blocker must remain until isolated proof exists.');

  const requiredBlockerIds = new Set([
    'migration_history_reconciled',
    'isolated_nonprod_database',
    'reviewed_drafts_converted_to_migrations',
    'mercado_pago_sandbox_credentials',
    'provider_e2e_capture_refund_chargeback',
    'provider_settlement_report_reconciled',
    'security_advisors_clean',
    'explicit_founder_go_live_authorization'
  ]);

  for (const id of requiredBlockerIds) {
    assert(required.some((b) => b.id === id), `Missing activation blocker: ${id}`);
  }

  const proofSequence = manifest.requiredProofSequence ?? [];
  assert(proofSequence.includes('oauth_connect_creator'), 'Missing OAuth proof step.');
  assert(proofSequence.includes('payment_capture_materialized'), 'Missing capture proof step.');
  assert(proofSequence.includes('partial_refund_does_not_revoke_product'), 'Missing partial refund invariant proof.');
  assert(proofSequence.includes('full_refund_product_reversal'), 'Missing full refund reversal proof.');
  assert(proofSequence.includes('chargeback_product_reversal'), 'Missing chargeback reversal proof.');
  assert(proofSequence.includes('provider_reconciliation_has_zero_critical_issues'), 'Missing provider reconciliation proof.');

  const forbidden = new Set(manifest.forbiddenBeforeGo ?? []);
  for (const action of [
    'production_ddl',
    'production_payment_activation',
    'automatic_creator_payouts',
    'migration_history_repair_without_review',
    'automatic_ledger_auto_heal',
    'merge_without_founder_command'
  ]) {
    assert(forbidden.has(action), `Missing forbidden-before-GO action: ${action}`);
  }

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    activationStatus: manifest.status,
    environmentPolicy: manifest.environmentPolicy,
    activationOrder: manifest.activationOrder,
    requiredContracts: manifest.requiredContracts,
    blockers: required.map(({ id, satisfied, reason }) => ({ id, satisfied, reason })),
    unsatisfiedBlockerIds: unsatisfied.map((b) => b.id),
    requiredProofSequence: proofSequence,
    forbiddenBeforeGo: manifest.forbiddenBeforeGo,
    git: {
      sha: process.env.GITHUB_SHA ?? null,
      ref: process.env.GITHUB_REF ?? null,
      headRef: process.env.GITHUB_HEAD_REF ?? null,
      runId: process.env.GITHUB_RUN_ID ?? null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null
    },
    verdict: 'NO_GO'
  };
}

const bundle = buildBundle();

if (process.argv.includes('--self-test')) {
  assert(bundle.verdict === 'NO_GO', 'Bundle verdict must be NO_GO.');
  assert(bundle.unsatisfiedBlockerIds.includes('isolated_nonprod_database'), 'Isolated non-prod database must still be a blocker.');
  assert(bundle.unsatisfiedBlockerIds.includes('mercado_pago_sandbox_credentials'), 'Mercado Pago sandbox credentials must still be a blocker.');
  assert(bundle.unsatisfiedBlockerIds.includes('explicit_founder_go_live_authorization'), 'Founder GO must still be a blocker.');
  console.log('PAYMENT_RELEASE_EVIDENCE_BUNDLE PASS');
  process.exit(0);
}

const outputArgIndex = process.argv.indexOf('--output');
if (outputArgIndex !== -1) {
  const output = process.argv[outputArgIndex + 1];
  assert(output, '--output requires a path');
  const absolute = path.resolve(root, output);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${absolute}`);
} else {
  console.log(JSON.stringify(bundle, null, 2));
}
