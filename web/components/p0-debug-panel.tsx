"use client";

import { useState } from "react";
import { clearP0DevelopmentEventLog, readP0DevelopmentEventLog } from "@/lib/analytics";

export function P0DebugPanel() {
  const [status, setStatus] = useState<string>("");

  if (process.env.NODE_ENV !== "development") return null;

  async function copyLog() {
    const log = readP0DevelopmentEventLog();
    const payload = JSON.stringify(log, null, 2);

    try {
      await navigator.clipboard.writeText(payload);
      setStatus(`${log.length} eventos P0 copiados.`);
    } catch {
      console.info("[mara:p0-log]", payload);
      setStatus(`${log.length} eventos enviados a consola; clipboard no disponible.`);
    }
  }

  function clearLog() {
    clearP0DevelopmentEventLog();
    setStatus("Log P0 limpio.");
  }

  return (
    <aside className="p0DebugPanel" aria-label="Herramientas P0 solo desarrollo">
      <strong>DEV · P0 TEST LOG</strong>
      <span>Eventos seguros de interacción/comercio guardados solo en sessionStorage.</span>
      <div>
        <button type="button" onClick={copyLog}>Copiar log P0</button>
        <button type="button" onClick={clearLog}>Limpiar log</button>
      </div>
      {status ? <small aria-live="polite">{status}</small> : null}
    </aside>
  );
}
