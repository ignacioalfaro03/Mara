const LOCAL_STORAGE_KEYS = [
  "mara_dm_state_v1",
  "mara_launch_state_v1",
  "mara_pending_preference_events_v1",
] as const;

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
}
