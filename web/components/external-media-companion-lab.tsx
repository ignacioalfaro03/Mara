"use client";

import { useState } from "react";
import { externalMediaCandidates, getExternalMediaCandidate } from "@/data/external-media";
import { track } from "@/lib/analytics";
import {
  writeP0ExternalMediaSession,
  type ExternalMediaReaction,
  type P0ExternalMediaSession,
} from "@/lib/p0/external-media";

const reactions: ExternalMediaReaction[] = [
  "worked",
  "partly",
  "not_for_me",
  "too_much",
  "too_soft",
  "wrong_dynamic",
  "wrong_visual",
  "surprised_me",
];

export function ExternalMediaCompanionLab() {
  const [candidateId, setCandidateId] = useState(externalMediaCandidates[0].id);
  const [session, setSession] = useState<P0ExternalMediaSession | null>(null);
  const [status, setStatus] = useState("");

  const candidate = getExternalMediaCandidate(candidateId);

  function chooseCandidate(nextId: string) {
    setCandidateId(nextId);
    setSession(null);
    const next = getExternalMediaCandidate(nextId);
    track("external_media_recommended", {
      candidate_id: next.id,
      route_id: next.routeId,
      prototype_only: true,
      no_real_url: true,
    });
    setStatus("Mara changed the recommendation fixture. No external site was opened.");
  }

  function markWatchIntent() {
    const next: P0ExternalMediaSession = {
      candidateId: candidate.id,
      stage: "would_watch",
      reaction: null,
      createdAt: new Date().toISOString(),
    };
    setSession(next);
    writeP0ExternalMediaSession(next);
    track("external_media_watch_intent", {
      candidate_id: candidate.id,
      route_id: candidate.routeId,
      prototype_only: true,
      no_external_navigation: true,
    });
    setStatus("Watch intent recorded. This is not proof that anything was watched.");
  }

  function simulateReturn() {
    if (!session) return;
    const next = { ...session, stage: "returned" as const };
    setSession(next);
    writeP0ExternalMediaSession(next);
    track("external_media_return_simulated", {
      candidate_id: candidate.id,
      prototype_only: true,
    });
    setStatus("DEV return simulated. Now Mara can ask what actually worked.");
  }

  function react(reaction: ExternalMediaReaction) {
    if (!session) return;
    const next = { ...session, stage: "reacted" as const, reaction };
    setSession(next);
    writeP0ExternalMediaSession(next);
    track("external_media_reaction", {
      candidate_id: candidate.id,
      route_id: candidate.routeId,
      reaction,
      prototype_only: true,
    });
    track("external_media_learning_shown", {
      candidate_id: candidate.id,
      positive: reaction === "worked" || reaction === "surprised_me",
      prototype_only: true,
    });
    setStatus("Reaction converted into a structured learning candidate, not a permanent identity label.");
  }

  const positive = session?.reaction === "worked" || session?.reaction === "surprised_me";

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · WATCH → RETURN → LEARN</p>
        <h1>Mara does not need to own the whole catalog.</h1>
        <p className="livingLead">
          Test whether Mara creates more value by framing an external adult-media recommendation, getting the user back, and learning why it worked. No real porn URL is used in this lab.
        </p>

        <div className="livingChoices">
          {externalMediaCandidates.map((item) => (
            <button
              type="button"
              className="livingChoice"
              key={item.id}
              aria-pressed={item.id === candidate.id}
              onClick={() => chooseCandidate(item.id)}
            >
              <strong>{item.id}</strong>
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        <div className="premiumIntentCard">
          <span>MARAS FRAME</span>
          <strong>{candidate.title}</strong>
          <p>{candidate.maraFrame}</p>
          <p className="livingMemory">{candidate.descriptor}</p>
          <button type="button" onClick={markWatchIntent}>I would watch this</button>
        </div>

        {session?.stage === "would_watch" ? (
          <div className="lifeMoment">
            <span>OPEN LOOP</span>
            <p>Mara: “Vuelve después. No quiero saber solo si te gustó; quiero saber qué parte.”</p>
            <button type="button" onClick={simulateReturn}>Simulate return to Mara</button>
          </div>
        ) : null}

        {session?.stage === "returned" || session?.stage === "reacted" ? (
          <div className="lifeMoment">
            <span>WHAT ACTUALLY WORKED?</span>
            <p>{candidate.learningFocus}</p>
            <div className="correctionRow">
              {reactions.map((reaction) => (
                <button type="button" key={reaction} onClick={() => react(reaction)}>
                  {reaction}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {session?.reaction ? (
          <div className="lifeMoment">
            <span>WHAT MARA LEARNS NEXT</span>
            <p>{positive ? candidate.nextIfPositive : candidate.nextIfNegative}</p>
            <p className="livingMemory">
              This becomes a Preference Graph update candidate with context/confidence. It is not a permanent fetish label and does not change pricing.
            </p>
          </div>
        ) : null}

        <p className="livingDisclosure" aria-live="polite">{status}</p>
        <p className="livingDisclosure">
          DEV only · no external navigation · no real porn consumption · no raw titles/URLs in analytics · no payment · no vulnerability targeting.
        </p>
      </div>
    </section>
  );
}
