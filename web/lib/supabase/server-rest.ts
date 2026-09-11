import { getBackendConfig, getServerBackendConfig } from "@/lib/backend-config";

export type RestResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number };

type RestInit = Omit<RequestInit, "headers"> & { headers?: Record<string, string> };

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

function serverCredentialHeaders(config: NonNullable<ReturnType<typeof getServerBackendConfig>>) {
  // Modern sb_secret_* keys authenticate through apikey. Legacy service_role
  // values are JWTs and also carry the Bearer authorization header.
  if (config.serviceRoleKey.startsWith("sb_secret_")) {
    return { apikey: config.serviceRoleKey };
  }
  return {
    apikey: config.publishableKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
  };
}

export async function userRest<T>(accessToken: string, path: string, init: RestInit = {}): Promise<RestResult<T>> {
  const config = getBackendConfig();
  if (!config) return { ok: false, error: "backend_not_configured", status: 503 };

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("mara_user_rest_failed", { path: path.split("?")[0], status: response.status, body: body.slice(0, 300) });
    return { ok: false, error: "supabase_request_failed", status: response.status };
  }

  return { ok: true, data: await parseBody<T>(response), status: response.status };
}

export async function publicRest<T>(path: string): Promise<RestResult<T>> {
  const config = getBackendConfig();
  if (!config) return { ok: false, error: "backend_not_configured", status: 503 };

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    headers: { apikey: config.publishableKey },
    cache: "no-store",
  });

  if (!response.ok) return { ok: false, error: "supabase_request_failed", status: response.status };
  return { ok: true, data: await parseBody<T>(response), status: response.status };
}

export async function serviceRest<T>(path: string, init: RestInit = {}): Promise<RestResult<T>> {
  const config = getServerBackendConfig();
  if (!config) return { ok: false, error: "server_backend_not_configured", status: 503 };

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...serverCredentialHeaders(config),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("mara_service_rest_failed", { path: path.split("?")[0], status: response.status, body: body.slice(0, 300) });
    return { ok: false, error: "supabase_service_request_failed", status: response.status };
  }

  return { ok: true, data: await parseBody<T>(response), status: response.status };
}

export function first<T>(result: RestResult<T[]>): T | null {
  return result.ok ? result.data[0] ?? null : null;
}

export function safeLocalReturn(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function slugify(value: string, max = 64) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "");
}
