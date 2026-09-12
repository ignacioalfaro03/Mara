import type { MaraServerBackendConfig } from "@/lib/backend-config";
import { serviceHeaders } from "@/lib/commerce/backend";
import type {
  MercadoPagoCredentialBundle,
  MercadoPagoSandboxCredentialVault,
} from "@/lib/commerce/mercado-pago-sandbox-client";

// SERVER ONLY / SANDBOX ONLY.
// This adapter deliberately stores no provider credential material in product tables.
// The backing Supabase RPCs return only an opaque Vault reference for writes and
// decrypted credentials only to a server request authenticated with the Supabase
// server secret. Never import this module into a Client Component.

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertCredentialShape(value: unknown): MercadoPagoCredentialBundle {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("mara_mp_sandbox_vault_credential_invalid");
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (keys.join(",") !== "accessToken,expiresAt,refreshToken") {
    throw new Error("mara_mp_sandbox_vault_credential_shape_invalid");
  }

  const accessToken = typeof record.accessToken === "string" ? record.accessToken.trim() : "";
  const refreshToken = typeof record.refreshToken === "string" ? record.refreshToken.trim() : "";
  const expiresAt = typeof record.expiresAt === "string" ? record.expiresAt.trim() : "";
  const expiryMs = Date.parse(expiresAt);

  if (accessToken.length < 8 || refreshToken.length < 8 || !Number.isFinite(expiryMs)) {
    throw new Error("mara_mp_sandbox_vault_credential_invalid");
  }

  return { accessToken, refreshToken, expiresAt: new Date(expiryMs).toISOString() };
}

function assertReference(value: unknown) {
  if (typeof value !== "string" || !UUID_SHAPE.test(value.trim())) {
    throw new Error("mara_mp_sandbox_vault_reference_invalid");
  }
  return value.trim();
}

async function callRpc<T>(
  config: MaraServerBackendConfig,
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${config.url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: serviceHeaders(config),
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "error",
  });

  if (!response.ok) {
    // Never include provider responses, RPC response bodies or submitted credential
    // material in the error: this boundary is intentionally non-secret-bearing.
    throw new Error(`mara_mp_sandbox_vault_rpc_failed:${functionName}:${response.status}`);
  }

  return await response.json() as T;
}

export class SupabaseMercadoPagoSandboxCredentialVault implements MercadoPagoSandboxCredentialVault {
  constructor(private readonly config: MaraServerBackendConfig) {}

  async putCredential(input: {
    creatorId: string;
    providerAccountId: string;
    credential: MercadoPagoCredentialBundle;
  }): Promise<string> {
    const credential = assertCredentialShape(input.credential);
    const reference = await callRpc<unknown>(this.config, "mara_mp_sandbox_vault_put", {
      p_creator_id: input.creatorId,
      p_provider_account_id: input.providerAccountId,
      p_credential: credential,
    });
    return assertReference(reference);
  }

  async readCredential(reference: string): Promise<MercadoPagoCredentialBundle | null> {
    const normalizedReference = assertReference(reference);
    const credential = await callRpc<unknown>(this.config, "mara_mp_sandbox_vault_read", {
      p_reference: normalizedReference,
    });
    if (credential === null) return null;
    return assertCredentialShape(credential);
  }

  async replaceCredential(reference: string, credential: MercadoPagoCredentialBundle): Promise<string> {
    const normalizedReference = assertReference(reference);
    const normalizedCredential = assertCredentialShape(credential);
    const updatedReference = await callRpc<unknown>(this.config, "mara_mp_sandbox_vault_replace", {
      p_reference: normalizedReference,
      p_credential: normalizedCredential,
    });
    return assertReference(updatedReference);
  }
}
