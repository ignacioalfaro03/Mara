"use client";

import { useEffect, useState } from "react";

type FollowState = "not_following" | "following" | "muted" | "blocked";

export function FollowButton({ creatorId, enabled }: { creatorId: string; enabled: boolean }) {
  const [state, setState] = useState<FollowState>("not_following");
  const [busy, setBusy] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    void fetch(`/api/follow?creatorId=${encodeURIComponent(creatorId)}`, { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!active || !response.ok) return;
        const payload = (await response.json()) as { authenticated?: boolean; status?: FollowState };
        setAuthenticated(payload.authenticated ?? true);
        setState(payload.status ?? "not_following");
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [creatorId, enabled]);

  if (!enabled || state === "blocked") return null;

  async function toggle() {
    if (busy) return;
    if (authenticated === false) {
      window.location.assign(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setBusy(true);
    try {
      const response = state === "following" || state === "muted"
        ? await fetch(`/api/follow?creatorId=${encodeURIComponent(creatorId)}`, { method: "DELETE", credentials: "same-origin" })
        : await fetch("/api/follow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ creatorId, status: "following" }),
          });
      if (response.status === 401) {
        window.location.assign(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok) return;
      const payload = (await response.json()) as { status?: FollowState };
      setState(payload.status ?? (state === "not_following" ? "following" : "not_following"));
    } finally {
      setBusy(false);
    }
  }

  const following = state === "following" || state === "muted";
  return (
    <button className={following ? "consumerSecondary" : "followButton"} type="button" onClick={toggle} disabled={busy}>
      {busy ? "…" : following ? "Siguiendo" : "Seguir"}
    </button>
  );
}
