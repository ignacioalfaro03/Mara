import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "payment-activation-manifest.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const migrations = new Set(fs.readdirSync(path.join(root, "supabase/migrations")));

assert.equal(manifest.version, 1);
assert.equal(manifest.status, "NO_GO");
assert.equal(manifest.environmentPolicy.allowed, "isolated-non-production-only");
assert.equal(manifest.environmentPolicy.productionActivationAllowed, false);
assert.equal(manifest.environmentPolicy.connectedProductionMutationAllowed, false);

assert.ok(Array.isArray(manifest.activationOrder));
assert.ok(manifest.activationOrder.length >= 12);
assert.equal(new Set(manifest.activationOrder).size, manifest.activationOrder.length);

for (const relative of manifest.activationOrder) {
  const absolute = path.join(root, relative);
  assert.ok(fs.existsSync(absolute), `Activation draft missing: ${relative}`);
  assert.ok(relative.startsWith("supabase/drafts/"), `Activation file must remain draft-only: ${relative}`);
  const basename = path.basename(relative);
  assert.equal(migrations.has(basename), false, `Draft unexpectedly present in migrations: ${basename}`);
}

const indexOf = (name) => manifest.activationOrder.indexOf(`supabase/drafts/${name}`);
const before = (a, b) => {
  const ai = indexOf(a);
  const bi = indexOf(b);
  assert.ok(ai >= 0 && bi >= 0, `Missing dependency pair ${a} -> ${b}`);
  assert.ok(ai < bi, `${a} must activate before ${b}`);
};

before("mara_payment_ledger_v1.sql", "mara_payment_capture_materialization_v1.sql");
before("mara_mp_sandbox_vault_bridge_v1.sql", "mara_mp_sandbox_oauth_rpc_v1.sql");
before("mara_mp_sandbox_oauth_rpc_v1.sql", "mara_payment_capture_materialization_v1.sql");
before("mara_mp_sandbox_webhook_binding_v1.sql", "mara_payment_capture_materialization_v1.sql");
before("mara_payment_capture_materialization_v1.sql", "mara_payment_backed_fulfillment_v1.sql");
before("mara_payment_backed_fulfillment_v1.sql", "mara_payment_refund_materialization_v1.sql");
before("mara_payment_refund_materialization_v1.sql", "mara_full_refund_product_reversal_v1.sql");
before("mara_payment_capture_materialization_v1.sql", "mara_payment_chargeback_dispute_control_v1.sql");
before("mara_payment_chargeback_dispute_control_v1.sql", "mara_provider_settlement_reconciliation_v1.sql");
before("mara_payment_chargeback_dispute_control_v1.sql", "mara_chargeback_product_reversal_v1.sql");

for (const script of manifest.requiredContracts) {
  assert.ok(pkg.scripts?.[script], `Required contract missing from package.json: ${script}`);
}

const blockers = manifest.hardBlockers.filter((b) => b.required);
assert.ok(blockers.length >= 8);
assert.ok(blockers.every((b) => b.satisfied === false), "Repository must remain NO_GO until externally proven blockers are satisfied");

for (const requiredId of [
  "migration_history_reconciled",
  "isolated_nonprod_database",
  "reviewed_drafts_converted_to_migrations",
  "mercado_pago_sandbox_credentials",
  "provider_e2e_capture_refund_chargeback",
  "provider_settlement_report_reconciled",
  "security_advisors_clean",
  "explicit_founder_go_live_authorization"
]) {
  assert.ok(blockers.some((b) => b.id === requiredId), `Missing hard blocker: ${requiredId}`);
}

assert.ok(manifest.requiredProofSequence.includes("partial_refund_does_not_revoke_product"));
assert.ok(manifest.requiredProofSequence.includes("chargeback_product_reversal"));
assert.ok(manifest.requiredProofSequence.includes("provider_reconciliation_has_zero_critical_issues"));
assert.ok(manifest.forbiddenBeforeGo.includes("production_ddl"));
assert.ok(manifest.forbiddenBeforeGo.includes("automatic_creator_payouts"));
assert.ok(manifest.forbiddenBeforeGo.includes("merge_without_founder_command"));

console.log("MARA_PAYMENT_ACTIVATION_READINESS_CONTRACT PASS — STATUS NO_GO");
