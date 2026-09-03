"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { loadRelationshipState, syncRelationshipState } from "@/lib/relationship-client";
import { MaraPortrait } from "@/components/mara-presence";
import { VisualPreferenceChoice, type PoseChoice } from "@/components/visual-preference-choice";
import { AccountMemoryCta } from "@/components/account-memory-cta";
import { LaunchCommerceSpine } from "@/components/launch-commerce-spine";

const STORAGE_KEY = "mara_launch_state_v1";
const DAY_MS = 24 * 60 * 60 * 1000;

type Step =
  | "intro"
  | "outfit"
  | "outfit_result"
  | "pose"
  | "pose_result"
  | "bar"
  | "bar_result"
  | "message"
  | "message_result"
  | "twist"
  | "return"
  | "return_scene"
  | "return_result"
  | "open_loop";

type Signals = {
  approaches: number;
  waits: number;
  follows: number;
  challenges: number;
  novelty: number;
  familiarity: number;
};

type LaunchState = {
  signals?: Signals;
  outfitChoice?: "black" | "cream";
  poseChoice?: PoseChoice;
  barChoice?: "approach" | "wait";
  messageChoice?: "follow" | "challenge";
  returnScene?: "gym" | "story" | "late_plan";
  completed?: boolean;
  returnCount?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
};

const EMPTY_SIGNALS: Signals = {
  approaches: 0,
  waits: 0,
  follows: 0,
  challenges: 0,
  novelty: 0,
  familiarity: 0,
};

function readState(): LaunchState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LaunchState) : null;
  } catch {
    return null;
  }
}

