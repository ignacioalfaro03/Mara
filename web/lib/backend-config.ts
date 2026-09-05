export type MaraBackendConfig = {
  url: string;
  publishableKey: string;
};

export type MaraServerBackendConfig = MaraBackendConfig & {
  serviceRoleKey: string;
};

export function getBackendConfig(): MaraBackendConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

export function isBackendConfigured() {
  return getBackendConfig() !== null;
}

export function getServerBackendConfig(): MaraServerBackendConfig | null {
  const config = getBackendConfig();
  const serviceRoleKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    ""
  ).trim();

  if (!config || !serviceRoleKey) return null;

  return { ...config, serviceRoleKey };
}
