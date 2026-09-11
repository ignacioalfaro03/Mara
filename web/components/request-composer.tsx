"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ProductTelemetry } from "@/components/product-telemetry";

type CreatedRequest = {
  id: string;
  status: string;
  category: string;
  description: string;
  budget_minor: number | null;
  currency: string;
};

export function RequestComposer({ worldSlug, creatorName }: { worldSlug: string; creatorName: string }) {
  const [category, setCategory] = useState("audio");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<CreatedRequest | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || description.trim().length < 3) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ worldSlug, category, description: description.trim(), budgetMajor: budget ? Number(budget) : null }),
      });
      if (response.status === 401) {
        window.location.assign(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      const payload = (await response.json().catch(() => ({}))) as { request?: CreatedRequest; error?: string };
      if (!response.ok || !payload.request) {
        setError(payload.error === "unsupported_or_unsafe_request" ? "Ese tipo de solicitud no está soportado en Mara." : "No pude enviar la solicitud. Revisa los datos e intenta de nuevo.");
        return;
      }
      setCreated(payload.request);
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <div className="emptyState">
        <strong>Enviada.</strong>
        <p>{creatorName} puede aceptarla, rechazarla o proponerte otro precio. No se cobrará nada hasta que exista una oferta clara y tú decidas pagar.</p>
        <div className="consumerActions" style={{ marginTop: 14 }}>
          <Link className="consumerPrimary" href="/app/me">Ver mis solicitudes</Link>
          <Link className="consumerSecondary" href={`/app/people/${worldSlug}`}>Volver al perfil</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="requestComposer" onSubmit={submit}>
      <ProductTelemetry event="request_started" surface={`/app/people/${worldSlug}/request`} target="creator_request" />
      <label>
        <span>Qué quieres</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="audio">Audio</option>
          <option value="photo">Foto</option>
          <option value="video">Video</option>
          <option value="digital_experience">Experiencia digital</option>
          <option value="message">Mensaje</option>
          <option value="bundle">Pack</option>
          <option value="other">Otra idea</option>
        </select>
      </label>
      <label>
        <span>Cuéntaselo</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} minLength={3} maxLength={4000} rows={6} placeholder={`¿Qué te gustaría pedirle a ${creatorName}?`} required />
      </label>
      <label>
        <span>Presupuesto opcional · CLP</span>
        <input value={budget} onChange={(event) => setBudget(event.target.value)} inputMode="numeric" type="number" min="1" max="10000000" step="1" placeholder="Ej. 15000" />
      </label>
      <p className="requestFinePrint">Enviar una solicitud no es una compra ni obliga a la creadora a aceptarla. El precio y lo que recibirás deben quedar claros antes del pago.</p>
      <button className="consumerPrimary" type="submit" disabled={busy || description.trim().length < 3}>{busy ? "Enviando…" : "Enviar solicitud"}</button>
      {error ? <p className="requestError" role="status">{error}</p> : null}
    </form>
  );
}
