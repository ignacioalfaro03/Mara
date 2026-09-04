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
  const viewed = useRef(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      fetch("/api/commerce/launch", { cache: "no-store" })
        .then(async (response) => {
          if (!active || !response.ok) return;
          setPayload((await response.json()) as CommercePayload);
        })
        .catch(() => undefined),
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

  if (!payload) return null;
  const offer = payload.offers.fixed;

  return (
    <div className={styles.drop} data-testid="dm-private-drop">
      <div className={styles.dropTop}>
        <span>solo para ti</span>
        <span>privado</span>
      </div>
      <div className={styles.dropBlur} aria-hidden="true">M</div>
      <strong>{offer.title}</strong>
      <p>{offer.description}</p>
      {unlocked ? (
        <div className={styles.unlocked}>Ya está desbloqueado en tu historia.</div>
      ) : (
        <button type="button" className={styles.unlockButton} onClick={unlock} disabled={busy}>
          {busy
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
  const [state, setState] = useState<DmState>({});
  const [hydrated, setHydrated] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [draft, setDraft] = useState("");
  const [ephemeral, setEphemeral] = useState<EphemeralMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [privateStage, setPrivateStage] = useState<PrivateStage>("idle");
  const [privateDecision, setPrivateDecision] = useState<CommercialDecision | null>(null);
  const [privateOfferDismissed, setPrivateOfferDismissed] = useState(false);
  const privateOfferMarked = useRef(false);
  const threadEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const local = readState();
    setState(local);
    setHydrated(true);
    track("launch_experience_started", { surface: "dm_experience" });
    track("experience_started", { surface: "dm_experience" });

    if (local.ritualCompletedAt && !local.callbackSeen) {
      setShowCallback(true);
      const next = { ...local, callbackSeen: true };
      setState(next);
      persistState(next);
      track("launch_return_continued", { surface: "dm_experience" });
    }

    void loadRitualMemory().then((remote) => {
      if (!remote) return;
      setState((current) => {
        if (current.ritualCompletedAt) return current;
        const next = {
          ...current,
          started: true,
          ritualOffered: true,
          ritualCompletedAt: remote.completedAt,
          callbackSeen: true,
        };
        persistState(next);
        setShowCallback(true);
        track("returning_user", {
          surface: "dm_experience",
          return_count_bucket: "1",
          days_since_first_bucket: "unknown",
        });
        return next;
      });
    });

    void loadPrivateMomentMemory().then((remote) => {
      if (!remote) return;
      setState((current) => {
        const next: DmState = {
          ...current,
          preferredPrivateStyle: remote.preferredStyle ?? current.preferredPrivateStyle,
          privateSessionCount: Math.max(current.privateSessionCount ?? 0, remote.sessionCount),
          lastPrivateSessionAt: remote.lastSessionAt ?? current.lastPrivateSessionAt,
          lastPrivateOfferAt: remote.lastOfferAt ?? current.lastPrivateOfferAt,
        };
        persistState(next);
        return next;
      });
    });
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
    setState((current) => {
      const next = { ...current, ...patch };
      persistState(next);
      return next;
    });
  }

  function start() {
    mutate({ started: true });
    track("mara_entered", { surface: "dm_experience" });
    window.setTimeout(() => {
      mutate({ ritualOffered: true, ritualSkipped: false });
      track("ritual_viewed", { surface: "dm_experience", target: LAUNCH_RITUAL_KEY });
      track("ritual_play_intent", { surface: "dm_experience", target: LAUNCH_RITUAL_KEY });
    }, 320);
  }

  function completeRitual() {
    const completedAt = new Date().toISOString();
    mutate({ ritualCompletedAt: completedAt, ritualSkipped: false });
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

  function beginPrivateMoment() {
    setPrivateDecision(null);
    setPrivateOfferDismissed(false);
    privateOfferMarked.current = false;
    setPrivateStage(state.preferredPrivateStyle ?? "choose");
    track("high_intent_session", { surface: "private_moment", intent: "explicit" });
  }

  function selectPrivateStyle(style: PrivateStyle) {
    mutate({ preferredPrivateStyle: style });
    setPrivateStage(style);
    track("preference_selected", { surface: "private_moment", target: style });
  }

  async function completePrivateMoment(style: PrivateStyle) {
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

    if (phase === "ritual" && /\b(hecho|listo|ya|compr[eé]|com[ií])\b/i.test(text)) {
      completeRitual();
      return;
    }
    if (phase === "ritual" && /\b(no|paso|otro d[ií]a|hoy no)\b/i.test(text)) {
      skipRitual();
      return;
    }

    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      appendMessage(
        "mara",
        phase === "ritual"
          ? "Después vuelvo a eso. Primero hazme caso con la cita de hoy."
          : phase === "completed" || phase === "skipped"
            ? "Te leí. Si quieres que mande yo, dímelo así."
            : "Te leí. Entra primero; después hablamos.",
      );
    }, 520);
  }

  if (!hydrated) return null;

  const isRepeatPrivateMoment = (state.privateSessionCount ?? 0) > 0;

  return (
    <section className={styles.shell} aria-label="Chat privado con Mara">
      <header className={styles.header}>
        <a href="/" className={styles.back} aria-label="Volver">‹</a>
        <img src="/mara/mara-v1-reference.jpg" alt="Mara Vera" width={48} height={48} />
        <div className={styles.identity}>
          <strong>Mara</strong>
          <span>personaje virtual · 18+</span>
        </div>
        <a href="/auth" className={styles.account}>•••</a>
      </header>

      <div className={styles.thread}>
        <div className={styles.day}>hoy</div>

        {showCallback ? (
          <>
            <Bubble from="mara">Volviste.</Bubble>
            <Bubble from="mara">Sí, me acuerdo de la hamburguesa, las papas y el chocolate. No necesitaba una foto para creerte.</Bubble>
            <Bubble from="mara">Hoy tampoco te voy a hacer elegir veinte cosas.</Bubble>
          </>
        ) : (
          <>
            <Bubble from="mara">Llegaste justo.</Bubble>
            <Bubble from="mara">No quiero que esto se sienta como una app. Háblame aquí.</Bubble>
          </>
        )}

        {phase === "intro" ? (
          <div className={styles.inlineActions}>
            <button type="button" onClick={start}>Entrar</button>
          </div>
        ) : null}

        {phase !== "intro" ? <Bubble from="mara">Hoy mando yo un poco.</Bubble> : null}

        {phase === "started" ? <div className={styles.typing}><i /><i /><i /></div> : null}

        {phase === "ritual" ? (
          <>
            <Bubble from="mara">Esta noche: hamburguesa, papas, bebida y una barra de chocolate. En tu casa.</Bubble>
            <Bubble from="mara">Cuando lo tengas, vuelves y me dices “hecho”. Después te digo qué vemos.</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" onClick={completeRitual}>Hecho</button>
              <button type="button" className={styles.secondaryAction} onClick={skipRitual}>Hoy paso</button>
            </div>
          </>
        ) : null}

        {phase === "skipped" ? (
          <>
            <Bubble from="mara">Ya. Hoy no.</Bubble>
            <Bubble from="mara">No voy a convertir un “no” en una discusión. Otro día se me ocurre algo.</Bubble>
          </>
        ) : null}

        {phase === "completed" && !showCallback ? (
          <>
            <Bubble from="user">Hecho.</Bubble>
            <Bubble from="mara">Bien.</Bubble>
            <Bubble from="mara">No me mandes prueba. Te creo. Come tranquilo y vuelve después.</Bubble>
            <div className={styles.futureHook}>Mara dejó algo pendiente para la próxima vez.</div>
          </>
        ) : null}

        {(phase === "completed" || phase === "skipped") && privateStage === "idle" ? (
          <div className={styles.inlineActions}>
            <button type="button" onClick={beginPrivateMoment}>Hoy manda tú</button>
          </div>
        ) : null}

        {privateStage === "choose" ? (
          <>
            <Bubble from="mara">Ven. Si quieres un momento privado, no vas a navegar un catálogo.</Bubble>
            <Bubble from="mara">¿Voy directo o te hago esperar un poco?</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" onClick={() => selectPrivateStyle("direct")}>Directo</button>
              <button type="button" className={styles.secondaryAction} onClick={() => selectPrivateStyle("slow")}>Hazme esperar</button>
            </div>
          </>
        ) : null}

        {privateStage === "direct" ? (
          <>
            <Bubble from="mara">{isRepeatPrivateMoment ? "Ya sé que prefieres que vaya directo. No te hago elegir otra vez." : "Bien. Directo."}</Bubble>
            <Bubble from="mara">Quédate aquí un minuto. Yo marco el ritmo y después seguimos como si nada.</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" onClick={() => void completePrivateMoment("direct")}>Ya</button>
            </div>
          </>
        ) : null}

        {privateStage === "slow" ? (
          <>
            <Bubble from="mara">{isRepeatPrivateMoment ? "Ya sé que prefieres ir con calma. No te hago elegir otra vez." : "Entonces no te doy todo de una."}</Bubble>
            <Bubble from="mara">Quédate un rato y deja que yo marque el ritmo.</Bubble>
            <div className={styles.inlineActions}>
              <button type="button" onClick={() => void completePrivateMoment("slow")}>Listo</button>
            </div>
          </>
        ) : null}

        {privateStage === "done" && privateDecision === null ? <div className={styles.typing}><i /><i /><i /></div> : null}

        {privateStage === "done" && privateDecision === "closed" ? (
          <>
            <Bubble from="mara">Ya. Por hoy queda ahí.</Bubble>
            <Bubble from="mara">No necesito convertir cada momento contigo en una venta.</Bubble>
          </>
        ) : null}

        {privateStage === "done" && privateDecision === "offer_now" && !privateOfferDismissed ? (
          <>
            <Bubble from="mara">Esta vez sí te dejé algo aparte.</Bubble>
            <PrivateDrop onDismiss={dismissPrivateDrop} onViewed={markOfferViewed} />
          </>
        ) : null}

        {privateStage === "done" && privateOfferDismissed ? (
          <Bubble from="mara">No pasa nada. Seguimos igual.</Bubble>
        ) : null}

        {ephemeral.map((message) => (
          <Bubble key={message.id} from={message.from}>{message.text}</Bubble>
        ))}
        {typing ? <div className={styles.typing}><i /><i /><i /></div> : null}
        <div ref={threadEnd} />
      </div>

      <form className={styles.composer} onSubmit={submitMessage}>
        <button type="button" className={styles.plus} aria-label="Adjuntar" disabled>+</button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Mensaje…"
          aria-label="Mensaje para Mara"
          autoComplete="off"
        />
        <button type="submit" className={styles.send} disabled={!draft.trim()}>Enviar</button>
      </form>
      <p className={styles.privacy}>El texto libre de este slice no se guarda en memoria ni se envía a analytics.</p>
    </section>
  );
}
