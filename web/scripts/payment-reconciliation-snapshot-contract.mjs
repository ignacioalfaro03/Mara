import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const sql = fs.readFileSync(path.join(root, "supabase/drafts/mara_payment_reconciliation_snapshot_v1.sql"), "utf8");
const migrations = fs.readdirSync(path.join(root, "supabase/migrations"));

assert.match(sql, /READ-ONLY CONTROL PLANE/);
assert.match(sql, /language sql/);
assert.match(sql, /stable/);
assert.match(sql, /PAYMENT_CAPTURE_LEDGER_MISSING/);
assert.match(sql, /SUCCEEDED_PAYMENT_UNFULFILLED/);
assert.match(sql, /PAYMENT_PURCHASE_MISMATCH/);
assert.match(sql, /PAYMENT_REFUND_TOTAL_MISMATCH/);
assert.match(sql, /REFUND_LEDGER_MISSING/);
assert.match(sql, /FULL_REFUND_PRODUCT_REVERSAL_PENDING/);
assert.match(sql, /LEDGER_TRANSACTION_UNBALANCED/);
assert.match(sql, /PAYMENT_PROVIDER_ACCOUNT_SCOPE_MISMATCH/);
assert.match(sql, /'critical'::text/);
assert.match(sql, /'warning'::text/);
assert.match(sql, /grant execute on function public\.mara_payment_reconciliation_snapshot_v1\(\) to service_role/);
assert.doesNotMatch(sql, /grant execute .* to anon/);
assert.doesNotMatch(sql, /grant execute .* to authenticated/);

// The snapshot must remain read-only. Strip SQL comments before mutation checks.
const noComments = sql
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n");
assert.doesNotMatch(noComments, /\binsert\s+into\b/i);
assert.doesNotMatch(noComments, /\bupdate\s+public\./i);
assert.doesNotMatch(noComments, /\bdelete\s+from\b/i);
assert.doesNotMatch(noComments, /\btruncate\b/i);

assert.equal(migrations.some((file) => file.includes("payment_reconciliation_snapshot")), false);

console.log("MARA_PAYMENT_RECONCILIATION_SNAPSHOT_CONTRACT PASS");
