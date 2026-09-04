"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { loadSofiWorldKnowledge } from "@/lib/world-client";
import { SOFI_FOUND_FOOTAGE } from "@/lib/world-canon";
import styles from "./world-bridge.module.css";

const DM_STORAGE_KEY = "mara_dm_state_v1";
const CALLBACK_SEEN_KEY = "mara_sofi_callback_seen_v1";

type DmState = {
  ritualCompletedAt?: string;
  ritualSkipped?: boolean;
};

function isEligibleForWorldDoor() {
  try {
    const raw = window.localStorage.getItem(DM_STORAGE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw) as DmState;
    return Boolean(state.ritualCompletedAt || state.ritualSkipped);
  } catch {
    return false;
  }
}

export function WorldBridge() {
  const [eligible, setEligible] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const [callbackVisible, setCallbackVisible] = useState(false);

  useEffect(() => {
    let eligibilityPoll: number | null = null;

    function refreshEligibility() {
      const next = isEligibleForWorldDoor();
      setEligible(next);
      if (next && eligibilityPoll !== null) {
        window.clearInterval(eligibilityPoll);
        eligibilityPoll = null;
      }
    }

    refreshEligibility();
    window.addEventListener("mara:analytics", refreshEligibility);
    if (!isEligibleForWorldDoor()) {
      eligibilityPoll = window.setInterval(refreshEligibility, 250);
    }

    void loadSofiWorldKnowledge().then((knowledge) => {
      setDiscovered(knowledge.discovered);
      if (!knowledge.discovered) return;

      let alreadySeen = false;
      try {
        alreadySeen = window.localStorage.getItem(CALLBACK_SEEN_KEY) === "true";
      } catch {
        alreadySeen = false;
      }
      if (!alreadySeen) {
        setCallbackVisible(true);
        track("memory_recall_rendered", {
          surface: "world_sofi_callback",
          target: SOFI_FOUND_FOOTAGE.factKey,
          memory_source: knowledge.source === "server" ? "server" : "local",
        });
      }
    });

    return () => {
      window.removeEventListener("mara:analytics", refreshEligibility);
      if (eligibilityPoll !== null) window.clearInterval(eligibilityPoll);
    };
  }, []);

  function dismissCallback() {
    setCallbackVisible(false);
    try {
      window.localStorage.setItem(CALLBACK_SEEN_KEY, "true");
    } catch {
      // Callback de-duplication is best-effort and never blocks the DM.
    }
    track("memory_recall_engaged", {
      surface: "world_sofi_callback",
      target: SOFI_FOUND_FOOTAGE.factKey,
    });
  }

  if (discovered && callbackVisible) {
    return (
      <aside className={styles.bridge} data-testid="sofi-mara-callback">
        <div className={styles.callback}>
          <img className={styles.avatar} src="/mara/mara-v1-reference.jpg" alt="Mara Vera" />
          <div>
            <strong>Mara</strong>
            <span>Ya viste lo que te mandó Sofi, ¿cierto? Obvio te iba a mostrar su versión primero 🙄 Después hablamos de eso.</span>
          </div>
          <button className={styles.close} type="button" onClick={dismissCallback} aria-label="Cerrar callback">×</button>
        </div>
      </aside>
    );
  }

  if (!eligible || discovered) return null;

  return (
    <aside className={styles.bridge} data-testid="sofi-world-door">
      <a className={styles.link} href="/world/sofi" onClick={() => track("experience_started", { surface: "world_sofi_entry", target: SOFI_FOUND_FOOTAGE.eventKey })}>
        <strong>Sofi te mandó algo</strong>
        <span>amiga de Mara · grabado desde su celu · ver qué pasó</span>
      </a>
    </aside>
  );
}
