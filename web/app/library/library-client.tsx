"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/app/storefront.module.css";
import { getStoreProductByEntitlement, getStoreProductByOfferSlug } from "@/lib/commerce/storefront";

type CommerceMePayload = {
  entitlements: Array<{ key: string; status: "active" | "revoked"; grantedAt: string; revokedAt?: string | null }>;
  purchases: Array<{
    id: string;
    offerSlug: string | null;
    offerTitle: string | null;
    amountMinor: number;
    currency: string;
    status: "succeeded" | "failed" | "refunded";
    createdAt: string;
  }>;
};

function money(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(amountMinor / 100);
}

export function LibraryClient() {
  const [payload, setPayload] = useState<CommerceMePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsAccount, setNeedsAccount] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void fetch("/api/commerce/me", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) {
          setNeedsAccount(true);
          return;
        }
        if (!response.ok) {
          setError("No pude cargar tu biblioteca ahora.");
          return;
        }
        setPayload((await response.json()) as CommerceMePayload);
      })
      .catch(() => {
        if (active) setError("No pude conectar con tu biblioteca.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const owned = useMemo(
    () => payload?.entitlements
      .filter((entitlement) => entitlement.status === "active")
      .map((entitlement) => ({ entitlement, product: getStoreProductByEntitlement(entitlement.key) })) ?? [],
    [payload],
  );

  if (loading) return <p className={styles.muted}>Cargando tu biblioteca…</p>;

  if (needsAccount) {
    return (
      <div className={styles.libraryCard}>
        <p className={styles.eyebrow}>TU BIBLIOTECA</p>
        <h3>Tu acceso vive en tu cuenta.</h3>
        <p className={styles.muted}>Entra para recuperar compras y desbloqueos sin depender de este navegador.</p>
        <div className={styles.buttonStack}>
          <Link className={styles.primaryButton} href="/auth">Crear cuenta o entrar</Link>
          <Link className={styles.secondaryButton} href="/shop">Explorar experiencias</Link>
        </div>
      </div>
    );
  }

  if (error) return <p className={styles.notice}>{error}</p>;

  if (!payload || owned.length === 0) {
    return (
      <div className={styles.libraryCard}>
        <p className={styles.eyebrow}>VACÍA POR AHORA</p>
        <h3>Tu primera experiencia puede quedar aquí.</h3>
        <p className={styles.muted}>La biblioteca solo muestra acceso confirmado por el backend; no inventa compras ni desbloqueos locales.</p>
        <Link className={styles.primaryButton} href="/shop">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className={styles.libraryList}>
      {owned.map(({ entitlement, product }) => (
        <article className={styles.libraryCard} key={entitlement.key}>
          <p className={styles.eyebrow}>DESBLOQUEADO</p>
          <h3>{product?.title ?? entitlement.key}</h3>
          <p className={styles.libraryMeta}>Guardado desde {new Date(entitlement.grantedAt).toLocaleDateString("es-CL")}</p>
          {product ? <Link className={styles.secondaryButton} href={`/shop/${product.slug}`}>Abrir ficha</Link> : null}
        </article>
      ))}

      {payload.purchases.filter((purchase) => purchase.status === "succeeded").length > 0 ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>HISTORIAL</p>
              <h2>Compras confirmadas</h2>
            </div>
          </div>
          <div className={styles.libraryList}>
            {payload.purchases.filter((purchase) => purchase.status === "succeeded").map((purchase) => {
              const product = purchase.offerSlug ? getStoreProductByOfferSlug(purchase.offerSlug) : null;
              return (
                <div className={styles.libraryCard} key={purchase.id}>
                  <strong>{product?.title ?? purchase.offerTitle ?? "Compra Mara"}</strong>
                  <p className={styles.libraryMeta}>{money(purchase.amountMinor, purchase.currency)} · {new Date(purchase.createdAt).toLocaleDateString("es-CL")}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
