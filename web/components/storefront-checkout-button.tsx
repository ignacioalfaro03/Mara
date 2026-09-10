"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import styles from "@/app/storefront.module.css";

const REQUEST_PREFIX = "mara_storefront_checkout_v1:";

function requestIdFor(offerSlug: string) {
  try {
    const key = `${REQUEST_PREFIX}${offerSlug}`;
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const next = crypto.randomUUID();
    window.sessionStorage.setItem(key, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

export function StorefrontCheckoutButton({ offerSlug, label }: { offerSlug: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [needsAccount, setNeedsAccount] = useState(false);

  async function checkout() {
    setBusy(true);
    setNotice("");
    setNeedsAccount(false);

    track("offer_clicked", { surface: "storefront", offer_slug: offerSlug, offer_type: "fixed_unlock" });
    track("commerce_checkout_started", { surface: "storefront", offer_slug: offerSlug, offer_type: "fixed_unlock" });

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

      const result = (await response.json().catch(() => ({}))) as { checkoutUrl?: string; error?: string };

      if (response.status === 401) {
        setNeedsAccount(true);
        setNotice("Tu compra necesita una cuenta para que el acceso quede guardado y no dependa de este navegador.");
        return;
      }

      if (!response.ok || !result.checkoutUrl) {
        const paymentPending = result.error === "payment_provider_not_configured";
        setNotice(
          paymentPending
            ? "El producto está listo en la tienda, pero el cobro real sigue desactivado hasta aprobar el procesador."
            : "No pude iniciar el checkout. No se registró ninguna compra.",
        );
        track("commerce_checkout_blocked", {
          surface: "storefront",
          offer_slug: offerSlug,
          offer_type: "fixed_unlock",
          reason: result.error ?? "unknown",
        });
        return;
      }

      window.location.assign(result.checkoutUrl);
    } catch {
      setNotice("No pude conectar con checkout. No se registró ninguna compra.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.buttonStack}>
      <button type="button" className={styles.primaryButton} disabled={busy} onClick={checkout}>
        {busy ? "Abriendo checkout…" : label}
      </button>
      {needsAccount ? <Link className={styles.secondaryButton} href="/auth">Crear cuenta o entrar</Link> : null}
      {notice ? <p className={styles.notice} role="status">{notice}</p> : null}
    </div>
  );
}
