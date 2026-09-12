"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";

type CheckoutPayload = {
  checkoutUrl?: string;
  error?: string;
  paymentConfigured?: boolean;
};

type Props = {
  offerSlug: string;
  offerType?: string;
  currency?: string;
  returnTo?: string;
  label?: string;
  priceMode?: "fixed" | "custom_amount" | string;
  minAmountMinor?: number | null;
  maxAmountMinor?: number | null;
};

function requestIdFor(keyValue: string) {
  const key = `mara_storefront_checkout_${keyValue}`;
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.sessionStorage.setItem(key, next);
  return next;
}

function majorFromMinor(value: number | null | undefined) {
  return value && value > 0 ? value / 100 : 0;
}

export function StorefrontCheckoutButton({
  offerSlug,
  offerType = "legacy_offer",
  currency = "CLP",
  returnTo,
  label = "Comprar",
  priceMode = "fixed",
  minAmountMinor = null,
  maxAmountMinor = null,
}: Props) {
  const customAmount = priceMode === "custom_amount";
  const minimumMajor = majorFromMinor(minAmountMinor);
  const maximumMajor = majorFromMinor(maxAmountMinor);
  const [amountMajor, setAmountMajor] = useState(customAmount && minimumMajor > 0 ? String(minimumMajor) : "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const selectedAmountMinor = useMemo(() => {
    if (!customAmount) return null;
    const value = Number(amountMajor);
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.round(value * 100);
  }, [amountMajor, customAmount]);

  const customAmountValid = !customAmount || Boolean(
    selectedAmountMinor &&
    (!minAmountMinor || selectedAmountMinor >= minAmountMinor) &&
    (!maxAmountMinor || selectedAmountMinor <= maxAmountMinor)
  );

  async function beginCheckout() {
    if (!customAmountValid) {
      setMessage("Elige un monto dentro del rango permitido.");
      return;
    }

    setBusy(true);
    setMessage("");
    setAuthRequired(false);
    track("offer_clicked", { surface: "fan_web_offer", offer_slug: offerSlug, offer_type: offerType });
    track("commerce_checkout_started", { surface: "fan_web_offer", offer_slug: offerSlug, offer_type: offerType, currency });

    try {
      const idempotencyKey = `${offerSlug}:${selectedAmountMinor ?? "fixed"}`;
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          offerSlug,
          amountMinor: selectedAmountMinor,
          clientRequestId: requestIdFor(idempotencyKey),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as CheckoutPayload;

      if (response.status === 401) {
        setAuthRequired(true);
        setMessage(customAmount ? "Entra o crea una cuenta para continuar con este aporte." : "Entra o crea una cuenta para continuar con esta compra.");
        return;
      }
      if (!response.ok) {
        if (payload.error === "payment_provider_not_configured" || payload.error === "creator_offer_live_payment_not_authorized") {
          setMessage("Esta oferta todavía no puede cobrar dinero real. Mara mantiene el checkout cerrado hasta que el proveedor de pagos esté autorizado.");
          return;
        }
        if (payload.error === "invalid_checkout_amount" || payload.error === "capricho_goal_no_longer_accepting") {
          setMessage("Ese monto ya no está disponible para esta meta. Actualiza el monto e inténtalo nuevamente.");
          return;
        }
        setMessage("No pudimos iniciar el checkout. Inténtalo nuevamente.");
        return;
      }
      if (!payload.checkoutUrl) {
        setMessage("El checkout no devolvió una URL segura de pago.");
        return;
      }
      window.location.assign(payload.checkoutUrl);
    } catch {
      setMessage("No pudimos conectar con el checkout. Inténtalo nuevamente.");
    } finally {
      setBusy(false);
    }
  }

  const authReturnTo = returnTo ?? "/";

  return (
    <div>
      {customAmount ? (
        <label className="storefrontInlineAction">
          Tu aporte ({currency})
          <input
            type="number"
            value={amountMajor}
            min={minimumMajor || undefined}
            max={maximumMajor || undefined}
            step={currency === "CLP" ? 1 : 0.01}
            onChange={(event) => setAmountMajor(event.target.value)}
            aria-label={`Monto del aporte en ${currency}`}
          />
        </label>
      ) : null}
      <button type="button" className="storefrontPrimaryButton" onClick={() => void beginCheckout()} disabled={busy || !customAmountValid}>
        {busy ? "Preparando checkout…" : customAmount ? "Aportar" : label}
      </button>
      {customAmount && minimumMajor > 0 && maximumMajor > 0 ? (
        <p className="storefrontStatus">Rango: {minimumMajor.toLocaleString("es-CL")}–{maximumMajor.toLocaleString("es-CL")} {currency}.</p>
      ) : null}
      {authRequired ? (
        <p className="storefrontInlineAction">
          <a href={`/auth?returnTo=${encodeURIComponent(authReturnTo)}`}>Entrar o crear cuenta</a>
        </p>
      ) : null}
      {message ? <p className="storefrontStatus" role="status">{message}</p> : null}
    </div>
  );
}
