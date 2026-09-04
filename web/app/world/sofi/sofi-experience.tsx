"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { discoverSofiFoundFootage, loadSofiWorldKnowledge } from "@/lib/world-client";
import { SOFI_CHARACTER, SOFI_FOUND_FOOTAGE } from "@/lib/world-canon";
import styles from "./sofi-experience.module.css";

export function SofiExperience() {
  const [discovered, setDiscovered] = useState(false);
  const [source, setSource] = useState<"local" | "server" | "none">("none");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    track("experience_started", { surface: "world_sofi", target: SOFI_FOUND_FOOTAGE.eventKey });
    void loadSofiWorldKnowledge().then((knowledge) => {
      setDiscovered(knowledge.discovered);
      setSource(knowledge.source);
      if (knowledge.discovered) {
        track("memory_recall_rendered", {
          surface: "world_sofi",
          target: SOFI_FOUND_FOOTAGE.factKey,
          memory_source: knowledge.source === "server" ? "server" : "local",
        });
      }
    });
  }, []);

  async function reveal() {
    setBusy(true);
    const knowledge = await discoverSofiFoundFootage();
    setDiscovered(true);
    setSource(knowledge.source);
    track("experience_completed", {
      surface: "world_sofi",
      target: SOFI_FOUND_FOOTAGE.factKey,
    });
    setBusy(false);
  }

  return (
    <main className={styles.shell} data-testid="sofi-world-slice">
      <header className={styles.header}>
        <a className={styles.back} href="/experience" aria-label="Volver con Mara">‹</a>
        <div className={styles.avatar} aria-hidden="true">S</div>
        <div className={styles.identity}>
          <strong>{SOFI_CHARACTER.name}</strong>
          <span>{SOFI_CHARACTER.role} · {SOFI_CHARACTER.disclosure} · 18+</span>
        </div>
      </header>

      <div className={styles.bubble}>Mara no sabe que te estoy mandando esto todavía.</div>
      <div className={styles.bubble}>{SOFI_FOUND_FOOTAGE.message}</div>

      <section className={styles.phone} data-testid="sofi-found-footage">
        <div className={styles.phoneTop}>
          <span>grabado desde el celu de Sofi</span>
          <span>vertical · casual</span>
        </div>
        <div className={styles.frame}>
          <img src="/mara/mara-v1-reference.jpg" alt="Vista previa provisional de Mara dentro del lenguaje visual de celular de Sofi" />
          <span className={styles.cameraBadge}>preview found-footage · asset final pendiente</span>
        </div>
        <div className={styles.caption}>{SOFI_FOUND_FOOTAGE.followup}</div>
      </section>

      {!discovered ? (
        <div className={styles.actions}>
          <button type="button" onClick={() => void reveal()} disabled={busy}>
            {busy ? "Guardando…" : "Ya lo vi"}
          </button>
          <a href="/experience">Volver con Mara</a>
        </div>
      ) : (
        <>
          <div className={styles.bubble}>Ya. Ahora pregúntale a ella si se atreve a contarte el resto 😌</div>
          <div className={styles.actions}>
            <a href="/experience" data-testid="return-to-mara">Volver con Mara</a>
          </div>
          <p className={styles.notice} role="status">
            Este descubrimiento queda {source === "server" ? "en tu cuenta" : "en este dispositivo"}. No se guarda el texto libre del chat.
          </p>
        </>
      )}
    </main>
  );
}
