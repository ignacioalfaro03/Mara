"use client";

import { useState } from "react";
import { ritualFixtures } from "@/data/rituals";
import { track } from "@/lib/analytics";
import {
  writeP0RitualSession,
  type RitualRewardStyle,
} from "@/lib/p0/rituals";

export function RitualsLab() {
  const [selectedId, setSelectedId] = useState("R01");
  const [reward, setReward] = useState<RitualRewardStyle | null>(null);
  const [status, setStatus] = useState("");

  const ritual = ritualFixtures.find((candidate) => candidate.id === selectedId) ?? ritualFixtures[0];

  function chooseRitual(id: string) {
    setSelectedId(id);
    setReward(null);
    track("ritual_viewed", { ritual_id: id, prototype_only: true });
    setStatus("DEV ritual selected. No real instruction or media generated.");
  }

  function playIntent() {
    writeP0RitualSession({ ritualId: ritual.id, playIntent: true, completed: false, skipped: false, rewardPreference: reward });
    track("ritual_play_intent", { ritual_id: ritual.id, prototype_only: true });
    setStatus("Play intent recorded. This is not completion, payment or consent to another ritual family.");
  }

  function completeSimulation() {
    writeP0RitualSession({ ritualId: ritual.id, playIntent: true, completed: true, skipped: false, rewardPreference: reward });
    track("ritual_completed_simulated", { ritual_id: ritual.id, prototype_only: true });
    setStatus("DEV completion simulated. The reward can change the game; it never changes Mara's baseline relationship.");
  }

  function skip() {
    writeP0RitualSession({ ritualId: ritual.id, playIntent: false, completed: false, skipped: true, rewardPreference: reward });
    track("ritual_skipped", { ritual_id: ritual.id, prototype_only: true });
    setStatus("Skipped with no relationship or commercial penalty.");
  }

  function chooseReward(next: RitualRewardStyle) {
    setReward(next);
    track("ritual_reward_preference", { ritual_id: ritual.id, reward_style: next, prototype_only: true });
  }

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · PLAYABLE RITUALS LAB</p>
        <h1>Sometimes Mara gives you something to do.</h1>
        <p className="livingLead">
          This lab tests participation, anticipation and reward without generating explicit adult media or real sexual instructions.
        </p>

        <div className="livingChoices">
          {ritualFixtures.map((candidate) => (
            <button
              type="button"
              className="livingChoice"
              key={candidate.id}
              aria-pressed={candidate.id === ritual.id}
              onClick={() => chooseRitual(candidate.id)}
            >
              <strong>{candidate.id} · {candidate.title}</strong>
              <span>{candidate.description}</span>
            </button>
          ))}
        </div>

        <div className="premiumIntentCard">
          <span>{ritual.adultRequired ? "ADULT OPT-IN FIXTURE" : "GENERAL PLAY FIXTURE"}</span>
          <strong>{ritual.maraLine}</strong>
          <p>Intensity: {ritual.intensity} · cadence: {ritual.repeatWindow}</p>
        </div>

        <div className="lifeMoment">
          <span>IF YOU PLAY, WHAT PAYOFF FEELS BEST?</span>
          <div className="correctionRow">
            {ritual.rewardOptions.map((option) => (
              <button
                type="button"
                key={option}
                aria-pressed={reward === option}
                onClick={() => chooseReward(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="correctionRow">
          <button type="button" onClick={playIntent}>I would play</button>
          <button type="button" onClick={completeSimulation}>Simulate completion</button>
          <button type="button" onClick={skip}>Skip</button>
        </div>

        <p className="livingDisclosure" aria-live="polite">{status}</p>
        <p className="livingDisclosure">
          DEV only. Failure/skip has no relationship penalty. Adult rituals require separate eligibility/consent. No arousal or compliance data is used for pricing.
        </p>
      </div>
    </section>
  );
}
