import assert from "node:assert/strict";

function initial() {
  return {
    payment: "none",
    ledger: { capture: false, refundMinor: 0, chargeback: false },
    purchase: "none",
    entitlement: "none",
    capturedMinor: 0,
    refundedMinor: 0,
    dispute: "none",
    chargebackCase: "none",
    providerReport: "none",
  };
}

function capture(s, amount) {
  assert.equal(s.payment, "none");
  assert.ok(amount > 0);
  return { ...s, payment: "succeeded", capturedMinor: amount, ledger: { ...s.ledger, capture: true } };
}

function fulfill(s) {
  assert.equal(s.payment, "succeeded");
  assert.equal(s.ledger.capture, true);
  return { ...s, purchase: "succeeded", entitlement: "active" };
}

function refund(s, amount) {
  assert.ok(["succeeded", "partially_refunded"].includes(s.payment));
  assert.ok(amount > 0);
  const nextRefunded = s.refundedMinor + amount;
  assert.ok(nextRefunded <= s.capturedMinor);
  return {
    ...s,
    refundedMinor: nextRefunded,
    payment: nextRefunded === s.capturedMinor ? "refunded" : "partially_refunded",
    ledger: { ...s.ledger, refundMinor: nextRefunded },
  };
}

function reverseFullRefundProduct(s) {
  assert.equal(s.payment, "refunded");
  assert.equal(s.refundedMinor, s.capturedMinor);
  assert.equal(s.ledger.refundMinor, s.capturedMinor);
  assert.equal(s.purchase, "succeeded");
  return { ...s, purchase: "refunded", entitlement: "revoked" };
}

function openDispute(s) {
  assert.equal(s.payment, "succeeded");
  return { ...s, dispute: "open" };
}

function loseFullChargeback(s) {
  assert.equal(s.payment, "succeeded");
  assert.equal(s.refundedMinor, 0);
  assert.equal(s.ledger.capture, true);
  return {
    ...s,
    payment: "chargeback",
    chargebackCase: "lost_materialized",
    ledger: { ...s.ledger, chargeback: true },
  };
}

function reverseChargebackProduct(s) {
  assert.equal(s.payment, "chargeback");
  assert.equal(s.chargebackCase, "lost_materialized");
  assert.equal(s.ledger.chargeback, true);
  assert.equal(s.purchase, "succeeded");
  return { ...s, purchase: "chargeback", entitlement: "revoked" };
}

function reconcileProvider(s, result = "clean") {
  assert.notEqual(s.payment, "none");
  return { ...s, providerReport: result };
}

// Scenario 1: successful capture and fulfillment.
{
  let s = initial();
  s = capture(s, 10000);
  s = fulfill(s);
  assert.equal(s.payment, "succeeded");
  assert.equal(s.purchase, "succeeded");
  assert.equal(s.entitlement, "active");
}

// Scenario 2: partial refund never revokes product access.
{
  let s = fulfill(capture(initial(), 10000));
  s = refund(s, 2500);
  assert.equal(s.payment, "partially_refunded");
  assert.equal(s.purchase, "succeeded");
  assert.equal(s.entitlement, "active");
  assert.throws(() => reverseFullRefundProduct(s));
}

// Scenario 3: cumulative full refund may revoke only after financial truth reaches full amount.
{
  let s = fulfill(capture(initial(), 10000));
  s = refund(s, 2500);
  s = refund(s, 7500);
  assert.equal(s.payment, "refunded");
  s = reverseFullRefundProduct(s);
  assert.equal(s.purchase, "refunded");
  assert.equal(s.entitlement, "revoked");
}

// Scenario 4: an open dispute is risk state only; it cannot revoke access or mutate payment truth.
{
  let s = fulfill(capture(initial(), 10000));
  const before = structuredClone(s);
  s = openDispute(s);
  assert.equal(s.dispute, "open");
  assert.equal(s.payment, before.payment);
  assert.equal(s.purchase, before.purchase);
  assert.equal(s.entitlement, before.entitlement);
  assert.equal(s.ledger.chargeback, false);
  assert.throws(() => reverseChargebackProduct(s));
}

// Scenario 5: clean full chargeback revokes only after financial loss is materialized and balanced.
{
  let s = fulfill(capture(initial(), 10000));
  s = loseFullChargeback(s);
  assert.equal(s.purchase, "succeeded");
  assert.equal(s.entitlement, "active");
  s = reverseChargebackProduct(s);
  assert.equal(s.purchase, "chargeback");
  assert.equal(s.entitlement, "revoked");
  s = reconcileProvider(s, "clean");
  assert.equal(s.providerReport, "clean");
}

// Scenario 6: refund/chargeback overlap is deliberately unsupported in V1.
{
  let s = fulfill(capture(initial(), 10000));
  s = refund(s, 1000);
  assert.equal(s.payment, "partially_refunded");
  assert.throws(() => loseFullChargeback(s));
  assert.equal(s.entitlement, "active");
}

// Scenario 7: no product action can precede financial capture truth.
{
  const s = initial();
  assert.throws(() => fulfill(s));
  assert.throws(() => refund(s, 100));
  assert.throws(() => reverseFullRefundProduct(s));
  assert.throws(() => reverseChargebackProduct(s));
}

console.log("MARA_PAYMENT_LIFECYCLE_MODEL_CONTRACT PASS");
