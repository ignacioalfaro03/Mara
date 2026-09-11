"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { formatMinorAmount, type CommerceOffer } from "@/lib/commerce/catalog";
import {
  completePrivateMomentMemory,
  loadPrivateMomentMemory,
  markPrivateOfferShown,
  type CommercialDecision,
  type PrivateStyle,
} from "@/lib/private-moment-client";
import { completeRitualMemory, LAUNCH_RITUAL_KEY, loadRitualMemory } from "@/lib/ritual-client";
import { deviceVersion } from "@/lib/local-device-state";
import { DM_SCENES, privateScene } from "@/lib/dm-scenes";
import { WorldBridge } from "./world-bridge";
import { useDeviceAccount } from "./device-memory-boundary";
import styles from "./dm-experience.module.css";

const STORAGE_KEY = "mara_dm_state_v1";
const CHECKOUT_REQUEST_KEY = "mara_dm_checkout_request_v1";
const PRIVATE_NOTE_ENTITLEMENT = "private_after_scene_note_v1";
const OFFER_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

type DmState = {
  started?: boolean;
  ritualOffered?: boolean;
  ritualCompletedAt?: string;
  ritualSkipped?: boolean;
  callbackSeen?: boolean;
  continuityPromptDismissed?: boolean;
  dropDismissed?: boolean;
  preferredPrivateStyle?: PrivateStyle;
  privateSessionCount?: number;
  lastPrivateSessionAt?: string;
  lastPrivateOfferAt?: string;
};

type PrivateStage = "idle" | "choose" | "direct" | "slow" | "done";

type EphemeralMessage = {
  id: string;
  from: "user" | "mara";
  text: string;
};

type CommercePayload = {
  payment:
    | { status: "configured"; provider: string }
    | { status: "not_configured"; provider: "disabled"; reason: string };
  offers: { fixed: CommerceOffer };
};

type ViewerPayload = {
  entitlements?: Array<{ key: string; status: "active" | "revoked" }>;
};

function readState(): DmState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DmState) : {};
  } catch {
    return {};
  }
}

function persistState(next: DmState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Local continuity is best effort; authenticated relationship memory remains server-backed.
  }
}

function localCommercialDecision(sessionCount: number, lastOfferAt?: string): CommercialDecision {
  if (sessionCount < 2) return "closed";
  const parsedLastOffer = lastOfferAt ? Date.parse(lastOfferAt) : Number.NaN;
  if (Number.isFinite(parsedLastOffer) && Date.now() - parsedLastOffer < OFFER_COOLDOWN_MS) return "closed";
  return "offer_now";
}

