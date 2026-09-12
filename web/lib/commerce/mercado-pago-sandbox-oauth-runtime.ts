import crypto from "node:crypto";
import type { MaraServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders } from "@/lib/commerce/backend";
import {
  exchangeMercadoPagoSandboxAuthorization,
} from "@/lib/commerce/mercado-pago-sandbox-client";
import { buildMercadoPagoTestAuthorizationUrl } from "@/lib/commerce/mercado-pago-test";
import type { MercadoPagoSandboxExecutionRuntime } from "@/lib/commerce/mercado-pago-sandbox-runtime";

const PKCE_VERIFIER_BYTES = 48;
const STATE_BYTES = 32;
const OAUTH_TTL_MS = 10 * 60 * 1000;

function base64url(buffer: Buffer) {
  return buffer.toString("base64url");
}

function sha256Hex(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function pkceChallenge(verifier: string) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

async function rpc<T>(
  backend: MaraServerBackendConfig,
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${backend.url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: serviceHeaders(backend),
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "error",
  });

  if (!response.ok) {
    throw new Error(`mara_mp_sandbox_oauth_rpc_failed:${functionName}:${response.status}`);
  }

  return await response.json() as T;
}

export async function beginMercadoPagoSandboxOAuth(input: {
  creatorId: string;
  backend: MaraServerBackendConfig;
  runtime: Extract<MercadoPagoSandboxExecutionRuntime, { configured: true }>;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const state = base64url(crypto.randomBytes(STATE_BYTES));
  const verifier = base64url(crypto.randomBytes(PKCE_VERIFIER_BYTES));
  const challenge = pkceChallenge(verifier);
  const stateHash = sha256Hex(state);
  const expiresAt = new Date(now.getTime() + OAUTH_TTL_MS).toISOString();

  const sessionId = await rpc<unknown>(input.backend, "mara_mp_sandbox_oauth_begin", {
    p_creator_id: input.creatorId,
    p_state_hash: stateHash,
    p_pkce_verifier: verifier,
    p_callback_url: input.runtime.oauthRedirectUri,
    p_expires_at: expiresAt,
  });

  if (typeof sessionId !== "string" || sessionId.length < 32) {
    throw new Error("mara_mp_sandbox_oauth_session_invalid");
  }

  const authorizationUrl = buildMercadoPagoTestAuthorizationUrl({
    clientId: input.runtime.clientId,
    redirectUri: input.runtime.oauthRedirectUri,
    state,
    pkceChallenge: challenge,
  });

  return { authorizationUrl, sessionId, expiresAt };
}

type OAuthConsumeRow = {
  session_id: string;
  creator_id: string;
  pkce_verifier: string;
  callback_url: string;
};

export async function completeMercadoPagoSandboxOAuth(input: {
  authorizationCode: string;
  state: string;
  backend: MaraServerBackendConfig;
  runtime: Extract<MercadoPagoSandboxExecutionRuntime, { configured: true }>;
  now?: Date;
}) {
  const authorizationCode = input.authorizationCode.trim();
  const state = input.state.trim();
  if (!authorizationCode || !state) throw new Error("mara_mp_sandbox_oauth_callback_invalid");

  const consumed = await rpc<OAuthConsumeRow[]>(input.backend, "mara_mp_sandbox_oauth_consume", {
    p_state_hash: sha256Hex(state),
  });
  const session = consumed[0];
  if (!session?.creator_id || !session.pkce_verifier || !session.callback_url) {
    throw new Error("mara_mp_sandbox_oauth_session_consume_invalid");
  }
  if (session.callback_url !== input.runtime.oauthRedirectUri) {
    throw new Error("mara_mp_sandbox_oauth_callback_mismatch");
  }

  const exchanged = await exchangeMercadoPagoSandboxAuthorization({
    creatorId: session.creator_id,
    clientId: input.runtime.clientId,
    clientSecret: input.runtime.clientSecret,
    authorizationCode,
    redirectUri: input.runtime.oauthRedirectUri,
    state,
    pkceVerifier: session.pkce_verifier,
    now: input.now,
  }, input.runtime.transport, input.runtime.vault);

  await rpc<unknown>(input.backend, "mara_mp_sandbox_bind_account", {
    p_creator_id: session.creator_id,
    p_provider_account_id: exchanged.providerAccountId,
    p_credential_reference: exchanged.credentialReference,
    p_credential_expires_at: exchanged.expiresAt,
  });

  return {
    creatorId: session.creator_id,
    providerAccountId: exchanged.providerAccountId,
    credentialExpiresAt: exchanged.expiresAt,
  };
}
