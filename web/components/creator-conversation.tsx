"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ThreadRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  sender_kind: "consumer" | "creator" | "system";
  type: string;
  body: string;
  offer_id: string | null;
  created_at: string;
};

type OfferRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  amount_minor: number | null;
  currency: string;
};

function money(amountMinor: number | null, currency: string) {
  if (amountMinor === null) return "Ver";
  return new Intl.NumberFormat("es-CL", { style: "currency", currency, maximumFractionDigits: currency === "CLP" ? 0 : 2 }).format(amountMinor / 100);
}

export function CreatorConversation({
  worldSlug,
  displayName,
  portrait,
}: {
  worldSlug: string;
  displayName: string;
  portrait: string | null;
}) {
  const [thread, setThread] = useState<ThreadRow | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "auth" | "disabled" | "error">("loading");
  const [sending, setSending] = useState(false);
  const end = useRef<HTMLDivElement | null>(null);

  async function loadMessages(threadId: string) {
    const response = await fetch(`/api/messages?threadId=${encodeURIComponent(threadId)}`, { cache: "no-store", credentials: "same-origin" });
    if (response.status === 401) { setStatus("auth"); return; }
    if (response.status === 404) { setStatus("disabled"); return; }
    if (!response.ok) { setStatus("error"); return; }
    const payload = (await response.json()) as { thread?: ThreadRow; messages?: MessageRow[]; offers?: OfferRow[] };
    setThread(payload.thread ?? null);
    setMessages(payload.messages ?? []);
    setOffers(payload.offers ?? []);
    setStatus("ready");
  }

  useEffect(() => {
    let active = true;
    void fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ worldSlug }),
    }).then(async (response) => {
      if (!active) return;
      if (response.status === 401) { setStatus("auth"); return; }
      if (response.status === 404) { setStatus("disabled"); return; }
      if (!response.ok) { setStatus("error"); return; }
      const payload = (await response.json()) as { thread?: ThreadRow };
      if (!payload.thread) { setStatus("error"); return; }
      setThread(payload.thread);
      await loadMessages(payload.thread.id);
    }).catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, [worldSlug]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const offerById = useMemo(() => new Map(offers.map((offer) => [offer.id, offer])), [offers]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!thread || !text || sending) return;
    setSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ threadId: thread.id, text }),
      });
      if (response.status === 401) { setStatus("auth"); return; }
      if (!response.ok) { setStatus("error"); return; }
      const payload = (await response.json()) as { message?: MessageRow };
      if (payload.message) setMessages((current) => [...current, payload.message!]);
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  if (status === "loading") return <div className="chatStatus" role="status">Abriendo conversación…</div>;
  if (status === "auth") return <div className="consumerScreen"><div className="emptyState"><strong>Entra para escribir.</strong><p>Los mensajes quedan vinculados a tu cuenta.</p><div className="consumerActions" style={{ marginTop: 14 }}><Link className="consumerPrimary" href={`/auth?returnTo=${encodeURIComponent(`/app/messages/${worldSlug}`)}`}>Entrar</Link></div></div></div>;
  if (status === "disabled") return <div className="consumerScreen"><div className="emptyState"><strong>Mensajes todavía no están activos aquí.</strong><p>No mostramos un chat falso antes de activar persistencia, moderación y límites de uso.</p></div></div>;
  if (status === "error") return <div className="chatStatus" role="status">No pude abrir la conversación. Intenta de nuevo.</div>;

  return (
    <section className="chatScreen" aria-label={`Conversación con ${displayName}`}>
      <header className="chatHeader">
        <Link className="chatBack" href="/app/messages" aria-label="Volver a mensajes">‹</Link>
        {portrait ? <img src={portrait} alt={displayName} width="44" height="44" /> : <div className="feedAvatar" aria-hidden="true" />}
        <div className="chatIdentity"><strong>{displayName}</strong><span>Conversación privada · 18+</span></div>
        <Link className="chatMore" href={`/app/people/${worldSlug}`} aria-label="Ver perfil">•••</Link>
      </header>

      <div className="chatThread">
        <div className="chatDay">conversación</div>
        {messages.length === 0 ? <div className="chatStatus">Todavía no hay mensajes. Escribe solo si quieres iniciar una conversación real.</div> : null}
        {messages.map((message) => {
          const mine = message.sender_kind === "consumer";
          const offer = message.offer_id ? offerById.get(message.offer_id) : undefined;
          return (
            <div key={message.id}>
              {message.body ? <div className={`chatBubbleRow ${mine ? "isMine" : ""}`}><div className="chatBubble">{message.body}</div></div> : null}
              {offer ? (
                <div className="chatOffer">
                  <span className="consumerKicker">OFERTA</span>
                  <strong>{offer.title}</strong>
                  <p>{offer.description}</p>
                  <Link className="unlockButton" href={`/shop/${offer.slug}`}>Ver · {money(offer.amount_minor, offer.currency)}</Link>
                </div>
              ) : null}
            </div>
          );
        })}
        <div ref={end} />
      </div>

      <form className="chatComposer" onSubmit={send}>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={8000} rows={1} placeholder="Mensaje…" aria-label="Escribe un mensaje" />
        <button type="submit" disabled={!draft.trim() || sending} aria-label="Enviar mensaje">↑</button>
      </form>
    </section>
  );
}
