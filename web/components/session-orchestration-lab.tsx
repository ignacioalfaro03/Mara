"use client";

import { useMemo, useState } from "react";
import { sessionActionCandidates, sessionContextFixtures } from "@/data/session-orchestration";
import { rankNextActions } from "@/lib/p0/session-orchestration";

export function SessionOrchestrationLab() {
  const [contextId, setContextId] = useState(sessionContextFixtures[0].id);
  const [status, setStatus] = useState("");

  const context = useMemo(
    () => sessionContextFixtures.find((candidate) => candidate.id === contextId) ?? sessionContextFixtures[0],
    [contextId],
  );

  const decision = useMemo(() => rankNextActions(context, sessionActionCandidates), [context]);

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · SESSION ORCHESTRATION</p>
        <h1>What should Mara do next?</h1>
        <p className="livingLead">
          The same Desire OS can produce a different next action depending on session phase, consent, open loops,
          interruption cost and attention budgets. This fixture is deterministic and uses synthetic contexts only.
        </p>

        <div className="livingChoices">
          {sessionContextFixtures.map((candidate) => (
            <button
              type="button"
              className="livingChoice"
              key={candidate.id}
              aria-pressed={candidate.id === context.id}
              onClick={() => {
                setContextId(candidate.id);
                setStatus("");
              }}
            >
              <strong>{candidate.title}</strong>
              <span>{candidate.summary}</span>
            </button>
          ))}
        </div>

        <div className="lifeMoment">
          <span>CURRENT MOMENT</span>
          <p><strong>{context.title}</strong></p>
          <p>{context.summary}</p>
          <p className="livingMemory">
            phase: {context.phase} · intent: {context.currentIntent} · open loop: {context.hasRelevantOpenLoop ? "yes" : "no"} · recent offer declined: {context.recentOfferDeclined ? "yes" : "no"}
          </p>
          <p className="livingMemory">
            consent: {context.consentScopes.length ? context.consentScopes.join(" · ") : "no adult-specific scope required for this fixture"}
          </p>
        </div>

        <div className="lifeMoment">
          <span>ATTENTION BUDGETS</span>
          {Object.entries(context.budgets).map(([key, value]) => (
            <p key={key}>{key}: <strong>{value}</strong></p>
          ))}
          <p className="livingMemory">These are exposure/cooldown budgets, not psychological or arousal scores.</p>
        </div>

        <div className="premiumIntentCard">
          <span>NEXT BEST ACTION</span>
          <strong>{decision.selected.label}</strong>
          <p>{decision.selected.description}</p>
          <p className="livingMemory">score: {decision.selected.score} · {decision.selected.reasons.join(" · ") || "base fit"}</p>
          {decision.runnerUp ? (
            <p className="livingMemory">Runner-up: {decision.runnerUp.label} ({decision.runnerUp.score})</p>
          ) : null}
        </div>

        <div className="lifeMoment">
          <span>ELIGIBLE RANKING</span>
          {decision.ranked.map((candidate, index) => (
            <p key={candidate.id}>
              {index + 1}. <strong>{candidate.label}</strong> · score {candidate.score}
              {candidate.reasons.length ? ` · ${candidate.reasons.join(" · ")}` : ""}
            </p>
          ))}
        </div>

        <div className="lifeMoment">
          <span>HARD-REJECTED CANDIDATES</span>
          {decision.rejected.length ? decision.rejected.map((candidate) => (
            <p key={candidate.id}><strong>{candidate.label}</strong> · {candidate.rejectedBecause}</p>
          )) : <p>None in this fixture.</p>}
          <p className="livingMemory">Eligibility and explicit user choices beat scoring.</p>
        </div>

        <div className="correctionRow">
          <button type="button" onClick={() => setStatus("Tester marked the selected action as fitting this moment.")}>This feels right</button>
          <button type="button" onClick={() => setStatus("Correction captured qualitatively. Deterministic weights should be adjusted only after repeated evidence.")}>Wrong next move</button>
        </div>

        <p className="livingDisclosure" aria-live="polite">{status}</p>
        <p className="livingDisclosure">
          DEV only. No payment, external media, persistent adult profile, vulnerability score or autonomous orchestration is active. `No commercial action` is represented by noncommercial candidates winning the ranking.
        </p>
      </div>
    </section>
  );
}
