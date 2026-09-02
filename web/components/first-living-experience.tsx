"use client";

import { useEffect, useMemo, useState } from "react";
import { experiences } from "@/data/experiences";
import { track } from "@/lib/analytics";
import { recommendExperience } from "@/lib/p0/matcher";
import type {
  ExperienceDefinition,
  LifeState,
  P0PersistedState,
  PreferenceProfile,
  PreferenceSignal,
  Recommendation,
  RecommendationMode,
} from "@/lib/p0/types";

const STORAGE_KEY = "mara_p0_living_experience";

const initialLifeState: LifeState = {
  mood: "tired_but_playful",
  workState: "late_day",
  fitnessState: "might_skip_gym",
  openLoop: "deciding_whether_to_train",
};

type Step =
  | "intro"
  | "choice_energy"
  | "choice_interaction"
  | "choice_format"
  | "prediction"
  | "reveal"
  | "recommendation"
  | "experience"
  | "life_callback"
  | "open_loop"
  | "return";

type Reaction = { eyebrow: string; text: string } | null;

function makeSignal(
  key: PreferenceSignal["key"],
  value: string,
  confidence: PreferenceSignal["confidence"] = "medium",
  source: PreferenceSignal["source"] = "choice",
): PreferenceSignal {
  return { key, value, confidence, source };
}

function readPersistedState(): P0PersistedState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as P0PersistedState) : null;
  } catch {
    return null;
  }
}

function writePersistedState(state: P0PersistedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function VoiceNote({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  function play() {
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      setShowTranscript(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice =
      voices.find((voice) => voice.lang.toLowerCase().startsWith("es-cl")) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("es"));

    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.lang = spanishVoice?.lang ?? "es-CL";
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setPlaying(true);
      track("voice_played", { surface: "p0_living_experience" });
    };
    utterance.onend = () => {
      setPlaying(false);
      track("voice_completed", { surface: "p0_living_experience" });
    };
    utterance.onerror = () => {
      setPlaying(false);
      setShowTranscript(true);
    };

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="voiceNote">
      <div className="voiceAvatar" aria-hidden="true">M</div>
      <button className="voicePlay" type="button" onClick={play} aria-label="Reproducir nota de voz de Mara">
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="voiceWave" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ height: `${8 + ((index * 11) % 22)}px` }} />
        ))}
      </div>
      <span className="voiceDuration">0:09</span>
      <button className="voiceTranscriptToggle" type="button" onClick={() => setShowTranscript((value) => !value)}>
        {showTranscript ? "Ocultar" : "Texto"}
      </button>
      {showTranscript ? <p className="voiceTranscript">{text}</p> : null}
      {!supported ? <p className="voiceFallback">Tu navegador no permite la voz P0; queda disponible la transcripción.</p> : null}
    </div>
  );
}

function ChoiceButton({ label, detail, onClick }: { label: string; detail?: string; onClick: () => void }) {
  return (
    <button className="livingChoice" type="button" onClick={onClick}>
      <strong>{label}</strong>
      {detail ? <span>{detail}</span> : null}
    </button>
  );
}

function ExperienceCard({ experience, onOpen }: { experience: ExperienceDefinition; onOpen: () => void }) {
  return (
    <article className="experienceCard">
      <span className="experienceFamily">{experience.family}</span>
      <h2>{experience.title}</h2>
      <p>{experience.body}</p>
      <button type="button" className="primaryCta buttonReset" onClick={onOpen}>Entrar</button>
    </article>
  );
}

