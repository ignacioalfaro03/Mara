import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const source = fs.readFileSync(path.join(process.cwd(), "lib/commerce/payment-ledger-plan.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const ledger = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const platformBears = ledger.buildCaptureJournalPlan({
  paymentId: "pay-1",
  grossAmountMinor: 100000,
  platformFeeMinor: 15000,
  processorFeeMinor: 3500,
  processorFeeBearer: "platform",
  currency: "CLP",
});
assert.equal(platformBears.creatorNetEarningMinor, 85000);
assert.equal(platformBears.transactions.length, 2);
for (const tx of platformBears.transactions) assert.doesNotThrow(() => ledger.assertBalancedTransaction(tx));
assert.equal(platformBears.transactions[1].entries[0].accountCode, "processor_fee_expense");

const creatorBears = ledger.buildCaptureJournalPlan({
  paymentId: "pay-2",
  grossAmountMinor: 100000,
  platformFeeMinor: 15000,
  processorFeeMinor: 3500,
  processorFeeBearer: "creator",
  currency: "CLP",
});
assert.equal(creatorBears.creatorNetEarningMinor, 81500);
assert.equal(creatorBears.transactions[1].entries[0].accountCode, "creator_payable");
for (const tx of creatorBears.transactions) assert.doesNotThrow(() => ledger.assertBalancedTransaction(tx));

assert.throws(() => ledger.buildCaptureJournalPlan({
  paymentId: "pay-3",
  grossAmountMinor: 1000,
  platformFeeMinor: 900,
  processorFeeMinor: 200,
  processorFeeBearer: "creator",
  currency: "CLP",
}), /processor_fee_exceeds_creator_share/);

assert.throws(() => ledger.buildCaptureJournalPlan({
  paymentId: "pay-4",
  grossAmountMinor: 1000,
  platformFeeMinor: 1001,
  processorFeeMinor: 0,
  processorFeeBearer: "platform",
  currency: "CLP",
}), /platform_fee_exceeds_gross/);

assert.match(source, /No hidden default is allowed/);
assert.match(source, /processorFeeBearer/);
assert.match(source, /assertBalancedTransaction/);

console.log("MARA_PAYMENT_LEDGER_PLAN_CONTRACT PASS");
