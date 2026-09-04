"use client";

import Image from "next/image";
import { track } from "@/lib/analytics";
import { recordVisualPreference } from "@/lib/preference-client";
import styles from "./visual-preference-choice.module.css";

const CANONICAL = "/mara/mara-v1-reference.jpg";
const POSE_A = process.env.NEXT_PUBLIC_MARA_POSE_A_IMAGE?.trim() || CANONICAL;
const POSE_B = process.env.NEXT_PUBLIC_MARA_POSE_B_IMAGE?.trim() || CANONICAL;

export type PoseChoice = "pose_a" | "pose_b";

export function VisualPreferenceChoice({ onChoose }: { onChoose: (choice: PoseChoice) => void }) {
  function choose(choice: PoseChoice) {
    void recordVisualPreference(choice);
    track("first_preference_signal", { surface: "visual_preference", target: choice, preference_group: "pose_pair_launch_v1" });
    track("preference_updated", { surface: "visual_preference", target: choice, preference_group: "pose_pair_launch_v1" });
    onChoose(choice);
  }

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">MARA · ANTES DE SALIR</p>
        <h1>¿Cuál te gusta más?</h1>
        <div className="lifeMoment">
          <span>MARA</span>
          <p>No lo pienses tanto. La primera reacción vale más.</p>
        </div>

        <div className={styles.grid}>
          <button type="button" className={styles.choice} onClick={() => choose("pose_a")} aria-label="Elegir la primera foto de Mara">
            <Image
              src={POSE_A}
              alt="Mara Vera, primera opción"
              width={1024}
              height={1536}
              sizes="(max-width: 640px) 46vw, 320px"
              className={`${styles.image} ${styles.a}`}
            />
            <span className={styles.label}>La primera</span>
          </button>
          <button type="button" className={styles.choice} onClick={() => choose("pose_b")} aria-label="Elegir la segunda foto de Mara">
            <Image
              src={POSE_B}
              alt="Mara Vera, segunda opción"
              width={1024}
              height={1536}
              sizes="(max-width: 640px) 46vw, 320px"
              className={`${styles.image} ${styles.b}`}
            />
            <span className={styles.label}>La segunda</span>
          </button>
        </div>
        <p className={styles.note}>Tu elección puede guardarse en tu memoria privada si tienes cuenta. No la convertimos en una etiqueta sobre ti.</p>
      </div>
    </section>
  );
}
