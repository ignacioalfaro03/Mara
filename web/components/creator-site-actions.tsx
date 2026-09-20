"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/real-product.module.css";

function sourceToken() {
  try {
    const raw = new URLSearchParams(window.location.search).get("src")?.trim().toLowerCase();
    return raw === "ig" || raw === "tt" || raw === "x" ? raw : raw ? "other" : "direct";
  } catch {
    return "direct";
  }
}

export function CreatorSiteActions({ slug, published }: { slug: string; published: boolean }) {
  const [copied, setCopied] = useState(false);
  const path = `/${slug}`;

  async function copyLink() {
    if (!published) return;
    const url = new URL(path, window.location.origin).toString();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "creator_site_link_copied",
        timestamp: new Date().toISOString(),
        properties: { surface: "/creator", target: "creator_site", entry_source: sourceToken() },
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <div className={styles.actions}>
      <Link className={styles.secondary} href={path}>{published ? "Abrir sitio" : "Previsualizar"}</Link>
      <button className={styles.secondary} type="button" onClick={copyLink} disabled={!published}>
        {published ? (copied ? "Enlace copiado" : "Copiar mi enlace") : "Publica para compartir"}
      </button>
    </div>
  );
}
