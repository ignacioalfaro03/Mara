"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { amountBucket, formatMinorAmount, type CommerceGoal, type CommerceOffer } from "@/lib/commerce/catalog";
import { track } from "@/lib/analytics";

type LaunchCommercePayload = {
  source: "static" | "supabase" | "supabase_fallback";
  backendConfigured: boolean;
  payment:
    | { status: "configured"; provider: string }
    | { status: "not_configured"; provider: "disabled"; reason: string };
  offers: {
    fixed: CommerceOffer;
    capricho: CommerceOffer;
  };
  goals: {
    capricho: CommerceGoal;
  };
};

type CommerceMePayload = {
  entitlements?: Array<{ key: string; status: "active" | "revoked"; grantedAt: string }>;
  purchases?: Array<{
    id: string;
    offerSlug: string | null;
    offerTitle: string | null;
    amountMinor: number;
    currency: string;
    status: "succeeded" | "failed" | "refunded";
  }>;
  contributions?: Array<{
    offerSlug: string | null;
    goalSlug: string | null;
    amountMinor: number;
    currency: string;
    status: "succeeded" | "refunded";
  }>;
};

const PRIVATE_NOTE_ENTITLEMENT = "private_after_scene_note_v1";
const REQUEST_ID_KEY = "mara_checkout_request_ids_v1";

