import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const paymentConfig = read("lib/commerce/config.ts");
const checkout = read("app/api/commerce/checkout/route.ts");
const ledgerDraft = read("supabase/drafts/mara_payment_ledger_v1.sql");
const ledgerDoc = read("../docs/architecture/PAYMENTS_LEDGER.md");

// Real-money execution must remain impossible until a dedicated provider adapter is reviewed.
assert.match(paymentConfig, /provider:\s*"signed_test"/);
assert.doesNotMatch(paymentConfig, /provider:\s*"mercado_pago_split"/);
assert.doesNotMatch(paymentConfig, /provider:\s*"stripe_connect"/);
assert.match(checkout, /creator_offer_live_payment_not_authorized/);
assert.match(checkout, /payment_provider_not_implemented/);

// The Chile provider direction is explicit but non-executable.
assert.match(ledgerDoc, /Primary integration candidate for the Chile MVP: \*\*Mercado Pago Split Payments 1:1\*\*/);
assert.match(ledgerDoc, /NOT PAYMENT READY/);
assert.match(ledgerDoc, /founder explicitly authorizes real payments/);

// Financial truth must be richer than commerce_purchases alone.
for (const table of [
  "creator_payment_accounts",
  "commerce_payments",
  "commerce_refunds",
  "creator_payouts",
  "commerce_ledger_transactions",
  "commerce_ledger_entries",
]) {
  assert.match(ledgerDraft, new RegExp(`create table if not exists public\\.${table}`));
  assert.match(ledgerDraft, new RegExp(`alter table public\\.${table} enable row level security`));
  assert.match(ledgerDraft, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`));
}

// Provider identities and transaction idempotency must be unique.
assert.match(ledgerDraft, /unique \(provider, provider_payment_id\)/);
assert.match(ledgerDraft, /unique \(provider, provider_refund_id\)/);
assert.match(ledgerDraft, /idempotency_key text not null unique/);
assert.match(ledgerDraft, /commerce_ledger_provider_event_type_uniq/);

// Ledger is append-only and validated as balanced by currency.
assert.match(ledgerDraft, /reject_mara_financial_ledger_mutation/);
assert.match(ledgerDraft, /before update or delete on public\.commerce_ledger_transactions/);
assert.match(ledgerDraft, /before update or delete on public\.commerce_ledger_entries/);
assert.match(ledgerDraft, /assert_mara_ledger_transaction_balanced/);
assert.match(ledgerDraft, /having coalesce\(sum\(amount_minor\) filter \(where direction = 'debit'\), 0\)/);
assert.match(ledgerDraft, /<> coalesce\(sum\(amount_minor\) filter \(where direction = 'credit'\), 0\)/);

// A draft is not an activated migration.
assert.match(ledgerDraft, /DRAFT ONLY/);
assert.match(ledgerDraft, /DO NOT APPLY DIRECTLY/);
assert.match(ledgerDoc, /deliberately \*\*not\*\* in `supabase\/migrations`/);

console.log("MARA_PAYMENT_READINESS_CONTRACT PASS");
