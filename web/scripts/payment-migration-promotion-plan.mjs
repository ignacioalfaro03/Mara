import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'payment-activation-manifest.json'), 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const order = manifest.activationOrder ?? [];
assert(order.length > 0, 'Activation order is empty.');
assert(manifest.status === 'NO_GO', 'Migration promotion planning is allowed only while activation remains NO_GO.');

const seen = new Set();
const plan = order.map((relativePath, index) => {
  assert(relativePath.startsWith('supabase/drafts/'), `Activation entry is not draft-only: ${relativePath}`);
  assert(relativePath.endsWith('.sql'), `Activation entry is not SQL: ${relativePath}`);
  assert(!seen.has(relativePath), `Duplicate activation draft: ${relativePath}`);
  seen.add(relativePath);

  const absolute = path.join(root, relativePath);
  assert(fs.existsSync(absolute), `Missing activation draft: ${relativePath}`);
  const sql = fs.readFileSync(absolute, 'utf8');
  assert(sql.trim().length > 0, `Empty activation draft: ${relativePath}`);

  const fileName = path.basename(relativePath);
  return {
    sequence: index + 1,
    source: relativePath,
    proposedMigrationStem: `PAYMENT_ACTIVATION_${String(index + 1).padStart(2, '0')}_${fileName.replace(/\.sql$/i, '')}`,
    sourceBytes: Buffer.byteLength(sql),
    action: 'REVIEW_THEN_COPY_TO_MIGRATIONS_IN_ISOLATED_NONPROD_ONLY'
  };
});

const output = {
  schemaVersion: 1,
  activationStatus: manifest.status,
  policy: 'PLAN_ONLY_NO_FILE_PROMOTION_NO_DB_WRITE',
  prerequisites: [
    'migration_history_reconciled',
    'isolated_nonprod_database',
    'explicit_review_of_generated_migration_names'
  ],
  plan
};

if (process.argv.includes('--self-test')) {
  assert(plan.length === order.length, 'Promotion plan must cover every activation draft exactly once.');
  assert(plan[0].source.endsWith('mara_payment_ledger_v1.sql'), 'Ledger must remain first in activation order.');
  assert(plan.at(-1).source.endsWith('mara_chargeback_product_reversal_v1.sql'), 'Chargeback product reversal must remain last in activation order.');
  assert(output.policy.includes('NO_DB_WRITE'), 'Plan must remain non-mutating.');
  console.log('PAYMENT_MIGRATION_PROMOTION_PLAN PASS');
  process.exit(0);
}

console.log(JSON.stringify(output, null, 2));
