"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { loadSofiWorldKnowledge } from "@/lib/world-client";
import { SOFI_FOUND_FOOTAGE } from "@/lib/world-canon";
import styles from "./world-bridge.module.css";

const CALLBACK_SEEN_KEY = "mara_sofi_callback_seen_v1";

export function WorldBridge({ eligible, onContinue }: { eligible: boolean; onContinue: () => void }) {
  const [discovered, setDiscovered] = useState(false);
  const [callbackVisible, setCallbackVisible] = useState(false);
  const [reply, setReply] = useState(false);
  useEffect(() => {
    let active = true;
    void loadSofiWorldKnowledge().then((knowledge) => {
      if (!active) return;
      setDiscovered(knowledge.discovered);
      if (!knowledge.discovered) return;
      let seen = false;
      try { seen = window.localStorage.getItem(CALLBACK_SEEN_KEY) === "true"; } catch { /* Best effort. */ }
      if (!seen) {
        setCallbackVisible(true);
        track("memory_recall_rendered", {
          surface: "world_sofi_callback", target: SOFI_FOUND_FOOTAGE.factKey,
          memory_source: knowledge.source === "server" ? "server" : "local",
        });
      }
    });
    return () => { active = false; };
  }, []);

  function dismiss() {
    setCallbackVisible(false);
    try { window.localStorage.setItem(CALLBACK_SEEN_KEY, "true"); } catch { /* Best effort. */ }
    // Closing a notice is not engagement with the remembered story.
  }

  function discuss() {
    if (reply) return;
    setReply(true);
    onContinue();
    track("memory_recall_engaged", { surface: "world_sofi_callback", target: SOFI_FOUND_FOOTAGE.factKey });
    track("experience_completed", { surface: "world_sofi_return", target: SOFI_FOUND_FOOTAGE.factKey });
  }

  if (discovered && callbackVisible) return (
    <aside className={styles.bridge} data-testid="sofi-mara-callback">
      <div className={styles.callback}>
        <div>
          <strong>Mara</strong>
          <span>{reply ? SOFI_FOUND_FOOTAGE.maraReply : "Ya viste lo que te mandó Sofi, ¿cierto? Obvio te iba a mostrar su versión primero 🙄"}</span>
          {!reply ? <button className={styles.discuss} type="button" onClick={discuss}>Cuéntame tu versión</button> : null}
        </div>
        <button className={styles.close} type="button" onClick={dismiss} aria-label="Cerrar callback">×</button>
      </div>
    </aside>
  );
  if (!eligible && !discovered) return null;
  return (
    <aside className={styles.bridge} data-testid={discovered ? "sofi-world-history" : "sofi-world-door"}>
      <a className={styles.link} href="/world/sofi" onClick={() => {
        onContinue();
        track("experience_started", { surface: "world_sofi_entry", target: SOFI_FOUND_FOOTAGE.eventKey });
      }}>
        <strong>{discovered ? "Volver a la historia de Sofi" : "Sofi te mandó algo"}</strong>
        <span>amiga de Mara · la noche del chocolate</span>
      </a>
    </aside>
  );
}
