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
          setError("No pude cargar tu archivo privado ahora.");
          return;
        }
        setPayload((await response.json()) as CommerceMePayload);
      })
      .catch(() => {
        if (active) setError("No pude conectar con tu archivo privado.");
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

  if (loading) return <p className={styles.muted}>Abriendo tu archivo…</p>;

  if (needsAccount) {
    return (
      <div className={styles.libraryCard}>
        <p className={styles.eyebrow}>PRIVATE ARCHIVE</p>
        <h3>Lo tuyo vive con tu cuenta.</h3>
        <p className={styles.muted}>Entra para recuperar accesos y entregas sin depender de este navegador.</p>
        <div className={styles.buttonStack}>
          <Link className={styles.primaryButton} href="/auth">Entrar o crear cuenta</Link>
          <Link className={styles.secondaryButton} href="/activity">Volver a actividad</Link>
        </div>
      </div>
    );
  }

  if (error) return <p className={styles.notice}>{error}</p>;

  if (!payload || owned.length === 0) {
    return (
      <div className={styles.libraryCard}>
        <p className={styles.eyebrow}>NOTHING HERE YET</p>
        <h3>Tu archivo todavía está vacío.</h3>
        <p className={styles.muted}>No vamos a mostrarte contenido ficticio. Cuando un acceso quede realmente asociado a tu cuenta, aparece aquí.</p>
        <div className={styles.buttonStack}>
          <Link className={styles.primaryButton} href="/experience">Entrar a Creator Zero</Link>
          <Link className={styles.secondaryButton} href="/make-it-happen">Haz que pase</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.libraryList}>
      {owned.map(({ entitlement, product }) => (
        <article className={styles.libraryCard} key={entitlement.key}>
          <div className={styles.cardSequence}>YOURS</div>
          <p className={styles.eyebrow}>UNLOCKED</p>
          <h3>{product?.title ?? entitlement.key}</h3>
          <p className={styles.libraryMeta}>Tuyo desde {new Date(entitlement.grantedAt).toLocaleDateString("es-CL")}</p>
          {product ? <Link className={styles.secondaryButton} href={`/shop/${product.slug}`}>Abrir</Link> : null}
        </article>
      ))}

      {payload.purchases.filter((purchase) => purchase.status === "succeeded").length > 0 ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>TRANSACTIONS</p>
              <h2>Lo que compraste.</h2>
            </div>
            <p>Esta parte es deliberadamente clara: monto, fecha y compra confirmada.</p>
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