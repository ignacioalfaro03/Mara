"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { StorefrontCheckoutButton } from "./storefront-checkout-button";

type ViewerPayload = {
  entitlements?: Array<{ key: string; status: "active" | "revoked" }>;
};

export function StorefrontProductAccess({
  slug,
  offerSlug,
  entitlementKey,
  priceLabel,
  deliveryReady,
}: {
  slug: string;
  offerSlug: string;
  entitlementKey: string;
  priceLabel: string;
  deliveryReady: boolean;
}) {
  const [checking, setChecking] = useState(true);
  const [owned, setOwned] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [readFailed, setReadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    void fetch("/api/commerce/me", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) {
          setAnonymous(true);
          return;
        }
        if (!response.ok) {
          setReadFailed(true);
          return;
        }
        const viewer = (await response.json()) as ViewerPayload;
        setOwned(viewer.entitlements?.some((item) => item.key === entitlementKey && item.status === "active") ?? false);
      })
      .catch(() => {
        if (active) setReadFailed(true);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [entitlementKey]);

  if (checking) {
    return <p className={styles.muted}>Revisando tu acceso…</p>;
  }

  if (owned) {
    return (
      <div className={styles.buttonStack}>
        <p className={styles.eyebrow}>TUYO</p>
        <span className={styles.price}>Desbloqueado</span>
        {deliveryReady ? (
          <a className={styles.primaryButton} href={`/api/commerce/content/${encodeURIComponent(slug)}`} target="_blank" rel="noreferrer">
            Abrir contenido
          </a>
        ) : (
          <>
            <span className={styles.secondaryButton} aria-disabled="true">Entrega privada en preparación</span>
            <p className={styles.notice}>Tu acceso está registrado. Esta rama no habilita el activo premium hasta que el canal privado esté configurado.</p>
          </>
        )}
        <Link className={styles.secondaryButton} href="/library">Ir a mi biblioteca</Link>
      </div>
    );
  }

  if (readFailed) {
    return (
      <div>
        <p className={styles.eyebrow}>ACCESO</p>
        <p className={styles.notice}>No pude verificar ahora si ya tienes esta experiencia. Para evitar cobrarte dos veces, no abriré checkout hasta poder comprobarlo.</p>
        <Link className={styles.secondaryButton} href="/library">Revisar mi biblioteca</Link>
      </div>
    );
  }

  if (!deliveryReady) {
    return (
      <div className={styles.buttonStack}>
        <p className={styles.eyebrow}>EN PREPARACIÓN</p>
        <span className={styles.price}>{priceLabel}</span>
        <span className={styles.secondaryButton} aria-disabled="true">Aún no disponible</span>
        <p className={styles.notice}>El precio ya está definido, pero el checkout seguirá cerrado hasta que la entrega premium privada esté lista de punta a punta.</p>
      </div>
    );
  }

  return (
    <div>
      <p className={styles.eyebrow}>DISPONIBLE</p>
      <span className={styles.price}>{priceLabel}</span>
      <StorefrontCheckoutButton offerSlug={offerSlug} label="Desbloquear" />
      {anonymous ? <p className={styles.notice}>Para comprar tendrás que crear una cuenta o entrar. Así el acceso queda guardado contigo.</p> : null}
    </div>
  );
}
