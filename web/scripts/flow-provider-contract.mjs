import assert from "node:assert/strict";
import { FLOW_API_BASE, flowGetStatusParams, flowPaymentCreateParams, normalizeFlowPaymentStatus, signFlowParams } from "../lib/commerce/providers/flow.ts";

const secretKey="my secret";
assert.equal(signFlowParams({apiKey:"1F90971E-8276-4715-97FF-2BLG5030EE3B",token:"AJ089FF5467367"},secretKey),"191947b8253f1b615adeda260fab7d8c8cc0507b22e19d4742baa00b0e464d44");
assert.equal(FLOW_API_BASE.sandbox,"https://sandbox.flow.cl/api");
const config={apiKey:"sandbox-key",secretKey:"sandbox-secret",environment:"sandbox"};
const p=flowPaymentCreateParams({commerceOrder:"mara-123",subject:"Mara creator purchase",currency:"CLP",amountMinor:4990,payerEmail:"buyer@example.com",confirmationUrl:"https://example.com/api/flow",returnUrl:"https://example.com/return"},config);
assert.equal(p.amount,4990); assert.equal(p.paymentMethod,9); assert.match(p.s,/^[a-f0-9]{64}$/);
assert.match(flowGetStatusParams("TOKEN",config).s,/^[a-f0-9]{64}$/);
assert.throws(()=>flowPaymentCreateParams({commerceOrder:"x",subject:"x",currency:"USD",amountMinor:1,payerEmail:"a@b.cl",confirmationUrl:"https://x",returnUrl:"https://x"},config),/flow_currency_not_supported/);
const n=normalizeFlowPaymentStatus({flowOrder:123,commerceOrder:"mara-123",status:2,currency:"CLP",amount:4990});
assert.deepEqual({provider:n.provider,succeeded:n.succeeded,amountMinor:n.amountMinor,currency:n.currency},{provider:"flow",succeeded:true,amountMinor:4990,currency:"CLP"});
console.log("flow-provider-contract: PASS");

