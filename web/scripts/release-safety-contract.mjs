import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const paymentConfig = read("lib/commerce/config.ts");
const testCheckout = read("app/api/commerce/test-checkout/route.ts");
const qaUser = read("app/api/internal/qa-user/route.ts");
const backendConfig = read("lib/backend-config.ts");
const envExample = read(".env.example");

// Signed-test commerce must never be generally available in a production deployment.
assert.match(paymentConfig, /VERCEL_ENV === "production"/);
assert.match(paymentConfig, /MARA_SIGNED_TEST_PROOF === "true"/);
assert.match(paymentConfig, /VERCEL_PROJECT_ID === ISOLATED_PROOF_PROJECT_ID/);
assert.match(paymentConfig, /VERCEL_URL\?\.startsWith\(ISOLATED_PROOF_HOST_PREFIX\)/);
assert.match(paymentConfig, /payment_provider_blocked_in_production/);
assert.match(testCheckout, /payment\.provider !== "signed_test"/);
assert.match(testCheckout, /verifyTestCheckoutSignature/);

// QA user administration must be inert without the proof token and explicitly blocked
// on the canonical production Vercel project.
assert.match(qaUser, /MARA_QA_PROOF_TOKEN/);
assert.match(qaUser, /VERCEL_PROJECT_ID === "prj_47YN2RH1i1NvaRTuEVqqbA8cdxUK"/);
assert.match(qaUser, /timingSafeEqual/);
assert.match(qaUser, /mara\\\.qa/);

// Service-role credentials are server-only. Never create a NEXT_PUBLIC service key.
assert.doesNotMatch(backendConfig, /NEXT_PUBLIC_[A-Z0-9_]*SERVICE/i);
assert.doesNotMatch(envExample, /NEXT_PUBLIC_[A-Z0-9_]*SERVICE/i);

// Alpha payment boundary: repository runtime supports only disabled or signed_test.
assert.doesNotMatch(paymentConfig, /provider:\s*["'](?:stripe|mercadopago|flow|transbank|paypal)["']/i);

console.log("MARA_RELEASE_SAFETY_CONTRACT PASS");