function saveState(state: LaunchState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function timestamp(value?: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function earliestIso(a?: string | null, b?: string | null) {
  const aTime = timestamp(a);
  const bTime = timestamp(b);
  if (aTime === null) return b ?? undefined;
  if (bTime === null) return a ?? undefined;
  return aTime <= bTime ? a ?? undefined : b ?? undefined;
}

function latestIso(a?: string | null, b?: string | null) {
  const aTime = timestamp(a);
  const bTime = timestamp(b);
  if (aTime === null) return b ?? undefined;
  if (bTime === null) return a ?? undefined;
  return aTime >= bTime ? a ?? undefined : b ?? undefined;
}

function persistRelationship(state: LaunchState) {
  if (!state.firstSeenAt || !state.lastSeenAt) return;
  void syncRelationshipState({
    returnCount: state.returnCount ?? 0,
    firstSeenAt: state.firstSeenAt,
    lastSeenAt: state.lastSeenAt,
    lastVisualChoice: state.poseChoice ?? null,
    launchCompleted: Boolean(state.completed),
  });
}

function returnCountBucket(count: number): "1" | "2" | "3-4" | "5+" {
  if (count <= 1) return "1";
  if (count === 2) return "2";
  if (count <= 4) return "3-4";
  return "5+";
}

function daysSinceFirstBucket(firstSeenAt?: string): "same_day" | "1-2d" | "3-7d" | "8+d" | "unknown" {
  if (!firstSeenAt) return "unknown";
  const firstSeen = Date.parse(firstSeenAt);
  if (!Number.isFinite(firstSeen)) return "unknown";

  const elapsedDays = Math.max(0, (Date.now() - firstSeen) / DAY_MS);
  if (elapsedDays < 1) return "same_day";
  if (elapsedDays < 3) return "1-2d";
  if (elapsedDays < 8) return "3-7d";
  return "8+d";
}

function returnTelemetry(state: LaunchState, count: number) {
  return {
    surface: "launch_experience",
    return_count_bucket: returnCountBucket(count),
    days_since_first_bucket: daysSinceFirstBucket(state.firstSeenAt),
  };
}

function withSignal(state: LaunchState, key: keyof Signals): LaunchState {
  const signals = { ...(state.signals ?? EMPTY_SIGNALS) };
  signals[key] += 1;
  return { ...state, signals };
}

function callbackLine(state: LaunchState) {
  if (state.messageChoice === "challenge") {
    return "La última vez me hiciste esperar después de que te dije que vinieras.";
  }
  if (state.messageChoice === "follow") {
    return "La última vez te dije “ven” y viniste sin pedirme otra explicación.";
  }
  if (state.barChoice === "wait") {
    return "La primera vez te quedaste donde estabas y me obligaste a moverme a mí.";
  }
  if (state.barChoice === "approach") {
    return "La primera vez viniste apenas te hice un gesto.";
  }
  if (state.poseChoice === "pose_a") {
    return "La última vez te quedaste con la primera. Sí, me fijé.";
  }
  if (state.poseChoice === "pose_b") {
    return "La última vez te quedaste con la segunda. Sí, me fijé.";
  }
  return "La última vez dejaste una escena a medias conmigo.";
}

function returnSceneFor(count: number): NonNullable<LaunchState["returnScene"]> {
  const scenes: NonNullable<LaunchState["returnScene"]>[] = ["gym", "story", "late_plan"];
  return scenes[Math.max(0, count - 1) % scenes.length];
}

function Choice({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="livingChoice" onClick={onClick}>
      <strong>{children}</strong>
    </button>
  );
}

export function LaunchExperience() {
  const [step, setStep] = useState<Step>("intro");
  const [state, setState] = useState<LaunchState>({ signals: EMPTY_SIGNALS });
  const [predictionHit, setPredictionHit] = useState<boolean | null>(null);
  const [returnReaction, setReturnReaction] = useState<string>("");
  const interactionStarted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const saved = readState();
    let localCompleted = false;

    if (saved?.completed) {
      const hydrated: LaunchState = {
        ...saved,
        signals: saved.signals ?? EMPTY_SIGNALS,
        firstSeenAt: saved.firstSeenAt ?? saved.lastSeenAt,
      };
      localCompleted = true;
      setState(hydrated);
      if (!saved.firstSeenAt && hydrated.firstSeenAt) saveState(hydrated);
      setStep("return");
      persistRelationship(hydrated);
      track("returning_user", returnTelemetry(hydrated, (hydrated.returnCount ?? 0) + 1));
    }

    void loadRelationshipState().then((remote) => {
      if (cancelled || interactionStarted.current || !remote?.launchCompleted) return;

      const local = readState();
      const hydrated: LaunchState = {
        ...(local ?? {}),
        signals: local?.signals ?? EMPTY_SIGNALS,
        poseChoice: local?.poseChoice ?? remote.lastVisualChoice ?? undefined,
        completed: true,
        returnCount: Math.max(local?.returnCount ?? 0, remote.returnCount),
        firstSeenAt: earliestIso(local?.firstSeenAt ?? local?.lastSeenAt, remote.firstSeenAt ?? remote.lastSeenAt),
        lastSeenAt: latestIso(local?.lastSeenAt, remote.lastSeenAt),
      };

      setState(hydrated);
      saveState(hydrated);
      setStep("return");
      if (!localCompleted) {
        track("returning_user", returnTelemetry(hydrated, (hydrated.returnCount ?? 0) + 1));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    interactionStarted.current = false;
    setState({ signals: EMPTY_SIGNALS });
    setPredictionHit(null);
    setReturnReaction("");
    setStep("intro");
    track("launch_state_reset", { surface: "launch_experience" });
  }

  function finishSession() {
    const now = new Date().toISOString();
    const next: LaunchState = {
      ...state,
      completed: true,
      returnCount: state.returnCount ?? 0,
      firstSeenAt: state.firstSeenAt ?? now,
      lastSeenAt: now,
    };
    setState(next);
    saveState(next);
    persistRelationship(next);
    setStep("open_loop");
    track("launch_session_completed", { surface: "launch_experience" });
    track("experience_completed", { surface: "launch_experience" });
  }

  function continueReturn() {
    const nextCount = (state.returnCount ?? 0) + 1;
    const next: LaunchState = {
      ...state,
      completed: true,
      returnCount: nextCount,
      returnScene: returnSceneFor(nextCount),
      firstSeenAt: state.firstSeenAt ?? state.lastSeenAt ?? new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };
    setState(next);
    saveState(next);
    persistRelationship(next);
    setStep("return_scene");
    track("launch_return_continued", returnTelemetry(next, nextCount));
  }

  if (step === "return") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>Volviste.</h1>
          <p className="livingLead">{callbackLine(state)}</p>
          <p className="livingLead">No te voy a sacar una conclusión por eso. Solo me acuerdo.</p>
          <button type="button" className="primaryCta buttonReset" onClick={continueReturn}>Métete.</button>
          <button type="button" className="livingReset" onClick={reset}>Empezar de cero aquí</button>
        </div>
      </section>
    );
  }

  if (step === "return_scene") {
    if (state.returnScene === "story") {
      return (
        <section className="livingStage livingQuestion">
          <div className="livingCopy">
            <p className="eyebrow">HOY · 18:37</p>
            <h1>Estoy por subir una foto.</h1>
            <div className="lifeMoment"><span>MARA</span><p>Ya la miré demasiado. Eso nunca termina bien.</p></div>
            <div className="livingChoices">
              <Choice onClick={() => { setReturnReaction("Muy tarde. La subí antes de que terminaras de decidir."); setStep("return_result"); }}>Súbela.</Choice>
              <Choice onClick={() => { setReturnReaction("Mmm. Por una vez te hice caso. Se queda conmigo."); setStep("return_result"); }}>No la subas.</Choice>
            </div>
          </div>
        </section>
      );
    }

    if (state.returnScene === "late_plan") {
      return (
        <section className="livingStage livingQuestion">
          <div className="livingCopy">
            <p className="eyebrow">HOY · 22:06</p>
            <h1>Tengo dos planes.</h1>
            <div className="lifeMoment"><span>UNO</span><p>Casa, comida y una hora decente.</p><span>DOS</span><p>“Solo un rato.” Ya sabemos cómo termina eso.</p></div>
            <div className="livingChoices">
              <Choice onClick={() => { setReturnReaction("Qué responsable. Igual ya me estaba poniendo los zapatos."); setStep("return_result"); }}>El sensato.</Choice>
              <Choice onClick={() => { setReturnReaction("Sabía que no eras buena influencia. Dame cinco minutos."); setStep("return_result"); }}>El que termina tarde.</Choice>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">HOY · GYM</p>
          <h1>Estoy por saltarme el último ejercicio.</h1>
          <div className="lifeMoment"><span>MARA</span><p>No me mires así. Ya hice suficiente.</p></div>
          <div className="livingChoices">
            <Choice onClick={() => { setReturnReaction("Pesado. Ya. Lo termino."); setStep("return_result"); }}>Termínalo.</Choice>
            <Choice onClick={() => { setReturnReaction("Eso quería escuchar. Nos vamos."); setStep("return_result"); }}>Anda a casa.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "return_result") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{returnReaction}</h1>
          <p className="livingLead">Después te cuento si me arrepentí.</p>
          <button type="button" className="primaryCta buttonReset" onClick={finishSession}>Déjalo ahí.</button>
        </div>
      </section>
    );
  }

  if (step === "intro") {
    return (
      <section className="livingStage livingIntro">
        <MaraPortrait />
        <div className="livingCopy">
          <p className="eyebrow">LA PRIMERA VEZ</p>
          <h1>Llegaste justo.</h1>
          <p className="livingLead">Estoy a punto de salir y ya cambié de idea dos veces. Entra.</p>
          <button
            type="button"
            className="primaryCta buttonReset"
            onClick={() => {
              interactionStarted.current = true;
              setStep("outfit");
              track("launch_experience_started", { surface: "launch_experience" });
              track("experience_started", { surface: "launch_experience" });
            }}
          >
            Métete.
          </button>
          <p className="livingDisclosure">Personaje virtual generado con IA · 18+ · Empiezo con memoria local; una cuenta opcional permite conservar elecciones entre dispositivos.</p>
        </div>
      </section>
    );
  }

  if (step === "outfit") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">19:26 · SIETE MINUTOS TARDE</p>
          <h1>Negro o crema.</h1>
          <div className="lifeMoment"><span>MARA</span><p>No me preguntes adónde voy. Primero elige.</p></div>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...withSignal(s, "familiarity"), outfitChoice: "black" })); setStep("outfit_result"); }}>Negro.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...withSignal(s, "novelty"), outfitChoice: "cream" })); setStep("outfit_result"); }}>Crema.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "outfit_result") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{state.outfitChoice === "black" ? "Obvio." : "¿Crema? Mmm."}</h1>
          <p className="livingLead">
            {state.outfitChoice === "black"
              ? "Ya lo tenía puesto. Solo quería saber si coincidíamos."
              : "Iba a decirte que no. Ahora me hiciste cambiar. Qué molesto."}
          </p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("pose")}>Espera.</button>
        </div>
      </section>
    );
  }

  if (step === "pose") {
    return (
      <VisualPreferenceChoice
        onChoose={(choice) => {
          setState((current) => ({ ...current, poseChoice: choice }));
          setStep("pose_result");
          track("visual_choice_completed", { surface: "launch_experience" });
          track("preference_selected", { surface: "launch_experience", preference_group: "pose_pair_launch_v1" });
        }}
      />
    );
  }

  if (step === "pose_result") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{state.poseChoice === "pose_a" ? "La primera. Ya." : "La segunda. Mmm."}</h1>
          <p className="livingLead">No voy a inventarme una teoría sobre ti por una foto. Pero sí me acuerdo de cuál elegiste.</p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("bar")}>Ahora sí.</button>
        </div>
      </section>
    );
  }

  if (step === "bar") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">23:14 · BAR</p>
          <h1>Te pillé mirando.</h1>
          <div className="lifeMoment"><span>MARA</span><p>Estamos lejos. No sonrío. Solo sostengo la mirada y hago un gesto mínimo con la cabeza: ven.</p></div>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...withSignal(s, "approaches"), barChoice: "approach" })); setStep("bar_result"); }}>Voy hacia ti.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...withSignal(s, "waits"), barChoice: "wait" })); setStep("bar_result"); }}>Me quedo donde estoy.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "bar_result") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{state.barChoice === "approach" ? "Eso fue rápido." : "Ah. Encima cómodo."}</h1>
          <p className="livingLead">
            {state.barChoice === "approach"
              ? "Cuando llegas, te miro un segundo: “Pensé que ibas a hacerte el difícil”."
              : "Te miro otra vez. Esta vez sí sonrío un poco. “Puede ser”."}
          </p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("message")}>Ajá.</button>
        </div>
      </section>
    );
  }

  if (step === "message") {
    const expectsFollow = state.barChoice === "approach";
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MÁS TARDE</p>
          <h1>Tu teléfono vibra dos veces.</h1>
          <div className="lifeMoment">
            <span>22:48</span><p>“No vengas todavía.”</p>
            <span>22:49</span><p>“Ya. Ven.”</p>
          </div>
          <p className="livingLead">Yo ya aposté qué vas a hacer.</p>
          <div className="livingChoices">
            <Choice onClick={() => { const hit = expectsFollow; setPredictionHit(hit); setState((s) => ({ ...withSignal(s, "follows"), messageChoice: "follow" })); setStep("message_result"); track(hit ? "prediction_hit" : "prediction_miss", { surface: "launch_experience" }); }}>Voy.</Choice>
            <Choice onClick={() => { const hit = !expectsFollow; setPredictionHit(hit); setState((s) => ({ ...withSignal(s, "challenges"), messageChoice: "challenge" })); setStep("message_result"); track(hit ? "prediction_hit" : "prediction_miss", { surface: "launch_experience" }); }}>Ahora espera tú.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "message_result") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{predictionHit ? "Sabía." : "Ah. Bien. Me cambiaste el libreto."}</h1>
          <p className="livingLead">
            {state.messageChoice === "follow"
              ? "No te digo qué significa. Solo registro que viniste."
              : "No te digo qué significa. Solo registro que me hiciste esperar."}
          </p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("twist")}>Ya.</button>
        </div>
      </section>
    );
  }

  if (step === "twist") {
    const followsMore = (state.signals?.follows ?? 0) >= (state.signals?.challenges ?? 0);
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy experienceBody">
          <p className="eyebrow">MARA</p>
          <h1>{followsMore ? "No. Ahora espera tú." : "Ya. Esta vez sí: ven."}</h1>
          <p className="livingLead">
            {followsMore
              ? "Iba a seguir la escena. Cambié de opinión. Me gusta más dejarla acá."
              : "Te salió bien una vez hacerme esperar. No abuses."}
          </p>
          <div className="lifeMoment"><span>MIENTRAS TANTO</span><p>Y sí: el café que dejé en la casa probablemente sigue frío.</p></div>
          <button type="button" className="primaryCta buttonReset" onClick={finishSession}>Déjalo ahí.</button>
        </div>
      </section>
    );
  }

  return (
    <section className="livingStage">
      <MaraPortrait compact />
      <div className="livingCopy">
        <p className="eyebrow">MARA</p>
        <h1>Después te cuento qué pasó.</h1>
        <p className="livingLead">O no. Depende de cómo vuelva la noche.</p>
        <AccountMemoryCta />
        <LaunchCommerceSpine />
        <a className="primaryCta" href="/">Salir por ahora</a>
        <button type="button" className="livingReset" onClick={reset}>Borrar mi estado local</button>
      </div>
    </section>
  );
}