function checkoutRequestId() {
  try {
    const existing = window.sessionStorage.getItem(CHECKOUT_REQUEST_KEY);
    if (existing) return existing;
    const next = crypto.randomUUID();
    window.sessionStorage.setItem(CHECKOUT_REQUEST_KEY, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

function Bubble({ from, children }: { from: "mara" | "user"; children: React.ReactNode }) {
  return (
    <div className={`${styles.row} ${from === "user" ? styles.rowUser : ""}`}>
      <div className={`${styles.bubble} ${from === "user" ? styles.userBubble : styles.maraBubble}`}>{children}</div>
    </div>
  );
}

function PrivateDrop({ onDismiss, onViewed }: { onDismiss: () => void; onViewed: () => void }) {
  const [payload, setPayload] = useState<CommercePayload | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      fetch("/api/commerce/launch", { cache: "no-store", signal: AbortSignal.timeout(5000) })
        .then(async (response) => {
          if (!response.ok) throw new Error("offer_unavailable");
          const next = (await response.json()) as CommercePayload;
          if (active) setPayload(next);
        })
        .catch(() => { if (active) setLoadFailed(true); }),
      fetch("/api/commerce/me", { cache: "no-store", credentials: "same-origin" })
        .then(async (response) => {
          if (!active || !response.ok) return;
          const viewer = (await response.json()) as ViewerPayload;
          setUnlocked(viewer.entitlements?.some((item) => item.key === PRIVATE_NOTE_ENTITLEMENT && item.status === "active") ?? false);
        })
        .catch(() => undefined),
    ]);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!payload || viewed.current) return;
    viewed.current = true;
    onViewed();
    track("commerce_offer_viewed", {
      surface: "dm_private_moment",
      offer_slug: payload.offers.fixed.slug,
      offer_type: payload.offers.fixed.type,
      provider_status: payload.payment.status,
    });
  }, [onViewed, payload]);

  async function unlock() {
    if (!payload) return;
    const offer = payload.offers.fixed;
    track("offer_clicked", {
      surface: "dm_private_moment",
      offer_slug: offer.slug,
      offer_type: offer.type,
      provider_status: payload.payment.status,
    });
    if (payload.payment.status !== "configured") {
      setNotice("Todavía no puedo cobrar por esto hasta tener un procesador aprobado.");
      track("commerce_checkout_blocked", {
        surface: "dm_private_moment",
        offer_slug: offer.slug,
        offer_type: offer.type,
        provider_status: payload.payment.status,
      });
      return;
    }

    setBusy(true);
    setNotice("");
    track("commerce_checkout_started", {
      surface: "dm_private_moment",
      offer_slug: offer.slug,
      offer_type: offer.type,
      amount_bucket: "under_5",
      currency: offer.currency,
      provider_status: payload.payment.status,
    });

    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          offerSlug: offer.slug,
          amountMinor: null,
          clientRequestId: checkoutRequestId(),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { checkoutUrl?: string; error?: string };

      if (response.status === 401) {
        setNotice("Entra a tu cuenta primero. Así lo que desbloquees queda contigo, no con este teléfono.");
        return;
      }
      if (!response.ok || !result.checkoutUrl) {
        setNotice("No pude abrir checkout. Nada se marcó como comprado.");
        return;
      }
      window.location.assign(result.checkoutUrl);
    } catch {
      setNotice("No pude conectar con checkout. Nada se marcó como comprado.");
    } finally {
      setBusy(false);
    }
  }

  if (!payload) return <div className={styles.drop} role="status">
    <p>{loadFailed ? "No pude cargar la nota. Podemos seguir igual." : "Un segundo…"}</p>
    <button className={styles.dismissButton} type="button" onClick={onDismiss}>Seguir con Mara Vera</button>
  </div>;
  const offer = payload.offers.fixed;

  return (
    <div className={styles.drop} data-testid="dm-private-drop">
      <div className={styles.dropTop}>
        <span>{payload.payment.status === "configured" ? "nota privada" : "en preparación"}</span>
        <span>Creator Zero</span>
      </div>
      <div className={styles.dropBlur} aria-hidden="true">M</div>
      <strong>{offer.title}</strong>
      <p>{offer.description}</p>
      {payload.payment.status !== "configured" ? <p>Precio de referencia: {formatMinorAmount(offer.amountMinor ?? 0, offer.currency)} {offer.currency}. Aún no está a la venta. Esta Alpha es gratuita.</p> : null}
      {unlocked ? (
        <div className={styles.unlocked}>Ya está desbloqueado en tu historia.</div>
      ) : (
        <button type="button" className={styles.unlockButton} onClick={unlock} disabled={busy || payload.payment.status !== "configured"}>
          {payload.payment.status !== "configured" ? "Aún no disponible" : busy
            ? "Abriendo…"
            : offer.amountMinor
              ? `Ver · ${formatMinorAmount(offer.amountMinor, offer.currency)}`
              : "Ver"}
        </button>
      )}
      <button type="button" className={styles.dismissButton} onClick={onDismiss}>Ahora no</button>
      {notice ? <p className={styles.notice} role="status">{notice}</p> : null}
    </div>
  );
}

