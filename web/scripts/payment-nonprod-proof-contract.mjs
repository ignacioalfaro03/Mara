import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const proof = JSON.parse(fs.readFileSync(path.join(root, "payment-nonprod-proof-manifest.json"), "utf8"));
const activation = JSON.parse(fs.readFileSync(path.join(root, "payment-activation-manifest.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "payment-activation-lock.json"), "utf8"));

assert.equal(proof.version, 1);
assert.equal(proof.status, "UNPROVEN");
assert.equal(proof.environment.class, "isolated-non-production");
assert.equal(proof.environment.productionAllowed, false);
assert.equal(proof.environment.connectedProductionProjectAllowed, false);
assert.equal(proof.environment.projectRef, null);

assert.equal(proof.provenance.gitCommit, null);
assert.equal(proof.provenance.activationLockCommit, null);
assert.equal(proof.provenance.ciRunId, null);
assert.equal(proof.provenance.executedAt, null);

const requiredProofs = [
  "migration_history_reconciled",
  "reviewed_migrations_applied",
  "security_advisors_clean",
  "creator_oauth_connected",
  "checkout_created",
  "provider_payment_succeeded",
  "signed_webhook_verified",
  "provider_payment_refetched",
  "capture_materialized",
  "capture_ledger_balanced",
  "purchase_fulfilled",
  "partial_refund_product_retained",
  "full_refund_materialized",
  "full_refund_product_reversed",
  "lost_full_chargeback_materialized",
  "chargeback_product_reversed",
  "account_money_batch_completed",
  "provider_reconciliation_zero_critical"
];

assert.deepEqual(proof.proofs.map((item) => item.id), requiredProofs);
assert.equal(new Set(requiredProofs).size, requiredProofs.length);
for (const item of proof.proofs) {
  assert.equal(item.status, "UNPROVEN", `proof must remain unproven until real evidence exists: ${item.id}`);
  assert.equal(item.evidence, null, `synthetic evidence forbidden: ${item.id}`);
}

assert.deepEqual(proof.requiredEvidenceFields, ["kind", "source", "reference", "observedAt"]);
assert.equal(proof.goPolicy.allProofsRequired, true);
assert.equal(proof.goPolicy.zeroCriticalReconciliationIssuesRequired, true);
assert.equal(proof.goPolicy.sameEnvironmentRequired, true);
assert.equal(proof.goPolicy.sameActivationContentRequired, true);
assert.equal(proof.goPolicy.founderGoLiveAuthorizationRequired, true);
assert.equal(proof.goPolicy.automaticPromotionAllowed, false);

// The evidence policy cannot override the activation stack's fail-closed state.
assert.equal(activation.status, "NO_GO");
assert.equal(activation.environmentPolicy.productionActivationAllowed, false);
assert.equal(lock.policy.productionActivationAllowed, false);
assert.equal(lock.policy.mergeWithoutFounderCommandAllowed, false);

// The proof list must cover the material external proof sequence in the activation manifest.
const coverage = new Set(requiredProofs);
for (const required of [
  "provider_payment_succeeded",
  "signed_webhook_verified",
  "provider_payment_refetched",
  "capture_materialized",
  "capture_ledger_balanced",
  "purchase_fulfilled",
  "partial_refund_product_retained",
  "full_refund_materialized",
  "full_refund_product_reversed",
  "lost_full_chargeback_materialized",
  "chargeback_product_reversed",
  "account_money_batch_completed",
  "provider_reconciliation_zero_critical"
]) {
  assert.ok(coverage.has(required), `missing nonprod proof requirement: ${required}`);
}

console.log("MARA_PAYMENT_NONPROD_PROOF_CONTRACT PASS");
