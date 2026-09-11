"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestStatusActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function acceptCounter() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept_counter", requestId }),
      });
      if (!response.ok) {
        setError(response.status === 409 ? "Esta contraoferta ya no está disponible." : "No pudimos aceptar la contraoferta.");
        return;
      }
      router.refresh();
    } catch {
      setError("No pudimos conectar. Intenta otra vez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button className="consumerPrimary" type="button" disabled={busy} onClick={acceptCounter}>
        {busy ? "Aceptando…" : "Aceptar precio"}
      </button>
      {error ? <p role="alert" style={{ marginTop: 8, fontSize: 12 }}>{error}</p> : null}
    </div>
  );
}
