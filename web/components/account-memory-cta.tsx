"use client";

import { useEffect, useState } from "react";

export function AccountMemoryCta() {
  const [state, setState] = useState<"loading" | "signed_out" | "signed_in" | "disabled">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 503) {
          setState("disabled");
          return;
        }
        const payload = (await response.json().catch(() => ({}))) as { authenticated?: boolean };
        setState(payload.authenticated ? "signed_in" : "signed_out");
      })
      .catch(() => {
        if (active) setState("disabled");
      });

    return () => { active = false; };
  }, []);

  if (state === "loading" || state === "disabled") return null;

  if (state === "signed_in") {
    return <p className="livingDisclosure">Tu cuenta está activa. Esta historia ya puede seguir contigo.</p>;
  }

  return (
    <div style={{ marginTop: 14 }}>
      <a className="primaryCta" href="/auth">Haz que me acuerde</a>
      <p className="livingDisclosure" style={{ marginTop: 10 }}>
        Opcional. Puedes seguir sin cuenta; la cuenta sirve para conservar tus elecciones entre dispositivos.
      </p>
    </div>
  );
}
