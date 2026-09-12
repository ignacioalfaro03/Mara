import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "lib/commerce/payment-reconciliation.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const providerContract = fs.readFileSync(path.join(process.cwd(), "lib/commerce/payment-provider-contract.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const { reconcilePayment, reconcilePaymentInventory, reconciliationRequiresHold } = await import(moduleUrl);

const mara = (overrides = {}) => ({
  paymentId: "payment-1",
  checkoutIntentId: "checkout-1",
  provider: "mercado_pago_split",
  providerPaymentId: "mp-1",
  providerAccountId: "seller-1",
  amountMinor: 100_000,
  refundedAmountMinor: 0,
  currency: "CLP",
  status: "succeeded",
  processorFeeMinor: 3_500,
  ...overrides,
});

const provider = (overrides = {}) => ({
  providerPaymentId: "mp-1",
  providerAccountId: "seller-1",
  providerExternalReference: "checkout-1",
  amountMinor: 100_000,
  refundedAmountMinor: 0,
  currency: "CLP",
  status: "succeeded",
  processorFeeMinor: 3_500,
  providerCreatedAt: "2026-09-12T12:00:00.000Z",
  providerUpdatedAt: "2026-09-12T12:01:00.000Z",
  ...overrides,
});

const clean = reconcilePayment(mara(), provider());
assert.equal(clean.matches, true);
assert.equal(clean.issues.length, 0);
assert.equal(reconciliationRequiresHold(clean), false);

const moneyMismatch = reconcilePayment(mara(), provider({ amountMinor: 99_900 }));
assert.equal(moneyMismatch.matches, false);
assert.equal(moneyMismatch.issues[0].code, "AMOUNT_MISMATCH");
assert.equal(moneyMismatch.issues[0].severity, "critical");
assert.equal(reconciliationRequiresHold(moneyMismatch), true);

const accountMismatch = reconcilePayment(mara(), provider({ providerAccountId: "seller-2" }));
assert.equal(accountMismatch.issues[0].code, "PROVIDER_ACCOUNT_MISMATCH");
assert.equal(reconciliationRequiresHold(accountMismatch), true);

const externalReferenceMismatch = reconcilePayment(mara(), provider({ providerExternalReference: "checkout-wrong" }));
assert.equal(externalReferenceMismatch.issues[0].code, "EXTERNAL_REFERENCE_MISMATCH");

const refundMismatch = reconcilePayment(
  mara({ status: "partially_refunded", refundedAmountMinor: 25_000 }),
  provider({ status: "partially_refunded", refundedAmountMinor: 20_000 }),
);
assert.equal(refundMismatch.issues[0].code, "REFUNDED_AMOUNT_MISMATCH");

const feeMismatch = reconcilePayment(mara(), provider({ processorFeeMinor: 3_600 }));
assert.equal(feeMismatch.issues[0].code, "PROCESSOR_FEE_MISMATCH");
assert.equal(feeMismatch.issues[0].severity, "warning");
assert.equal(reconciliationRequiresHold(feeMismatch), false);

const unknownFee = reconcilePayment(mara({ processorFeeMinor: null }), provider({ processorFeeMinor: 3_600 }));
assert.equal(unknownFee.matches, true, "unknown Mara fee must not invent a mismatch before fee materialization");

const inventory = reconcilePaymentInventory(["mp-1", "mp-missing-at-provider"], ["mp-1", "mp-missing-in-mara"]);
assert.equal(inventory.matches, false);
assert.deepEqual(
  inventory.issues.map((item) => item.code).sort(),
  ["PAYMENT_MISSING_AT_PROVIDER", "PAYMENT_MISSING_IN_MARA"].sort(),
);

assert.match(source, /PROVIDER_ACCOUNT_MISMATCH/);
assert.match(source, /EXTERNAL_REFERENCE_MISMATCH/);
assert.match(source, /PAYMENT_MISSING_IN_MARA/);
assert.match(source, /PAYMENT_MISSING_AT_PROVIDER/);
assert.doesNotMatch(source, /\bfetch\s*\(/, "reconciliation domain engine must remain pure and provider-neutral");
assert.doesNotMatch(source, /process\.env/);
assert.doesNotMatch(providerContract, /credentialReference:\s*string[\s\S]*accessToken/i, "provider contract must not expose raw tokens alongside opaque refs");

console.log("MARA_PAYMENT_RECONCILIATION_CONTRACT PASS");