export function DmExperience() {
  const authenticated = useDeviceAccount();
  const version = useRef(deviceVersion());
  const [state, setState] = useState<DmState>({});
  const [hydrated, setHydrated] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [draft, setDraft] = useState("");
  const [ephemeral, setEphemeral] = useState<EphemeralMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [privateStage, setPrivateStage] = useState<PrivateStage>("idle");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [rememberedStyle, setRememberedStyle] = useState(false);
  const [saving, setSaving] = useState(false);
  const completing = useRef(false);
  const postDeclineContinued = useRef(false);
  const [privateDecision, setPrivateDecision] = useState<CommercialDecision | null>(null);
  const [privateOfferDismissed, setPrivateOfferDismissed] = useState(false);
  const privateOfferMarked = useRef(false);
  const recallEngaged = useRef(false);
  const threadEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    const local = readState();
    track("launch_experience_started", { surface: "dm_experience" });
    track("experience_started", { surface: "dm_experience" });
    void Promise.all([loadRitualMemory(), loadPrivateMomentMemory()]).then(([ritual, remote]) => {
      if (!active || deviceVersion() !== version.current) return;
      const next: DmState = {
        ...local,
        ritualCompletedAt: ritual?.completedAt ?? local.ritualCompletedAt,
        preferredPrivateStyle: remote?.preferredStyle ?? local.preferredPrivateStyle,
        privateSessionCount: Math.max(local.privateSessionCount ?? 0, remote?.sessionCount ?? 0),
        lastPrivateSessionAt: remote?.lastSessionAt ?? local.lastPrivateSessionAt,
        lastPrivateOfferAt: remote?.lastOfferAt ?? local.lastPrivateOfferAt,
      };
      const returning = Boolean(next.ritualCompletedAt || next.privateSessionCount);
      if (returning) {
        next.started = true;
        next.ritualOffered = true;
        if (!next.ritualCompletedAt) next.ritualSkipped = true;
        next.callbackSeen = true;
        setShowCallback(true);
        track("returning_user", { surface: authenticated ? "dm_authenticated_return" : "dm_experience", days_since_first_bucket: "unknown" });
        track("memory_recall_rendered", { surface: "dm_experience", memory_source: ritual || remote?.sessionCount ? "server" : "local" });
      }
      setState(next);
      persistState(next);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state, ephemeral, showCallback, typing, privateStage, privateDecision, privateOfferDismissed]);

  const phase = useMemo(() => {
    if (!state.started) return "intro";
    if (!state.ritualOffered) return "started";
    if (state.ritualCompletedAt) return "completed";
    if (state.ritualSkipped) return "skipped";
    return "ritual";
  }, [state]);

  function mutate(patch: Partial<DmState>) {
    if (deviceVersion() !== version.current) return;
    setState((current) => {
      const next = { ...current, ...patch };
      persistState(next);
      return next;
    });
  }

  function start() {
    mutate({ started: true });
    track("first_interaction", { surface: "dm_experience", target: "enter" });
    track("mara_entered", { surface: "dm_experience" });
    window.setTimeout(() => {
      mutate({ ritualOffered: true, ritualSkipped: false });
      track("ritual_viewed", { surface: "dm_experience", target: LAUNCH_RITUAL_KEY });
    }, 320);
  }

  function completeRitual() {
    const completedAt = new Date().toISOString();
    mutate({ ritualCompletedAt: completedAt, ritualSkipped: false, continuityPromptDismissed: false });
    track("experience_completed", { surface: "dm_ritual", target: LAUNCH_RITUAL_KEY });
    void completeRitualMemory().then((remote) => {
      if (!remote) return;
      mutate({ ritualCompletedAt: remote.completedAt });
    });
  }

  function skipRitual() {
    mutate({ ritualSkipped: true });
    track("ritual_skipped", { surface: "dm_experience", target: LAUNCH_RITUAL_KEY });
  }

  function openContinuityAccount() {
    track("hero_cta_click", { surface: "dm_continuity", target: "auth" });
    window.location.assign("/auth");
  }

  function dismissContinuityPrompt() {
    mutate({ continuityPromptDismissed: true });
  }

  function beginPrivateMoment() {
    if ((state.privateSessionCount ?? 0) >= DM_SCENES.length) {
      appendMessage("mara", "Ya viste hasta donde te dejo llegar por ahora. Puedes volver a leerlo; lo siguiente debería existir solo si todavía quieres volver.");
      return;
    }
    continueAfterDecline();
    setRememberedStyle(Boolean(state.preferredPrivateStyle));
    setSceneIndex(Math.min(state.privateSessionCount ?? 0, DM_SCENES.length - 1));
    setPrivateDecision(null);
    setPrivateOfferDismissed(false);
    privateOfferMarked.current = false;
    setPrivateStage(state.preferredPrivateStyle ?? "choose");
    if (showCallback && !recallEngaged.current) {
      recallEngaged.current = true;
      track("memory_recall_engaged", { surface: "dm_experience", target: "private_moment" });
      track("launch_return_continued", { surface: "dm_experience", target: "private_moment" });
    }
    track("high_intent_session", { surface: "private_moment", intent: "explicit" });
    track("experience_started", { surface: "private_moment" });
  }

  function selectPrivateStyle(style: PrivateStyle) {
    mutate({ preferredPrivateStyle: style });
    setPrivateStage(style);
    track("first_preference_signal", { surface: "private_moment", target: style, preference_group: "private_style_v1" });
    track("preference_selected", { surface: "private_moment", target: style });
    track("preference_updated", { surface: "private_moment", target: style, preference_group: "private_style_v1" });
  }

  async function completePrivateMoment(style: PrivateStyle) {
    if (completing.current || privateStage === "done") return;
    completing.current = true;
    setSaving(true);
    const completedAt = new Date().toISOString();
    const localCount = (state.privateSessionCount ?? 0) + 1;
    mutate({
      preferredPrivateStyle: style,
      privateSessionCount: localCount,
      lastPrivateSessionAt: completedAt,
    });
    setPrivateStage("done");
    setPrivateDecision(null);
    track("experience_completed", { surface: "private_moment", target: style });

    const remote = await completePrivateMomentMemory(style);
    completing.current = false;
    setSaving(false);
    if (deviceVersion() !== version.current) return;
    if (remote) {
      mutate({
        preferredPrivateStyle: remote.preferredStyle ?? style,
        privateSessionCount: Math.max(localCount, remote.sessionCount),
        lastPrivateSessionAt: remote.lastSessionAt ?? completedAt,
        lastPrivateOfferAt: remote.lastOfferAt ?? state.lastPrivateOfferAt,
      });
      setPrivateDecision(remote.commercial.decision);
      return;
    }

    setPrivateDecision(localCommercialDecision(localCount, state.lastPrivateOfferAt));
  }

  function markOfferViewed() {
    if (privateOfferMarked.current) return;
    privateOfferMarked.current = true;
    const shownAt = new Date().toISOString();
    mutate({ lastPrivateOfferAt: shownAt });
    track("commercial_moment_shown", { surface: "private_moment", decision: "offer_now" });
    void markPrivateOfferShown().then((remote) => {
      if (!remote) return;
      mutate({ lastPrivateOfferAt: remote.lastOfferAt ?? shownAt });
    });
  }

  function dismissPrivateDrop() {
    setPrivateOfferDismissed(true);
    track("commercial_offer_dismissed", { surface: "dm_private_moment" });
  }

  function continueAfterDecline() {
    if (!privateOfferDismissed || postDeclineContinued.current) return;
    postDeclineContinued.current = true;
    track("commercial_post_offer_continued", { surface: "dm_private_moment" });
  }

  function appendMessage(from: "user" | "mara", text: string) {
    setEphemeral((current) => [...current, { id: crypto.randomUUID(), from, text }]);
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    appendMessage("user", text);
    continueAfterDecline();

    if (/^(no(?: estoy listo| quiero| gracias)?|para|basta|paso|hoy no|hasta luego)[.!\s]*$/i.test(text)) {
      if (phase === "ritual") skipRitual();
      setPrivateStage("idle");
      appendMessage("mara", "Ya. Hasta aquí. Si vuelves, seguimos desde donde tú elegiste parar.");
      return;
    }

    if (phase === "intro") { start(); return; }

    if (privateStage === "choose" && /\b(directo|directa|r[aá]pido|al grano)\b/i.test(text)) {
      selectPrivateStyle("direct");
      return;
    }
    if (privateStage === "choose" && /\b(espera|lento|lenta|calma)\b/i.test(text)) {
      selectPrivateStyle("slow");
      return;
    }
    if ((privateStage === "direct" || privateStage === "slow") && /\b(ya|listo|lista|hecho)\b/i.test(text)) {
      void completePrivateMoment(privateStage);
      return;
    }

    if ((phase === "completed" || phase === "skipped") && /\b(manda t[uú]|momento privado|algo privado|estoy solo|estoy caliente|quiero algo)\b/i.test(text)) {
      beginPrivateMoment();
      return;
    }

    if (phase === "ritual" && /\b(no|paso|otro d[ií]a|hoy no)\b/i.test(text)) {
      skipRitual();
      return;
    }
    if (phase === "ritual" && /\b(hecho|listo|ya)\b/i.test(text)) {
      completeRitual();
      return;
    }

    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      appendMessage(
        "mara",
        phase === "ritual"
          ? "Dime ‘hecho’ cuando estés listo. O ‘hoy paso’. No necesito discutir un límite para seguir siendo interesante."
          : phase === "completed" || phase === "skipped"
            ? "No te voy a contar todo porque escribiste una frase cualquiera. Si quieres mi parte privada, pídemela bien."
            : "Acércate. Primero quiero que hagas una cosa.",
      );
    }, 520);
  }

  if (!hydrated) return <p className="memoryLoading" role="status">Recuperando dónde lo dejamos…</p>;

  const isRepeatPrivateMoment = rememberedStyle;
  const scene = privateScene(sceneIndex);
  const storyFinished = (state.privateSessionCount ?? 0) >= DM_SCENES.length;

  return (
    <section className={styles.shell} aria-label="Experiencia privada con Mara Vera">
      <header className={styles.header}>
        <a href="/" className={styles.back} aria-label="Volver">‹</a>
        <img src="/mara/mara-v2-reference.webp" alt="Mara Vera" width={48} height={48} />
        <div className={styles.identity}>
          <strong>Mara Vera</strong>
          <span>Creator Zero · personaje virtual · 18+</span>
        </div>
        <a href="/auth" className={styles.account} aria-label="Cuenta y privacidad">•••</a>
      </header>

      <div className={styles.thread}>
        <div className={styles.day}>ahora</div>

        {showCallback ? (
          <>
            <Bubble from="mara">Volviste.</Bubble>
            <Bubble from="mara">{state.ritualCompletedAt ? "Me acuerdo de que seguiste mi primera regla. No voy a hacer como si fuera la primera vez." : "La última vez elegiste parar antes. También me acuerdo de eso."}</Bubble>
            <Bubble from="mara">{storyFinished ? "Ya conoces las tres partes que te dejé ver. Lo interesante ahora es si todavía vuelves sin que te prometa una cuarta." : (state.privateSessionCount ?? 0) > 0 ? DM_SCENES[Math.min((state.privateSessionCount ?? 1) - 1, DM_SCENES.length - 1)].next : "Te debía una parte más privada. Esta vez no me hagas repetirme."}</Bubble>
          </>
        ) : (
          <>
            <Bubble from="mara">Entraste.</Bubble>
            <Bubble from="mara">Bien. No necesito saber todo de ti todavía. Solo si sabes seguir una instrucción simple.</Bubble>
          </>
        )}

        {phase === "intro" ? (
          <div className={styles.inlineActions}>
            <button type="button" onClick={start}>Dime</button>
          </div>
        ) : null}

        {phase !== "intro" ? <Bubble from="mara">Esta vez marco yo el ritmo.</Bubble> : null}

        {phase === "started" ? <div className={styles.typing}><i /><i /><i /></div> : null}

        {phase === "ritual" ? (
          <>
            <Bubble from="mara">Cierra la puerta. Baja un poco la luz. Deja el teléfono frente a ti y no cambies de pantalla.</Bubble>
            <Bubble from="mara">Cuando estés ahí, dime “hecho”. No necesito una foto. Prefiero saber si lo hiciste porque quisiste.</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" onClick={completeRitual}>Hecho</button>
              <button type="button" className={styles.secondaryAction} onClick={skipRitual}>Hoy paso</button>
            </div>
          </>
        ) : null}

        {phase === "skipped" ? (
          <>
            <Bubble from="mara">Entonces no.</Bubble>
            <Bubble from="mara">No necesito empujarte para mantener tu atención. Si quieres otra cosa, pídela.</Bubble>
          </>
        ) : null}

        {phase === "completed" && !showCallback ? (
          <>
            <Bubble from="user">Hecho.</Bubble>
            <Bubble from="mara">Eso pensé.</Bubble>
            <Bubble from="mara">Ahora sí. Te voy a dejar ver una escena privada. No completa. La parte que falta es precisamente la que más te va a hacer mirar.</Bubble>
            {!authenticated && !state.continuityPromptDismissed ? (
              <>
                <Bubble from="mara">Si quieres que la próxima vez no te trate como un desconocido, guarda dónde lo dejamos.</Bubble>
                <div className={styles.inlineActions} data-testid="dm-continuity-cta">
                  <button type="button" onClick={openContinuityAccount}>Quiero que te acuerdes</button>
                  <button type="button" className={styles.secondaryAction} onClick={dismissContinuityPrompt}>Ahora no</button>
                </div>
              </>
            ) : null}
            <div className={styles.futureHook}>Lo privado empieza después de la primera regla.</div>
          </>
        ) : null}

        {(phase === "completed" || phase === "skipped") && privateStage === "idle" && !storyFinished ? (
          <div className={styles.inlineActions}>
            <button type="button" onClick={beginPrivateMoment}>Quiero tu parte</button>
          </div>
        ) : null}

        {privateStage === "choose" ? (
          <>
            <Bubble from="mara">Ven. Pero esta vez eliges cómo te lo cuento.</Bubble>
            <Bubble from="mara">¿Voy directo o prefieres que te haga esperar?</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" onClick={() => selectPrivateStyle("direct")}>Directo</button>
              <button type="button" className={styles.secondaryAction} onClick={() => selectPrivateStyle("slow")}>Hazme esperar</button>
            </div>
          </>
        ) : null}

        {privateStage === "direct" ? (
          <>
            <Bubble from="mara">{isRepeatPrivateMoment ? "Ya sé que no te gusta que dé vueltas. Bien. Me acuerdo." : "Bien. Sin vueltas."}</Bubble>
            <Bubble from="mara">{scene.direct}</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" disabled={saving} onClick={() => void completePrivateMoment("direct")}>Sigue</button>
            </div>
          </>
        ) : null}

        {privateStage === "slow" ? (
          <>
            <Bubble from="mara">{isRepeatPrivateMoment ? "Ya sé que prefieres que no te dé todo de inmediato. Eso sí lo recordé." : "Entonces espera. No te voy a dar todo de una."}</Bubble>
            <Bubble from="mara">{scene.slow}</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" disabled={saving} onClick={() => void completePrivateMoment("slow")}>Sigue</button>
            </div>
          </>
        ) : null}

        {privateStage === "done" && privateDecision === null ? <div className={styles.typing}><i /><i /><i /></div> : null}
        {privateStage === "done" ? <>
          <Bubble from="mara">{scene.payoff}</Bubble>
          <p className={styles.futureHook}>{scene.next}</p>
          {!state.ritualCompletedAt && !authenticated && !state.continuityPromptDismissed ? <div className={styles.inlineActions} data-testid="dm-continuity-cta">
            <button type="button" onClick={openContinuityAccount}>Quiero que te acuerdes</button>
            <button type="button" className={styles.secondaryAction} onClick={dismissContinuityPrompt}>Ahora no</button>
          </div> : null}
        </> : null}

        {privateStage === "done" && privateDecision === "closed" ? (
          <>
            <Bubble from="mara">Hasta ahí por hoy. No te voy a llenar la pantalla solo porque puedo.</Bubble>
          </>
        ) : null}

        {privateStage === "done" && privateDecision === "offer_now" && !privateOfferDismissed ? (
          <>
            <Bubble from="mara">Hay una nota que dejé fuera de esta conversación. Puedes mirar qué es. Después decides.</Bubble>
            <PrivateDrop onDismiss={dismissPrivateDrop} onViewed={markOfferViewed} />
          </>
        ) : null}

        {privateStage === "done" && privateOfferDismissed ? (
          <Bubble from="mara">Bien. Un “ahora no” sigue siendo un no. Quédate con la escena.</Bubble>
        ) : null}

        {ephemeral.map((message) => (
          <Bubble key={message.id} from={message.from}>{message.text}</Bubble>
        ))}
        {typing ? <div className={styles.typing}><i /><i /><i /></div> : null}
        <WorldBridge eligible={phase === "completed" || phase === "skipped"} onContinue={continueAfterDecline} />
        {storyFinished ? <details className={styles.futureHook}><summary>Volver a leer lo que te dejé ver</summary>{DM_SCENES.map((item, index) => <p key={index}>{item.direct} {item.payoff}</p>)}</details> : null}
        <div ref={threadEnd} />
      </div>

      <form className={styles.composer} onSubmit={submitMessage}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Dime…"
          aria-label="Mensaje para Mara Vera"
          autoComplete="off"
        />
        <button type="submit" className={styles.send} disabled={!draft.trim()}>Enviar</button>
      </form>
      <p className={styles.privacy}>Experiencia interactiva ficticia de Creator Zero. Tu texto libre queda en esta pantalla y no se guarda.</p>
    </section>
  );
}
