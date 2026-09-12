import { getServerBackendConfig } from "@/lib/backend-config";
import type {
  MercadoPagoSandboxTransport,
  SandboxHttpRequest,
  SandboxHttpResponse,
} from "@/lib/commerce/mercado-pago-sandbox-client";
import { SupabaseMercadoPagoSandboxCredentialVault } from "@/lib/commerce/supabase-mercado-pago-sandbox-vault";

// SERVER ONLY / SANDBOX ONLY.
// Production is hard-disabled regardless of credentials. Preview/local execution
// additionally requires an explicit feature flag and complete server-side config.

const MERCADO_PAGO_API_ORIGIN = "https://api.mercadopago.com";

export class MercadoPagoSandboxHttpTransport implements MercadoPagoSandboxTransport {
  async request<T>(input: SandboxHttpRequest): Promise<SandboxHttpResponse<T>> {
    const url = new URL(input.url);
    if (url.origin !== MERCADO_PAGO_API_ORIGIN) {
      throw new Error("mara_mp_sandbox_transport_origin_blocked");
    }
    if (url.username || url.password) {
      throw new Error("mara_mp_sandbox_transport_url_credentials_blocked");
    }

    const response = await fetch(url, {
      method: input.method,
      headers: input.headers,
      body: input.body,
      cache: "no-store",
      redirect: "error",
    });

    const contentType = response.headers.get("content-type") ?? "";
    let data: unknown = null;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { provider_response_non_json: true } : null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: data as T,
    };
  }
}

export type MercadoPagoSandboxExecutionRuntime =
  | {
      configured: false;
      reason:
        | "sandbox_not_enabled"
        | "sandbox_blocked_in_production"
        | "supabase_server_not_configured"
        | "mercado_pago_sandbox_credentials_missing"
        | "mercado_pago_sandbox_urls_invalid";
    }
  | {
      configured: true;
      clientId: string;
      clientSecret: string;
      webhookSecret: string;
      oauthRedirectUri: string;
      webhookBaseUrl: string;
      transport: MercadoPagoSandboxHttpTransport;
      vault: SupabaseMercadoPagoSandboxCredentialVault;
    };

function readHttpsUrl(value: string | undefined) {
  const raw = value?.trim() ?? "";
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getMercadoPagoSandboxExecutionRuntime(): MercadoPagoSandboxExecutionRuntime {
  if (process.env.VERCEL_ENV === "production") {
    return { configured: false, reason: "sandbox_blocked_in_production" };
  }
  if (process.env.MARA_MP_SANDBOX_ENABLED !== "true") {
    return { configured: false, reason: "sandbox_not_enabled" };
  }

  const backend = getServerBackendConfig();
  if (!backend) {
    return { configured: false, reason: "supabase_server_not_configured" };
  }

  const clientId = process.env.MARA_MP_SANDBOX_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.MARA_MP_SANDBOX_CLIENT_SECRET?.trim() ?? "";
  const webhookSecret = process.env.MARA_MP_SANDBOX_WEBHOOK_SECRET?.trim() ?? "";
  if (clientId.length < 3 || clientSecret.length < 12 || webhookSecret.length < 16) {
    return { configured: false, reason: "mercado_pago_sandbox_credentials_missing" };
  }

  const oauthRedirectUri = readHttpsUrl(process.env.MARA_MP_SANDBOX_OAUTH_REDIRECT_URI);
  const webhookBaseUrl = readHttpsUrl(process.env.MARA_MP_SANDBOX_WEBHOOK_BASE_URL);
  if (!oauthRedirectUri || !webhookBaseUrl) {
    return { configured: false, reason: "mercado_pago_sandbox_urls_invalid" };
  }

  return {
    configured: true,
    clientId,
    clientSecret,
    webhookSecret,
    oauthRedirectUri,
    webhookBaseUrl,
    transport: new MercadoPagoSandboxHttpTransport(),
    vault: new SupabaseMercadoPagoSandboxCredentialVault(backend),
  };
}