function readRequestMap(): Record<string, string> {
  try {
    const raw = window.sessionStorage.getItem(REQUEST_ID_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function clientRequestIdFor(key: string) {
  const existing = readRequestMap();
  if (existing[key]) return existing[key];

  const next = { ...existing, [key]: crypto.randomUUID() };
  try {
    window.sessionStorage.setItem(REQUEST_ID_KEY, JSON.stringify(next));
  } catch {
    return next[key];
  }
  return next[key];
}

function parseDollarAmount(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,6}(\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0").slice(0, 2));
}

function progressFor(goal: CommerceGoal) {
  const funded = Math.max(0, goal.fundedAmountMinor ?? 0);
  const target = Math.max(1, goal.targetAmountMinor);
  return {
    funded,
    target,
    percent: Math.min(100, Math.round((funded / target) * 100)),
    remaining: Math.max(0, target - funded),
  };
}

function canCheckout(payload: LaunchCommercePayload | null) {
  return payload?.payment.status === "configured";
}

function amountAllowed(offer: CommerceOffer, amountMinor: number | null, remainingMinor: number) {
  if (amountMinor === null) return false;
  if (offer.minAmountMinor !== null && amountMinor < offer.minAmountMinor) return false;
  if (offer.maxAmountMinor !== null && amountMinor > offer.maxAmountMinor) return false;
  return amountMinor <= remainingMinor;
}

export function LaunchCommerceSpine() {
  const [payload, setPayload] = useState<LaunchCommercePayload | null>(null);
  const [viewer, setViewer] = useState<CommerceMePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [needsAccount, setNeedsAccount] = useState(false);
  const [customAmount, setCustomAmount] = useState("10");
  const viewed = useRef(false);

  const hasPrivateNote = useMemo(
    () => viewer?.entitlements?.some((entitlement) => entitlement.key === PRIVATE_NOTE_ENTITLEMENT && entitlement.status === "active") ?? false,
    [viewer],
  );
  const ownContributionTotal = useMemo(
    () => viewer?.contributions
      ?.filter((contribution) => contribution.goalSlug === "black_bag_01" && contribution.status === "succeeded")
      .reduce((total, contribution) => total + contribution.amountMinor, 0) ?? 0,
    [viewer],
  );

  async function refreshViewer() {
    try {
      const response = await fetch("/api/commerce/me", { cache: "no-store", credentials: "same-origin" });
      if (response.status === 401) {
        setNeedsAccount(true);
        return;
      }
      if (!response.ok) return;
      setNeedsAccount(false);
      setViewer((await response.json()) as CommerceMePayload);
    } catch {
      // Commerce state is additive; the launch scene must still work without it.
    }
  }

  useEffect(() => {
    let active = true;
    let returnedFromCheckout = false;
    try {
      returnedFromCheckout = new URLSearchParams(window.location.search).get("commerce") === "return";
    } catch {
      returnedFromCheckout = false;
    }
    if (returnedFromCheckout) {
      track("commerce_checkout_returned", { surface: "launch_open_loop" });
    }

    void Promise.all([
      fetch("/api/commerce/launch", { cache: "no-store" })
        .then(async (response) => {
          if (!active || !response.ok) return;
          const nextPayload = (await response.json()) as LaunchCommercePayload;
          setPayload(nextPayload);
        })
        .catch(() => undefined),
      refreshViewer(),
    ]).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!payload || viewed.current) return;
    viewed.current = true;
    const providerStatus = payload.payment.status;
    track("commerce_offer_viewed", {
      surface: "launch_open_loop",
      offer_slug: payload.offers.fixed.slug,
      offer_type: payload.offers.fixed.type,
      provider_status: providerStatus,
    });
    track("capricho_viewed", {
      surface: "launch_open_loop",
      capricho_slug: payload.goals.capricho.slug,
      provider_status: providerStatus,
    });
    track("commerce_contribution_progress_viewed", {
      surface: "launch_open_loop",
      capricho_slug: payload.goals.capricho.slug,
      provider_status: providerStatus,
    });
  }, [payload]);

  useEffect(() => {
    if (hasPrivateNote) {
      track("commerce_entitlement_unlocked", {
        surface: "launch_open_loop",
        offer_slug: PRIVATE_NOTE_ENTITLEMENT,
      });
    }
  }, [hasPrivateNote]);

  async function startCheckout(offer: CommerceOffer, amountMinor: number | null) {
    setNotice("");
    setNeedsAccount(false);

    if (!payload || !canCheckout(payload)) {
      setNotice("Checkout no activo en este Preview. Mara puede mostrar el producto, pero no puede cobrar sin un procesador aprobado.");
      track("commerce_checkout_blocked", {
        surface: "launch_open_loop",
        offer_slug: offer.slug,
        offer_type: offer.type,
        provider_status: payload?.payment.status ?? "not_configured",
      });
      return;
    }

    const requestKey = `${offer.slug}:${amountMinor ?? offer.amountMinor ?? 0}`;
    const clientRequestId = clientRequestIdFor(requestKey);
    const amountForTelemetry = amountMinor ?? offer.amountMinor ?? 0;
    setBusyKey(requestKey);
    track("commerce_checkout_started", {
      surface: "launch_open_loop",
      offer_slug: offer.slug,
      offer_type: offer.type,
      amount_bucket: amountBucket(amountForTelemetry),
      currency: offer.currency,
      provider_status: payload.payment.status,
    });

    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          offerSlug: offer.slug,
          amountMinor,
          clientRequestId,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        checkoutUrl?: string;
        error?: string;
        reason?: string;
      };

      if (response.status === 401) {
        setNeedsAccount(true);
        setNotice("Primero crea o entra a tu cuenta. Las compras se amarran a memoria persistente, no a este navegador.");
        return;
      }

      if (!response.ok || !result.checkoutUrl) {
        setNotice(result.error === "payment_provider_not_configured"
          ? "Checkout no activo en este Preview. Falta procesador aprobado y configurado."
          : "No pude iniciar checkout ahora. El producto no se marca como comprado.");
        track("commerce_checkout_blocked", {
          surface: "launch_open_loop",
          offer_slug: offer.slug,
          offer_type: offer.type,
          provider_status: payload.payment.status,
        });
        return;
      }

      window.location.assign(result.checkoutUrl);
    } catch {
      setNotice("No pude conectar con checkout. Nada se marco como comprado.");
    } finally {
      setBusyKey(null);
    }
  }

  if (loading && !payload) return null;
  if (!payload) return null;

  const fixedOffer = payload.offers.fixed;
  const caprichoOffer = payload.offers.capricho;
  const caprichoGoal = payload.goals.capricho;
  const progress = progressFor(caprichoGoal);
  const paymentConfigured = canCheckout(payload);
  const selectedAmountMinor = parseDollarAmount(customAmount);
  const selectedContributionAllowed = amountAllowed(caprichoOffer, selectedAmountMinor, progress.remaining);
  const fixedBusyKey = `${fixedOffer.slug}:${fixedOffer.amountMinor ?? 0}`;
  const contributionBusyKey = `${caprichoOffer.slug}:${selectedAmountMinor ?? 0}`;

  return (
    <section className="launchCommerce" aria-label="Mara Vera commerce">
      <div className="commerceStatusLine">
        <span>Launch loop</span>
        <span>{paymentConfigured ? "Checkout activo en test" : "Checkout pendiente de procesador"}</span>
      </div>

      <div className="commerceGrid">
        <article className="commercePanel commercePanelPrimary">
          <p className="eyebrow">DESBLOQUEO</p>
          <h2>{fixedOffer.title}</h2>
          <p>{fixedOffer.description}</p>
          <p className="commercePrice">{fixedOffer.amountMinor ? formatMinorAmount(fixedOffer.amountMinor, fixedOffer.currency) : "Precio pendiente"}</p>

          {hasPrivateNote ? (
            <div className="commerceUnlocked">
              <strong>Desbloqueado.</strong>
              <span>La nota queda unida a tu cuenta y a esta historia, no al navegador.</span>
            </div>
          ) : (
            <button
              type="button"
              className="primaryCta buttonReset"
              disabled={!paymentConfigured || busyKey !== null}
              onClick={() => startCheckout(fixedOffer, null)}
            >
              {busyKey === fixedBusyKey ? "Abriendo..." : paymentConfigured ? "Desbloquear nota" : "Checkout no activo"}
            </button>
          )}
        </article>

        <article className="commercePanel">
          <div className="caprichoHeader">
            <div>
              <p className="eyebrow">CAPRICHO</p>
              <h2>{caprichoOffer.title}</h2>
            </div>
            <img src={caprichoGoal.visualPath} alt="Mara Vera" width={96} height={128} />
          </div>
          <p>{caprichoGoal.description}</p>
          <div className="goalMeter" aria-label={`Progreso ${progress.percent}%`}>
            <span style={{ width: `${progress.percent}%` }} />
          </div>
          <div className="goalNumbers">
            <span>{formatMinorAmount(progress.funded, caprichoGoal.currency)} reunidos</span>
            <span>{formatMinorAmount(progress.target, caprichoGoal.currency)} meta</span>
          </div>

          <div className="amountControls">
            {[5, 10, 25].map((amount) => (
              <button key={amount} type="button" onClick={() => setCustomAmount(String(amount))}>
                {formatMinorAmount(amount * 100, caprichoOffer.currency)}
              </button>
            ))}
            <label>
              Otro
              <input
                inputMode="decimal"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                aria-label="Monto de aporte en dolares"
              />
            </label>
          </div>

          <button
            type="button"
            className="primaryCta buttonReset"
            disabled={!paymentConfigured || busyKey !== null || !selectedContributionAllowed}
            onClick={() => startCheckout(caprichoOffer, selectedAmountMinor)}
          >
            {busyKey === contributionBusyKey ? "Abriendo..." : paymentConfigured ? "Aportar al Capricho" : "Checkout no activo"}
          </button>
          {ownContributionTotal > 0 ? (
            <p className="commerceFineprint">Tus aportes confirmados: {formatMinorAmount(ownContributionTotal, caprichoGoal.currency)}.</p>
          ) : null}
        </article>
      </div>

      {notice ? <p className="commerceNotice" role="status">{notice}</p> : null}
      {needsAccount ? <a className="textCta commerceAccountLink" href="/auth">Crear cuenta o entrar</a> : null}
      <p className="commerceFineprint">
        Pagas por objetos concretos de experiencia. No compras afecto, prioridad emocional ni cambios de personalidad.
        La participacion comercial es privada por defecto.
      </p>
    </section>
  );
}
