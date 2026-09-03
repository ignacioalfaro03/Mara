"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { MaraPortrait } from "@/components/mara-presence";

const STORAGE_KEY = "mara_launch_state_v1";
const DAY_MS = 24 * 60 * 60 * 1000;

type Step =
  | "intro"
  | "energy"
  | "pace"
  | "prediction"
  | "reveal"
  | "moment"
  | "return_moment"
  | "open_loop"
  | "return";

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

  const theory = useMemo(() => {
    if (state.energy === "selective" && state.pace === "teasing") {
      return "te gusta que te contradiga un poco y que no te entregue todo de inmediato";
    }
    if (state.energy === "selective" && state.pace === "direct") {
      return "te gusta que tenga criterio, pero si tengo algo que decirte prefieres que vaya al grano";
    }
    if (state.energy === "warm" && state.pace === "teasing") {
      return "no quieres que convierta todo en una prueba, aunque igual disfrutas cuando dejo algo pendiente";
    }
    return "prefieres que esto fluya fácil y que no te haga perder tiempo cuando ya sé lo que quiero decir";
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

  function continueReturn(mode: "known" | "surprise") {
    const nextCount = (state.returnCount ?? 0) + 1;
    const next: LaunchState = {
      ...state,
      returnCount: nextCount,
      firstSeenAt: state.firstSeenAt ?? state.lastSeenAt ?? new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };
    setState(next);
    saveState(next);
    setPrediction(mode);
    setStep("return_moment");
    track("launch_return_continued", returnTelemetry(next, nextCount));
  }

  if (step === "return") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>Volviste.</h1>
          <p className="livingLead">Bien. Ahora sí puedo comprobar una cosa.</p>
          <p className="livingMemory">La última vez pensé que {theory}.</p>
          <div className="livingChoices">
            <Choice onClick={() => continueReturn("known")}>Dímela.</Choice>
            <Choice onClick={() => continueReturn("surprise")}>Adivina otra vez.</Choice>
          </div>
          <button type="button" className="livingReset" onClick={reset}>Empezar de cero</button>
        </div>
      </section>
    );
  }

  if (step === "return_moment") {
    return (
      <section className="livingStage">
        <MaraPortrait compact />
        <div className="livingCopy experienceBody">
          <p className="eyebrow">MARA · HOY</p>
          <h1>{prediction === "surprise" ? "Mmm. Sigues prefiriendo que me arriesgue." : "Esta vez no necesito preguntarte tanto."}</h1>
          <p className="livingLead">
            {state.pace === "teasing"
              ? "Tengo una segunda teoría. Podría decírtela ahora, pero hoy voy a elegir yo: te la dejo pendiente."
              : "La primera vez quisiste que fuera directa. Me acuerdo. Igual quiero ver si vuelves cuando no te doy un cierre perfecto."}
          </p>
          <div className="lifeMoment">
            <span>MIENTRAS TANTO</span>
            <p>Hoy tengo café frío al lado y todavía no decido si salir más tarde. Una cosa a la vez.</p>
          </div>
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
          <h1>No me digas quién eres todavía.</h1>
          <p className="livingLead">Quiero ver cómo eliges cuando no alcanzas a preparar la respuesta.</p>
          <button
            type="button"
            className="primaryCta buttonReset"
            onClick={() => {
              setStep("energy");
              track("launch_experience_started", { surface: "launch_experience" });
            }}
          >
            A ver.
          </button>
          <p className="livingDisclosure">Personaje virtual generado con IA · 18+ · Guardo solo un pequeño estado local para continuar si vuelves.</p>
        </div>
      </section>
    );
  }

  if (step === "energy") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>Si no estoy de acuerdo contigo, ¿qué hago?</h1>
          <p className="livingLead">Elige rápido.</p>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, energy: "selective" })); setStep("pace"); }}>Dímelo.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, energy: "warm" })); setStep("pace"); }}>No hagas un tema de todo.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "pace") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>Bien. Y si creo que ya entendí algo de ti...</h1>
          <p className="livingLead">¿te lo digo al tiro o te dejo con la duda?</p>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, pace: "direct" })); setPrediction("known"); setStep("prediction"); }}>Dímelo.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, pace: "teasing" })); setPrediction("surprise"); setStep("prediction"); }}>Déjame con la duda.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "prediction") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MARA</p>
          <h1>Ya tengo una apuesta.</h1>
          <p className="livingLead">
            Creo que ahora vas a elegir <strong>{prediction === "surprise" ? "algo que no esperabas" : "algo que ya sabes que te calza"}</strong>.
          </p>
          <div className="livingChoices">
            <Choice onClick={() => { const hit = prediction === "known"; setPredictionHit(hit); setStep("reveal"); track(hit ? "prediction_hit" : "prediction_miss", { surface: "launch_experience" }); }}>Algo que ya me calce.</Choice>
            <Choice onClick={() => { const hit = prediction === "surprise"; setPredictionHit(hit); setStep("reveal"); track(hit ? "prediction_hit" : "prediction_miss", { surface: "launch_experience" }); }}>Sorpréndeme un poco.</Choice>
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
          <h1>{predictionHit ? "Mmm. Eso pensé." : "No. Esa no te la leí."}</h1>
          <p className="livingLead">
            {predictionHit
              ? `Y ahora tengo otra: ${theory}.`
              : `Mejor. Entonces te apuré demasiado. Pero igual me quedó esto: ${theory}.`}
          </p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("moment")}>¿Qué cosa?</button>
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
          <h1>No te voy a preguntar más.</h1>
          <p className="livingLead">
            {state.pace === "teasing"
              ? "Tengo una segunda teoría sobre ti. Esa no te la voy a decir hoy."
              : "Tengo una segunda teoría sobre ti. Y sí, sé que dijiste que fuera directa. Igual esta te la voy a dejar pendiente."}
          </p>
          <div className="lifeMoment"><span>MIENTRAS TANTO</span><p>Yo voy a cambiar este café antes de que se convierta en otra mala decisión del día.</p></div>
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
        <h1>Me quedó otra cosa contigo.</h1>
        <p className="livingLead">No. Esa no te la digo ahora. Cuando vuelvas vemos si todavía la pienso.</p>
        <a className="primaryCta" href="/">Salir por ahora</a>
        <button type="button" className="livingReset" onClick={reset}>Borrar mi estado local</button>
      </div>
    </section>
  );
}
