import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "payment-activation-manifest.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "payment-activation-lock.json"), "utf8"));

const gitBlobSha = (relativePath) => {
  const bytes = fs.readFileSync(path.join(root, relativePath));
  const header = Buffer.from(`blob ${bytes.length}\0`);
  return crypto.createHash("sha1").update(header).update(bytes).digest("hex");
};

assert.equal(lock.version, 1);
assert.equal(lock.algorithm, "git-blob-sha1");
assert.match(lock.lockedFromCommit, /^[a-f0-9]{40}$/);

const activationPaths = lock.activation.map((entry) => entry.path);
assert.deepEqual(activationPaths, manifest.activationOrder, "activation lock must exactly match manifest order");
assert.equal(new Set(activationPaths).size, activationPaths.length, "activation lock paths must be unique");

for (const entry of [...lock.activation, ...lock.controlEvidence]) {
  assert.match(entry.path, /^(supabase\/drafts\/|supabase\/migration-reconciliation\.snapshot\.json$)/);
  assert.match(entry.blobSha, /^[a-f0-9]{40}$/);
  assert.ok(fs.existsSync(path.join(root, entry.path)), `locked file missing: ${entry.path}`);
  const actual = gitBlobSha(entry.path);
  assert.equal(actual, entry.blobSha, `payment activation content drift: ${entry.path}`);
}

assert.equal(lock.controlEvidence.length, 1);
assert.equal(lock.controlEvidence[0].path, "supabase/migration-reconciliation.snapshot.json");

// Locking content must never weaken the fail-closed release decision.
assert.equal(manifest.status, "NO_GO");
assert.equal(manifest.environmentPolicy.productionActivationAllowed, false);
assert.equal(manifest.environmentPolicy.connectedProductionMutationAllowed, false);
assert.equal(lock.policy.silentDriftAllowed, false);
assert.equal(lock.policy.lockUpdateRequiresReview, true);
assert.equal(lock.policy.productionActivationAllowed, false);
assert.equal(lock.policy.mergeWithoutFounderCommandAllowed, false);

// Activation SQL remains draft-only. A locked draft appearing in migrations is a hard failure.
const migrationNames = fs.readdirSync(path.join(root, "supabase/migrations"));
for (const entry of lock.activation) {
  const baseName = path.basename(entry.path);
  assert.equal(
    migrationNames.some((name) => name.endsWith(baseName)),
    false,
    `locked draft unexpectedly present in migrations: ${baseName}`
  );
}

console.log("MARA_PAYMENT_ACTIVATION_LOCK_CONTRACT PASS");
