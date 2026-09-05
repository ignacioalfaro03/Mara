import crypto from "node:crypto";

export type PaymentRuntime =
  | {
      configured: false;
      provider: "disabled";
      reason: "payment_provider_not_configured" | "payment_provider_blocked_in_production";
    }
  | {
      configured: true;
      provider: "signed_test";
      webhookSecret: string;
    };

export function getPaymentRuntime(): PaymentRuntime {
  const provider = process.env.MARA_PAYMENT_PROVIDER?.trim();
  const webhookSecret = process.env.MARA_PAYMENT_WEBHOOK_SECRET?.trim() ?? "";
  const isProductionDeployment = process.env.VERCEL_ENV === "production";

  if (provider === "signed_test" && webhookSecret.length >= 24 && !isProductionDeployment) {
    return { configured: true, provider, webhookSecret };
  }

  if (provider === "signed_test" && isProductionDeployment) {
    return { configured: false, provider: "disabled", reason: "payment_provider_blocked_in_production" };
  }

  return { configured: false, provider: "disabled", reason: "payment_provider_not_configured" };
}

export function getAppBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://127.0.0.1:3000";
}

export function signTestCheckout(intentId: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(`checkout:${intentId}`).digest("hex");
}

export function verifyTestCheckoutSignature(intentId: string, signature: string, secret: string) {
  const expected = signTestCheckout(intentId, secret);
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function signWebhookPayload(rawBody: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = signWebhookPayload(rawBody, secret);
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
