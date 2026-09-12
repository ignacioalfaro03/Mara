"use client";

import { useState } from "react";

function major(minor: number) {
  return minor / 100;
}

function idempotencyKey(auctionId: string, amountMinor: number) {
  const storageKey = `mara_auction_bid_${auctionId}_${amountMinor}`;
  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const next = `bid:${crypto.randomUUID()}`;
  window.sessionStorage.setItem(storageKey, next);
  return next;
}

export function AuctionBidForm({
  auctionId,
  currency,
  minimumNextBidMinor,
  minimumIncrementMinor,
  returnTo,
}: {
  auctionId: string;
  currency: string;
  minimumNextBidMinor: number;
  minimumIncrementMinor: number;
  returnTo: string;
}) {
  const [minimumMinor, setMinimumMinor] = useState(minimumNextBidMinor);
  const [amountMajor, setAmountMajor] = useState(String(major(minimumNextBidMinor)));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  async function bid() {
    const value = Number(amountMajor);
    const amountMinor = Number.isFinite(value) ? Math.round(value * 100) : 0;
    if (!Number.isSafeInteger(amountMinor) || amountMinor < minimumMinor) {
      setMessage(`La próxima puja debe ser al menos ${major(minimumMinor).toLocaleString("es-CL")} ${currency}.`);
      return;
    }

    setBusy(true);
    setMessage("");
    setAuthRequired(false);
    try {
      const response = await fetch("/api/commerce/auctions/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          auctionId,
          amountMinor,
          idempotencyKey: idempotencyKey(auctionId, amountMinor),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        amountMinor?: number;
        endsAt?: string;
        extended?: boolean;
        minimumAcceptedBidMinor?: number;
      };

      if (response.status === 401) {
        setAuthRequired(true);
        setMessage("Entra para pujar. Pujar es gratis; solo el eventual ganador podrá pasar a compra.");
        return;
      }
      if (!response.ok) {
        const nextMinimum = Number(payload.minimumAcceptedBidMinor);
        if (Number.isSafeInteger(nextMinimum) && nextMinimum > 0) {
          setMinimumMinor(nextMinimum);
          setAmountMajor(String(major(nextMinimum)));
          setMessage(`La subasta cambió. La próxima puja mínima es ${major(nextMinimum).toLocaleString("es-CL")} ${currency}.`);
          return;
        }
        if (payload.error === "creator_cannot_bid_own_auction") {
          setMessage("La creadora no puede pujar en su propia subasta.");
          return;
        }
        if (payload.error === "auction_bid_rate_limited") {
          setMessage("Demasiadas pujas seguidas. Inténtalo nuevamente en un momento.");
          return;
        }
        setMessage("La puja no pudo registrarse. Actualiza la subasta e inténtalo nuevamente.");
        return;
      }

      const acceptedMinor = Number(payload.amountMinor ?? amountMinor);
      const nextMinimum = acceptedMinor + minimumIncrementMinor;
      setMinimumMinor(nextMinimum);
      setAmountMajor(String(major(nextMinimum)));
      setMessage(payload.extended
        ? "Puja registrada. Como entró al final, la subasta se extendió automáticamente."
        : "Puja registrada. Eres la oferta líder en este momento.");
    } catch {
      setMessage("No pudimos conectar con la subasta. Inténtalo nuevamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="storefrontInlineAction">
        Tu puja ({currency})
        <input
          type="number"
          min={major(minimumMinor)}
          step={currency === "CLP" ? 1 : 0.01}
          value={amountMajor}
          onChange={(event) => setAmountMajor(event.target.value)}
          aria-label={`Monto de puja en ${currency}`}
        />
      </label>
      <button type="button" className="storefrontPrimaryButton" disabled={busy} onClick={() => void bid()}>
        {busy ? "Registrando puja…" : "Pujar gratis"}
      </button>
      <p className="storefrontStatus">Pujar no cobra dinero. Una puja tampoco es una compra.</p>
      {authRequired ? <p className="storefrontInlineAction"><a href={`/auth?returnTo=${encodeURIComponent(returnTo)}`}>Entrar o crear cuenta</a></p> : null}
      {message ? <p className="storefrontStatus" role="status">{message}</p> : null}
    </div>
  );
}