export function FirstLivingExperience() {
  const [step, setStep] = useState<Step>("intro");
  const [profile, setProfile] = useState<PreferenceProfile>({});
  const [lifeState, setLifeState] = useState<LifeState>(initialLifeState);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [prediction, setPrediction] = useState<"known_fit" | "adjacent">("known_fit");
  const [predictionHit, setPredictionHit] = useState<boolean | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [activeExperience, setActiveExperience] = useState<ExperienceDefinition | null>(null);
  const [plansToTrain, setPlansToTrain] = useState<boolean | undefined>();
  const [premiumIntentCaptured, setPremiumIntentCaptured] = useState(false);
  const [returnState, setReturnState] = useState<P0PersistedState | null>(null);

  useEffect(() => {
    const persisted = readPersistedState();
    if (persisted?.completed) {
      setReturnState(persisted);
      setProfile(persisted.profile);
      setPlansToTrain(persisted.userContext?.plansToTrain);
      setStep("return");
      track("returning_user", { surface: "p0_living_experience" });
      track("return_session", { has_open_loop: Boolean(persisted.openLoop) });
      return;
    }

    track("first_living_experience_started");
  }, []);

  const revealLine = useMemo(() => {
    const energy = profile.energy?.value;
    const interaction = profile.interaction?.value;
    const format = profile.format?.value;
    const novelty = profile.novelty?.value;

    const fragments = [
      energy === "selective" ? "te gusta que tenga criterio" : "te va mejor algo más relajado",
      interaction === "teasing" ? "prefieres un poco de tensión antes que ir directo" : "no necesitas tanto misterio",
      format === "voice" ? "y el audio te llama más que puro texto" : "y por ahora te basta el texto",
      novelty === "high" ? ". Igual me dejarías salirme un poco del libreto." : ". No necesito inventarte algo raro para mantenerte interesado.",
    ];

    return `Por lo que elegiste, ${fragments.join(", ")}`;
  }, [profile]);

  function start() {
    setStep("choice_energy");
    track("playable_onboarding_started");
  }

  function chooseEnergy(value: "selective" | "warm") {
    const next = { ...profile, energy: makeSignal("energy", value) };
    setProfile(next);
    setReaction({
      eyebrow: "MARA",
      text: value === "selective" ? "Ya. O sea que no quieres que te diga que sí a todo." : "Ok. No todo tiene que ser una prueba.",
    });
    track("choice_made", { step: "energy" });
    window.setTimeout(() => {
      setReaction(null);
      setStep("choice_interaction");
    }, 620);
  }

  function chooseInteraction(value: "teasing" | "direct") {
    const next = { ...profile, interaction: makeSignal("interaction", value) };
    setProfile(next);
    setReaction({
      eyebrow: "MARA",
      text: value === "teasing" ? "Mmm. Era la que esperaba." : "Directo entonces. Me sirve.",
    });
    track("choice_made", { step: "interaction" });
    window.setTimeout(() => {
      setReaction(null);
      setStep("choice_format");
    }, 620);
  }

  function chooseFormat(value: "voice" | "text") {
    const next = { ...profile, format: makeSignal("format", value) };
    setProfile(next);
    const predictedNovelty = next.interaction?.value === "teasing" || next.energy?.value === "selective" ? "adjacent" : "known_fit";
    setPrediction(predictedNovelty);
    setReaction({
      eyebrow: "MARA",
      text: value === "voice" ? "Eso sí cambia bastante cómo se siente." : "Bien. Primero palabras, después vemos.",
    });
    track("choice_made", { step: "format" });
    window.setTimeout(() => {
      setReaction(null);
      setStep("prediction");
      track("onboarding_completed");
      track("mara_prediction_shown");
    }, 620);
  }

  function choosePrediction(value: "known_fit" | "adjacent") {
    const hit = value === prediction;
    const noveltySignal = makeSignal("novelty", value === "adjacent" ? "high" : "low", "medium", "prediction");
    const next = { ...profile, novelty: noveltySignal };
    setProfile(next);
    setPredictionHit(hit);
    track(hit ? "prediction_hit" : "prediction_miss");
    setReaction({ eyebrow: "MARA", text: hit ? "Te voy conociendo." : "Ok. Me cagaste la teoría." });
    window.setTimeout(() => {
      setReaction(null);
      setStep("reveal");
    }, 820);
  }

  function correctReveal(correction: "yes" | "partial" | "no") {
    let nextProfile = profile;

    if (correction === "partial") {
      nextProfile = Object.fromEntries(
        Object.entries(profile).map(([key, signal]) => [key, signal ? { ...signal, confidence: "low" as const } : signal]),
      ) as PreferenceProfile;
    }

    if (correction === "no") {
      nextProfile = Object.fromEntries(
        Object.entries(profile).map(([key, signal]) => [key, signal ? { ...signal, confidence: "low" as const, source: "correction" as const } : signal]),
      ) as PreferenceProfile;
    }

    setProfile(nextProfile);
    track(correction === "yes" ? "reveal_confirmed" : "reveal_corrected", { correction });

    const mode: RecommendationMode = correction === "no" ? "explore" : "known_fit";
    const nextRecommendation = recommendExperience(nextProfile, lifeState, experiences, mode);
    setRecommendation(nextRecommendation);
    track("experience_recommended", { mode });
    setStep("recommendation");
  }

  function chooseRecommendation(experience: ExperienceDefinition, mode: RecommendationMode) {
    setActiveExperience(experience);
    setRecommendation((current) => current ? { ...current, selected: experience, mode } : { selected: experience, mode });
    setStep("experience");
    track("experience_opened", { experience_id: experience.id, mode });
  }

  function surpriseMe() {
    const nextRecommendation = recommendExperience(profile, lifeState, experiences, "surprise_me");
    setRecommendation(nextRecommendation);
    track("surprise_me_selected");
    track("experience_recommended", { mode: "surprise_me" });
  }

  function captureTraining(value: boolean) {
    setPlansToTrain(value);
    setLifeState({
      mood: "playful",
      workState: "done",
      fitnessState: "going_to_gym",
      openLoop: "gym_resolved",
    });
    setStep("life_callback");
  }

  function capturePremiumIntent() {
    setPremiumIntentCaptured(true);
    track("premium_intent", { experience_id: activeExperience?.id ?? "unknown", offer: "continuation" });
  }

  function createOpenLoop() {
    const state: P0PersistedState = {
      completed: true,
      profile,
      selectedExperienceId: activeExperience?.id,
      userContext: { plansToTrain },
      openLoop: {
        id: "theory_followup_01",
        text: "Mara quedó con otra teoría y necesita una respuesta más.",
        createdAt: new Date().toISOString(),
      },
      lastSeenAt: new Date().toISOString(),
    };
    writePersistedState(state);
    track("open_loop_created", { type: "theory_followup" });
    setStep("open_loop");
  }

  function resetExperience() {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile({});
    setReaction(null);
    setRecommendation(null);
    setActiveExperience(null);
    setPlansToTrain(undefined);
    setPremiumIntentCaptured(false);
    setReturnState(null);
    setLifeState(initialLifeState);
    setStep("intro");
  }

  if (reaction) {
    return (
      <section className="livingStage livingReaction" aria-live="polite">
        <div className="livingPortrait" aria-hidden="true"><span>M</span></div>
        <div>
          <p className="eyebrow">{reaction.eyebrow}</p>
          <h1>{reaction.text}</h1>
        </div>
      </section>
    );
  }

  if (step === "return") {
    return (
      <section className="livingStage">
        <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
        <div className="livingCopy">
          <p className="eyebrow">VOLVISTE</p>
          <h1>Ya. Necesitaba otra respuesta tuya para esto.</h1>
          <p className="livingLead">
            {plansToTrain === true
              ? "Y no se me olvidó que ibas a entrenar. Espero que no hayas vendido humo."
              : plansToTrain === false
                ? "La última vez me dijiste que no entrenabas. Hoy no te voy a hacer la misma pregunta."
                : "La última vez dejamos una teoría a medias."}
          </p>
          {returnState?.openLoop ? <p className="livingMemory">Pendiente: {returnState.openLoop.text}</p> : null}
          <div className="livingActions">
            <button type="button" className="primaryCta buttonReset" onClick={resetExperience}>Probar de nuevo</button>
          </div>
          <button type="button" className="livingReset" onClick={resetExperience}>Borrar estado local P0</button>
        </div>
      </section>
    );
  }

  if (step === "intro") {
    return (
      <section className="livingStage livingIntro">
        <div className="livingPortrait" aria-label="Espacio visual de Mara Vera"><span>M</span></div>
        <div className="livingCopy">
          <p className="eyebrow">MARA · AHORA</p>
          <h1>Antes de hablar mucho contigo quiero probar una cosa.</h1>
          <p className="livingLead">Hoy se me alargó el trabajo y todavía estoy decidiendo si ir al gym. Pero primero quiero ver algo contigo.</p>
          <button type="button" className="primaryCta buttonReset" onClick={start}>Dale</button>
          <p className="livingDisclosure">Mara es un personaje virtual generado con IA · P0 guarda solo estado local de baja sensibilidad.</p>
        </div>
      </section>
    );
  }

  if (step === "choice_energy") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">1 DE 3</p>
          <h1>Una fácil. ¿Cómo prefieres que sea conmigo?</h1>
          <div className="livingChoices">
            <ChoiceButton label="Ten criterio" detail="No me digas que sí a todo." onClick={() => chooseEnergy("selective")} />
            <ChoiceButton label="Más tranquila" detail="No todo tiene que ser una prueba." onClick={() => chooseEnergy("warm")} />
          </div>
        </div>
      </section>
    );
  }

  if (step === "choice_interaction") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">2 DE 3</p>
          <h1>¿Te cuento las cosas o te hago esperar un poco?</h1>
          <div className="livingChoices">
            <ChoiceButton label="Hazme esperar" detail="Un poco de tensión primero." onClick={() => chooseInteraction("teasing")} />
            <ChoiceButton label="Dímelo directo" detail="No le demos tantas vueltas." onClick={() => chooseInteraction("direct")} />
          </div>
        </div>
      </section>
    );
  }

  if (step === "choice_format") {
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">3 DE 3</p>
          <h1>Si te mandara algo ahora, ¿qué abres primero?</h1>
          <div className="livingChoices">
            <ChoiceButton label="Una nota de voz" detail="Quiero escuchar cómo lo dices." onClick={() => chooseFormat("voice")} />
            <ChoiceButton label="Un mensaje" detail="Primero dime qué pasa." onClick={() => chooseFormat("text")} />
          </div>
        </div>
      </section>
    );
  }

  if (step === "prediction") {
    const predictedLabel = prediction === "adjacent" ? "Sorpréndeme un poco" : "Elige algo que ya me calce";
    return (
      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MARA APUESTA</p>
          <h1>La próxima creo que ya sé cuál vas a elegir.</h1>
          <p className="livingLead">Mi apuesta: <strong>{predictedLabel}</strong>.</p>
          <div className="livingChoices">
            <ChoiceButton label="Algo que ya me calce" onClick={() => choosePrediction("known_fit")} />
            <ChoiceButton label="Sorpréndeme un poco" onClick={() => choosePrediction("adjacent")} />
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
          <h1>{revealLine}</h1>
          <p className="livingLead">{predictionHit ? "La última me salió bien." : "La última me la rompiste, así que no me voy a hacer la experta."} Corrígeme.</p>
          <div className="correctionRow">
            <button type="button" onClick={() => correctReveal("yes")}>Sí</button>
            <button type="button" onClick={() => correctReveal("partial")}>Más o menos</button>
            <button type="button" onClick={() => correctReveal("no")}>Para nada</button>
          </div>
        </div>
      </section>
    );
  }

  if (step === "recommendation" && recommendation) {
    return (
      <section className="livingStage livingRecommendation">
        <div className="livingCopy">
          <p className="eyebrow">MARA ELIGE</p>
          <h1>{recommendation.selected.maraIntro}</h1>
          <ExperienceCard
            experience={recommendation.selected}
            onOpen={() => chooseRecommendation(recommendation.selected, recommendation.mode)}
          />
          <div className="recommendationAlternatives">
            {recommendation.alternative ? (
              <button type="button" onClick={() => chooseRecommendation(recommendation.alternative!, "explore")}>Dame la otra</button>
            ) : null}
            <button type="button" onClick={surpriseMe}>Sorpréndeme</button>
          </div>
        </div>
      </section>
    );
  }

  if (step === "experience" && activeExperience) {
    return (
      <section className="livingStage">
        <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
        <div className="livingCopy experienceBody">
          <p className="eyebrow">{activeExperience.title}</p>
          <h1>{activeExperience.maraIntro}</h1>
          <p className="livingLead">{activeExperience.body}</p>
          {activeExperience.voiceText ? <VoiceNote text={activeExperience.voiceText} /> : (
            <div className="maraMessage">No todo te lo voy a mandar en audio. Esta vez prefiero dejarlo así.</div>
          )}
          <div className="lifeMoment">
            <span>AHORA</span>
            <p>Al final sí voy a ir al gym. Me dio lata reconocerlo después de haber dicho que probablemente no iba.</p>
          </div>
          <div className="userContextPrompt">
            <p>¿No que tú también entrenabas hoy, o me estoy inventando eso?</p>
            <button type="button" onClick={() => captureTraining(true)}>Sí, entreno</button>
            <button type="button" onClick={() => captureTraining(false)}>No hoy</button>
          </div>
          {activeExperience.premiumLabel ? (
            <div className="premiumIntentCard">
              <span>P0 · PREMIUM INTENT</span>
              <strong>{activeExperience.premiumLabel}</strong>
              <p>Este test mide deseo de continuar. No hay cobro ni checkout activo.</p>
              <button type="button" onClick={capturePremiumIntent} disabled={premiumIntentCaptured}>
                {premiumIntentCaptured ? "Interés guardado" : "Yo seguiría"}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (step === "life_callback") {
    return (
      <section className="livingStage">
        <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
        <div className="livingCopy">
          <p className="eyebrow">UN RATO DESPUÉS</p>
          <h1>Ya llegué. Y sí, entré al gym.</h1>
          <p className="livingLead">
            {plansToTrain
              ? "Tú dijiste que también ibas. Después no me vengas con que se te olvidó."
              : "Tú hoy zafaste, así que no te voy a dar un discurso de disciplina."}
          </p>
          <button type="button" className="primaryCta buttonReset" onClick={createOpenLoop}>Sigue</button>
        </div>
      </section>
    );
  }

  return (
    <section className="livingStage">
      <div className="livingPortrait livingPortraitCompact" aria-hidden="true"><span>M</span></div>
      <div className="livingCopy">
        <p className="eyebrow">LO DEJAMOS ACÁ</p>
        <h1>Me quedó otra teoría contigo, pero necesito una respuesta más.</h1>
        <p className="livingLead">No ahora. Cuando vuelvas.</p>
        <p className="livingMemory">El P0 guardó localmente solo tus señales de interacción, el pequeño callback y este open loop.</p>
        <a className="primaryCta" href="/">Salir por ahora</a>
        <button type="button" className="livingReset" onClick={resetExperience}>Borrar estado local P0</button>
      </div>
    </section>
  );
}
