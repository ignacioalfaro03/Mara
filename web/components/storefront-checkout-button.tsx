"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type CheckoutPayload = {
  checkoutUrl?: string;
  error?: string;
  paymentConfigured?: boolean;
};

type Props = {
  offerSlug: string;
  offerType: string;
  currency: string;
  returnTo: string;
};

function requestIdFor(offerSlug: string) {
  const key = `mara_storefront_checkout_${offerSlug}`;
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.sessionStorage.setItem(key, next);
  return next;
}

export function StorefrontCheckoutButton({ offerSlug, offerType, currency, returnTo }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  async function beginCheckout() {
    setBusy(true);
    setMessage("");
    setAuthRequired(false);
    track("offer_clicked", { surface: "fan_web_offer", offer_slug: offerSlug, offer_type: offerType });
    track("commerce_checkout_started", { surface: "fan_web_offer", offer_slug: offerSlug, offer_type: offerType, currency });

    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          offerSlug,
          amountMinor: null,
          clientRequestId: requestIdFor(offerSlug),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as CheckoutPayload;

      if (response.status === 401) {
        setAuthRequired(true);
        setMessage("Entra o crea una cuenta para continuar con esta compra.");
        return;
      }
      if (!response.ok) {
        if (payload.error === "payment_provider_not_configured" || payload.error === "creator_offer_live_payment_not_authorized") {
          setMessage("Esta oferta todavía no puede cobrar dinero real. Mara mantiene el checkout cerrado hasta que el proveedor de pagos esté autorizado.");
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

  return (
    <div>
      <button type="button" className="storefrontPrimaryButton" onClick={() => void beginCheckout()} disabled={busy}>
        {busy ? "Preparando checkout…" : "Comprar"}
      </button>
      {authRequired ? (
        <p className="storefrontInlineAction">
          <a href={`/auth?returnTo=${encodeURIComponent(returnTo)}`}>Entrar o crear cuenta</a>
        </p>
      ) : null}
      {message ? <p className="storefrontStatus" role="status">{message}</p> : null}
    </div>
  );
}
