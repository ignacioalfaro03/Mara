import crypto from "node:crypto";

// Provider-neutral OAuth safety primitives.
// This module creates/verifies state + PKCE material only. It does not perform
// network calls, read environment variables, persist provider credentials or
// activate any payment runtime.

export type PaymentOAuthProof = {
  state: string;
  stateHash: string;
  pkceVerifier: string;
  pkceChallenge: string;
  expiresAt: string;
};

export type StoredPaymentOAuthSession = {
  creatorId: string;
  provider: string;
  stateHash: string;
  pkceVerifierReference: string;
  callbackUrl: string;
  expiresAt: string;
  consumedAt: string | null;
};

export interface PaymentSecretVault {
  putSecret(input: { purpose: string; secret: string; expiresAt: string }): Promise<string>;
  takeSecret(reference: string): Promise<string | null>;
  deleteSecret(reference: string): Promise<void>;
}

function sha256Hex(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256Base64Url(value: string) {
  return crypto.createHash("sha256").update(value).digest("base64url");
}

function randomUrlSafe(bytes: number) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function createPaymentOAuthProof(now = new Date(), ttlSeconds = 600): PaymentOAuthProof {
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 60 || ttlSeconds > 1800) {
    throw new Error("invalid_oauth_ttl_seconds");
  }
  const state = randomUrlSafe(32);
  const pkceVerifier = randomUrlSafe(64);
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  return {
    state,
    stateHash: sha256Hex(state),
    pkceVerifier,
    pkceChallenge: sha256Base64Url(pkceVerifier),
    expiresAt,
  };
}

export function verifyPaymentOAuthState(providedState: string, expectedStateHash: string) {
  if (!providedState || !/^[0-9a-f]{64}$/i.test(expectedStateHash)) return false;
  const actual = Buffer.from(sha256Hex(providedState), "hex");
  const expected = Buffer.from(expectedStateHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export function assertPaymentOAuthSessionUsable(
  session: Pick<StoredPaymentOAuthSession, "expiresAt" | "consumedAt">,
  now = new Date(),
) {
  if (session.consumedAt) throw new Error("oauth_session_already_consumed");
  const expiresAt = Date.parse(session.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= now.getTime()) throw new Error("oauth_session_expired");
}

export async function persistPkceVerifierReference(
  vault: PaymentSecretVault,
  creatorId: string,
  provider: string,
  proof: Pick<PaymentOAuthProof, "pkceVerifier" | "expiresAt">,
) {
  const purpose = `payment_oauth_pkce:${provider}:${creatorId}`;
  const reference = await vault.putSecret({ purpose, secret: proof.pkceVerifier, expiresAt: proof.expiresAt });
  if (!reference || reference.length < 8) throw new Error("oauth_secret_reference_invalid");
  return reference;
}