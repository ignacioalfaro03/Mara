"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mara_launch_state_v1";

type Step = "intro" | "context" | "energy" | "pace" | "prediction" | "reveal" | "moment" | "open_loop" | "return";

type LaunchState = {
  energy?: "selective" | "warm";
  pace?: "teasing" | "direct";
  trainedToday?: boolean;
  completed?: boolean;
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

function Choice({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" className="livingChoice" onClick={onClick}><strong>{children}</strong></button>;
}

export function LaunchExperience() {
  const [step, setStep] = useState<Step>("intro");
  const [state, setState] = useState<LaunchState>({});
  const [prediction, setPrediction] = useState<"known" | "surprise">("known");
  const [predictionHit, setPredictionHit] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = readState();
    if (saved?.completed) {
      setState(saved);
      setStep("return");
    }
  }, []);

  const theory = useMemo(() => {
    const a = state.energy === "selective" ? "te gusta que tenga criterio" : "prefieres que no todo sea una prueba";
    const b = state.pace === "teasing" ? "y te funciona más un poco de tensión antes que ir directo" : "y cuando quieres algo, prefieres que no le dé tantas vueltas";
    return `${a}, ${b}.`;
  }, [state.energy, state.pace]);

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({});
    setPredictionHit(null);
    setStep("intro");
  }

  if (step === "return") {
    return (
      <section className="livingStage">
        <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
        <div className="livingCopy">
          <p className="eyebrow">VOLVISTE</p>
          <h1>Bien. Me había quedado algo pendiente contigo.</h1>
          <p className="livingLead">
            {state.trainedToday === true
              ? "La última vez dijiste que entrenabas. Espero que no haya sido puro discurso."
              : "La última vez me dejaste claro que no entrenabas. Hoy no voy a empezar por ahí."}
          </p>
          <div className="livingChoices">
            <Choice onClick={() => setStep("moment")}>Sigue tú</Choice>
            <Choice onClick={() => { setPrediction("surprise"); setStep("prediction"); }}>Sorpréndeme un poco</Choice>
          </div>
          <button type="button" className="livingReset" onClick={reset}>Empezar de cero</button>
        </div>
      </section>
    );
  }

  if (step === "intro") {
    return (
      <section className="livingStage livingIntro">
        <div className="livingPortrait" aria-label="Mara Vera"><span>M</span></div>
        <div className="livingCopy">
          <p className="eyebrow">MARA · AHORA</p>
          <h1>Antes de hablar mucho contigo quiero probar una cosa.</h1>
          <p className="livingLead">Hoy se me alargó el trabajo y todavía estoy decidiendo si ir al gym. Pero primero quiero cachar algo de ti.</p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("context")}>Dale</button>
          <p className="livingDisclosure">Mara es un personaje virtual generado con IA. Esta experiencia guarda solo un pequeño estado local en tu navegador para poder continuar cuando vuelvas.</p>
        </div>
      </section>
    );
  }

  if (step === "context") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">ANTES</p>
          <h1>Yo sigo dudando con el gym. ¿Tú entrenas hoy?</h1>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, trainedToday: true })); setStep("energy"); }}>Sí, entreno</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, trainedToday: false })); setStep("energy"); }}>No hoy</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "energy") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">UNA FÁCIL</p>
          <h1>¿Cómo prefieres que sea conmigo?</h1>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, energy: "selective" })); setStep("pace"); }}>Ten criterio. No me digas que sí a todo.</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, energy: "warm" })); setStep("pace"); }}>Más tranquila. No todo tiene que ser una prueba.</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "pace") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">OTRA</p>
          <h1>¿Te cuento las cosas o te hago esperar un poco?</h1>
          <div className="livingChoices">
            <Choice onClick={() => { setState((s) => ({ ...s, pace: "teasing" })); setPrediction("surprise"); setStep("prediction"); }}>Hazme esperar un poco</Choice>
            <Choice onClick={() => { setState((s) => ({ ...s, pace: "direct" })); setPrediction("known"); setStep("prediction"); }}>Dímelo directo</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "prediction") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MARA APUESTA</p>
          <h1>La próxima creo que ya sé cuál vas a elegir.</h1>
          <p className="livingLead">Mi apuesta: <strong>{prediction === "surprise" ? "me vas a dejar arriesgar un poco" : "vas a preferir algo que ya te calce"}</strong>.</p>
          <div className="livingChoices">
            <Choice onClick={() => { setPredictionHit(prediction === "known"); setStep("reveal"); }}>Algo que ya me calce</Choice>
            <Choice onClick={() => { setPredictionHit(prediction === "surprise"); setStep("reveal"); }}>Sorpréndeme un poco</Choice>
          </div>
        </div>
      </section>
    );
  }

  if (step === "reveal") {
    return (
      <section className="livingStage">
        <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
        <div className="livingCopy">
          <p className="eyebrow">TENGO UNA TEORÍA</p>
          <h1>Por ahora, {theory}</h1>
          <p className="livingLead">{predictionHit ? "Y esa última te la leí bien." : "La última no te la leí. Bien, así no me aburro."}</p>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("moment")}>Sigue</button>
        </div>
      </section>
    );
  }

  if (step === "moment") {
    return (
      <section className="livingStage">
        <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
        <div className="livingCopy experienceBody">
          <p className="eyebrow">MARA · AHORA</p>
          <h1>{state.energy === "selective" ? "No necesito darte diez opciones." : "No necesito convertir todo en un juego."}</h1>
          <p className="livingLead">
            {state.pace === "teasing"
              ? "Te voy a dejar con una sola cosa pendiente: la próxima vez voy a comprobar si de verdad te gusta esperar o si solo te gustó decirlo."
              : "Te lo digo directo: prefiero aprender cómo reaccionas antes que hacerte llenar un perfil eterno."}
          </p>
          <div className="lifeMoment"><span>MIENTRAS TANTO</span><p>Yo ya decidí: sí voy al gym. Me dio lata admitirlo después de decir que probablemente no iba.</p></div>
          <button type="button" className="primaryCta buttonReset" onClick={() => setStep("open_loop")}>Déjalo ahí</button>
        </div>
      </section>
    );
  }

  const finalState = { ...state, completed: true, lastSeenAt: new Date().toISOString() };
  if (!state.completed) saveState(finalState);

  return (
    <section className="livingStage">
      <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
      <div className="livingCopy">
        <p className="eyebrow">LO DEJAMOS ACÁ</p>
        <h1>Me quedó otra teoría contigo.</h1>
        <p className="livingLead">No necesito resolverla ahora. Cuando vuelvas seguimos.</p>
        <a className="primaryCta" href="/">Salir por ahora</a>
        <button type="button" className="livingReset" onClick={reset}>Borrar mi estado local</button>
      </div>
    </section>
  );
}
