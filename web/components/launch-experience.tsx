"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { MaraPortrait } from "@/components/mara-presence";

const STORAGE_KEY = "mara_launch_state_v1";
const DAY_MS = 24 * 60 * 60 * 1000;

type Step =
  | "intro"
  | "scene_one"
  | "scene_one_result"
  | "scene_two"
  | "prediction"
  | "reveal"
  | "moment"
  | "return"
  | "return_scene"
  | "open_loop";

type LaunchState = {
  energy?: "selective" | "warm";
  pace?: "teasing" | "direct";
  completed?: boolean;
  returnCount?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
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

function Choice({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="livingChoice" onClick={onClick}>
      <strong>{children}</strong>
    </button>
  );
}

export function LaunchExperience() {
  const [step, setStep] = useState<Step>("intro");
  const [state, setState] = useState<LaunchState>({});
  const [prediction, setPrediction] = useState<"known" | "surprise">("known");
  const [predictionHit, setPredictionHit] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = readState();
    if (saved?.completed) {
      const hydrated: LaunchState = {
        ...saved,
        firstSeenAt: saved.firstSeenAt ?? saved.lastSeenAt,
      };
      setState(hydrated);
      if (!saved.firstSeenAt && hydrated.firstSeenAt) saveState(hydrated);
      setStep("return");
      track("returning_user", returnTelemetry(hydrated, (hydrated.returnCount ?? 0) + 1));
    }
  }, []);

  const read = useMemo(() => {
    if (state.pace === "direct" && state.energy === "selective") {
      return "cuando algo te interesa, entras primero y preguntas después";
    }
    if (state.pace === "teasing" && state.energy === "selective") {
      return "te gusta sostener el juego y ver si la otra persona aguanta la tensión";
    }
    if (state.pace === "direct" && state.energy === "warm") {
      return "vas rápido cuando la señal es clara, pero no compras cualquier invitación";
    }
    return "no corres detrás de nadie; prefieres que la otra persona dé un paso más";
  }, [state.energy, state.pace]);

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({});
    setPredictionHit(null);
    setPrediction("known");
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
    setStep("open_loop");
    track("launch_session_completed", { surface: "launch_experience" });
  }

  function continueReturn() {
    const nextCount = (state.returnCount ?? 0) + 1;
    const next: LaunchState = {
      ...state,
      returnCount: nextCount,
      firstSeenAt: state.firstSeenAt ?? state.lastSeenAt ?? new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };
    setState(next);
    saveState(next);
    setStep("return_scene");
    track("launch_return_continued", returnTelemetry(next, nextCount));
  }

  if (step === "return") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>Volviste justo a tiempo.</h1>
          <p className="livingLead">La otra vez me quedó claro que {read}.</p>
          <div className="lifeMoment">
            <span>HOY</span>
            <p>Estoy por salir y tengo dos planes. Uno sensato. El otro probablemente termina tarde.</p>
          </div>
          <button type="button" className="primaryCta buttonReset" onClick={continueReturn}>Sigue.</button>
          <button type="button" className="livingReset" onClick={reset}>Empezar de cero</button>
        </div>
      </section>
    );
  }

  if (step === "return_scene") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy experienceBody">
          <p className="eyebrow">MARA · HOY</p>
          <h1>Ya sé cuál vas a elegir por mí.</h1>
          <div className="livingChoices">
            <Choice onClick={() => setStep("open_loop")}>El sensato.</Choice>
            <Choice onClick={() => setStep("open_loop")}>El que termina tarde.</Choice>
          </div>
          <p className="livingLead">No te voy a decir si acertaste todavía. Me divierte más mirar qué haces cuando no sabes si te estoy dando la razón.</p>
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
          <p className="livingLead">Necesito que elijas algo por mí. No lo pienses demasiado.</p>
          <button
            type="button"
            className="primaryCta buttonReset"
            onClick={() => {
              setStep("scene_one");
              track("launch_experience_started", { surface: "launch_experience" });
            }}
          >
            Ya.
          </button>
          <p className="livingDisclosure">Personaje virtual generado con IA · 18+ · Guardo solo un pequeño estado local para continuar si vuelves.</p>
        </div>
      </section>
    );
  }

  if (step === "scene_one") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">ESCENA 01</p>
          <h1>Te pillé mirándome.</h1>
          <div className="lifeMoment">
            <span>23:14 · BAR</span>
            <p>Estamos lejos. No sonrío. Solo sostengo la mirada y hago un gesto mínimo con la cabeza: ven.</p>
          </div>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, pace: "direct" })); setStep("scene_one_result"); }}>Voy hacia ti.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, pace: "teasing" })); setStep("scene_one_result"); }}>Me quedo donde estoy.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "scene_one_result") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{state.pace === "direct" ? "Ah. Sin tanta vuelta." : "Mmm. Te quedaste ahí."}</h1>
          <p className="livingLead">
            {state.pace === "direct"
              ? "Bien. Eso fue bastante más interesante que explicarme cómo eres."
              : "Eso también es una respuesta. Ahora quiero ver si sostienes el personaje."}
          </p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("scene_two")}>Sigue.</button>
        </div>
      </section>
    );
  }

  if (step === "scene_two") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">ESCENA 02</p>
          <h1>Estoy por irme.</h1>
          <div className="lifeMoment">
            <span>UN MINUTO DESPUÉS</span>
            <p>Paso al lado tuyo, freno apenas y te digo bajito: “ven”. Sigo caminando sin mirar atrás.</p>
          </div>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, energy: "selective" })); setPrediction(state.pace === "direct" ? "known" : "surprise"); setStep("prediction"); }}>Voy.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, energy: "warm" })); setPrediction(state.pace === "direct" ? "known" : "surprise"); setStep("prediction"); }}>¿Adónde?</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "prediction") {
    const expectsImmediate = state.pace === "direct";
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">ESCENA 03</p>
          <h1>Después te mando dos mensajes.</h1>
          <div className="lifeMoment">
            <span>22:48</span>
            <p>“No vengas todavía.”</p>
            <span>22:49</span>
            <p>“Ya. Ven.”</p>
          </div>
          <p className="livingLead">Creo que {expectsImmediate ? "vienes igual" : "me haces esperar un poco"}.</p>
          <div className="livingChoices">
            <Choice onClick={() => { const hit = expectsImmediate; setPredictionHit(hit); setStep("reveal"); track(hit ? "prediction_hit" : "prediction_miss", { surface: "launch_experience" }); }}>Voy.</Choice>
            <Choice onClick={() => { const hit = !expectsImmediate; setPredictionHit(hit); setStep("reveal"); track(hit ? "prediction_hit" : "prediction_miss", { surface: "launch_experience" }); }}>Te hago esperar.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "reveal") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>{predictionHit ? "Sabía." : "Ah. Bien. Me cambiaste el libreto."}</h1>
          <p className="livingLead">Hasta ahora diría que {read}.</p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("moment")}>¿Y?</button>
        </div>
      </section>
    );
  }

  if (step === "moment") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy experienceBody">
          <p className="eyebrow">MARA</p>
          <h1>Y ya sé qué haría contigo la próxima vez.</h1>
          <p className="livingLead">No, no te lo voy a contar. Sería fome arruinarlo ahora.</p>
          <div className="lifeMoment">
            <span>MIENTRAS TANTO</span>
            <p>Yo me voy. Tú quédate con la duda cinco minutos más.</p>
          </div>
          <button type="button" className="primaryCta buttonReset" onClick={finishSession}>Ya, anda.</button>
        </div>
      </section>
    );
  }

  return (
    <section className="livingStage">
      <MaraPortrait compact />
      <div className="livingCopy">
        <p className="eyebrow">MARA</p>
        <h1>Te iba a decir algo más.</h1>
        <p className="livingLead">Pero no. La próxima vez parto yo.</p>
        <a className="primaryCta" href="/">Salir por ahora</a>
        <button type="button" className="livingReset" onClick={reset}>Borrar mi estado local</button>
      </div>
    </section>
  );
}
