const LOCAL_STORAGE_KEYS = [
  "mara_dm_state_v1",
  "mara_launch_state_v1",
  "mara_pending_preference_events_v1",
  "mara_world_knowledge_v1",
  "mara_sofi_callback_seen_v1",
  "mara_device_account_v1",
] as const;

export const DEVICE_RESET_KEY = "mara_device_reset_v1";

export function deviceVersion() {
  try { return window.localStorage.getItem(DEVICE_RESET_KEY); } catch { return null; }
}

export function bindMaraDeviceToAccount(userId: string | null, explicitTransfer = false) {
  try {
    const previous = window.localStorage.getItem("mara_device_account_v1");
    if ((previous && previous !== userId) || (!previous && userId && !explicitTransfer)) clearMaraLocalDeviceState();
    if (userId) window.localStorage.setItem("mara_device_account_v1", userId);
  } catch {
    // Account ownership comes from the server; this is only a local cache boundary.
  }
}

export async function checkMaraDeviceAccount(explicitTransfer = false) {
  try {
    const response = await fetch("/api/auth/me", {
      cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(5000),
    });
    const payload = await response.json();
    if (response.ok && payload.authenticated && typeof payload.user?.id === "string") {
      bindMaraDeviceToAccount(payload.user.id, explicitTransfer);
      return "authenticated" as const;
    }
    if (response.status === 401 || payload.backendConfigured === false) {
      bindMaraDeviceToAccount(null);
      return "anonymous" as const;
    }
  } catch { /* A transient failure must not display another account's cache. */ }
  try {
    if (!window.localStorage.getItem("mara_device_account_v1")) return "anonymous" as const;
  } catch { return "anonymous" as const; }
  return "unavailable" as const;
}

const SESSION_STORAGE_KEYS = [
  "mara_dm_checkout_request_v1",
] as const;

export function clearMaraLocalDeviceState() {
  if (typeof window === "undefined") return;

  for (const key of LOCAL_STORAGE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Best effort: one unavailable storage surface must not block the rest.
    }
  }

  for (const key of SESSION_STORAGE_KEYS) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Best effort.
    }
  }
  try { window.localStorage.setItem(DEVICE_RESET_KEY, crypto.randomUUID()); } catch { /* Best effort. */ }
  window.dispatchEvent(new Event("mara:device-reset"));
}
