"use client";

import { useEffect, useMemo, useState } from "react";
import { caprichos, getCapricho } from "@/data/caprichos";
import { track } from "@/lib/analytics";
import {
  caprichoProgressPercent,
  formatUsdCents,
  readP0CaprichoParticipation,
  writeP0CaprichoParticipation,
  type AmountVisibility,
  type ContributionIdentityMode,
  type P0CaprichoParticipation,
} from "@/lib/p0/caprichos";

const AMOUNT_PRESETS = [500, 1000, 2500] as const;

export function CaprichosLab() {
  const [selectedGoalId, setSelectedGoalId] = useState(caprichos[0].id);
  const [identityMode, setIdentityMode] = useState<ContributionIdentityMode>("anonymous");
  const [amountVisibility, setAmountVisibility] = useState<AmountVisibility>("hidden");
  const [alias, setAlias] = useState("Ghost27");
  const [amountCents, setAmountCents] = useState<number>(1000);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [participations, setParticipations] = useState<P0CaprichoParticipation[]>([]);
  const [completedGoalId, setCompletedGoalId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [status, setStatus] = useState("");

  const selectedGoal = getCapricho(selectedGoalId);
  const activeGoal = selectedGoal;
  const progress = caprichoProgressPercent(activeGoal);
  const myParticipation = useMemo(
    () => participations.find((item) => item.caprichoId === activeGoal.id) ?? null,
    [activeGoal.id, participations],
  );

  useEffect(() => {
    setParticipations(readP0CaprichoParticipation());
  }, []);

  useEffect(() => {
    track("capricho_viewed", {
      capricho_id: activeGoal.id,
      category: activeGoal.category,
      physical: activeGoal.physical,
    });
    track("goal_progress_viewed", {
      capricho_id: activeGoal.id,
      prototype_percent: progress,
      prototype_only: true,
    });
    setTeamId(null);
    setCompletedGoalId(null);
    setStatus("");
  }, [activeGoal.category, activeGoal.id, activeGoal.physical, progress]);

  function chooseIdentity(next: ContributionIdentityMode) {
    setIdentityMode(next);
    track("alias_visibility_selected", {
      capricho_id: activeGoal.id,
      mode: next,
    });
  }

  function chooseAmountVisibility(next: AmountVisibility) {
    setAmountVisibility(next);
    track("amount_visibility_selected", {
      capricho_id: activeGoal.id,
      visibility: next,
    });
  }

  function chooseAmount(next: number) {
    setAmountCents(next);
    track("contribution_amount_selected", {
      capricho_id: activeGoal.id,
      amount_cents: next,
      prototype_only: true,
    });
  }

  function chooseTeam(next: string) {
    setTeamId(next);
    track("team_selected", {
      capricho_id: activeGoal.id,
      team_id: next,
      prototype_only: true,
    });
    track("vote_cast", {
      capricho_id: activeGoal.id,
      vote_id: next,
      prototype_only: true,
    });
  }

  function recordContributionIntent() {
    const cleanAlias = identityMode === "alias" ? alias.trim().slice(0, 24) : null;
    const participation: P0CaprichoParticipation = {
      caprichoId: activeGoal.id,
      amountCents,
      identityMode,
      alias: cleanAlias || null,
      amountVisibility,
      teamId,
      createdAt: new Date().toISOString(),
    };

    const next = [...participations.filter((item) => item.caprichoId !== activeGoal.id), participation];
    setParticipations(next);
    writeP0CaprichoParticipation(next);

    track("contribution_intent", {
      capricho_id: activeGoal.id,
      amount_cents: amountCents,
      identity_mode: identityMode,
      amount_visibility: amountVisibility,
      team_selected: Boolean(teamId),
      prototype_only: true,
      no_charge: true,
    });

    setStatus("Intención registrada. No se cobró ni se movió el progreso público DEV.");
  }

  function simulateCompletion() {
    setCompletedGoalId(activeGoal.id);
    track("goal_completion_simulated", {
      capricho_id: activeGoal.id,
      world_asset_id: activeGoal.worldAssetId,
      prototype_only: true,
      no_money: true,
    });
    track("world_asset_reveal_viewed", {
      capricho_id: activeGoal.id,
      world_asset_id: activeGoal.worldAssetId,
      simulated_status: "canonical",
      prototype_only: true,
    });
    setStatus("DEV simulation: goal → fulfilled → canonical World Asset. No dinero ni compra real.");
  }

  function openHistory() {
    setHistoryOpen(true);
    track("contributor_history_viewed", {
      participation_count: participations.length,
      prototype_only: true,
    });
  }

  function shareIntent() {
    track("goal_share_intent", {
      capricho_id: activeGoal.id,
      prototype_only: true,
    });
    setStatus("Share intent registrado. No se publicó ni compartió nada.");
  }

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · CAPRICHOS DE MARA</p>
        <h1>Ayuda a cambiar su mundo. Sin exponer el tuyo.</h1>
        <p className="livingLead">
          P0 privado: progreso, contribuciones y assets son datos de prueba. No existe checkout, cobro, crowdfunding ni adquisición real.
        </p>

        <div className="livingChoices">
          {caprichos.map((goal) => (
            <button
              type="button"
              className="livingChoice"
              key={goal.id}
              aria-pressed={goal.id === activeGoal.id}
              onClick={() => setSelectedGoalId(goal.id)}
            >
              <strong>{goal.title}</strong>
              <span>{goal.maraLine}</span>
            </button>
          ))}
        </div>

        <div className="premiumIntentCard">
          <span>DEV PROTOTYPE PROGRESS · NOT REAL MONEY</span>
          <strong>{activeGoal.title}</strong>
          <p>{activeGoal.maraLine}</p>
          <p>
            {formatUsdCents(activeGoal.prototypeFundedCents)} / {formatUsdCents(activeGoal.targetCents)} · {progress}% · {activeGoal.prototypeContributorCount} prototype contributors
          </p>
          <p className="livingMemory">
            100% would hard-close future real contributions. In this lab the counter never changes from an intent click.
          </p>
          {activeGoal.companyCofundCents ? (
            <p className="livingMemory">
              Big Goal concept: community target {formatUsdCents(activeGoal.targetCents)} + company co-fund {formatUsdCents(activeGoal.companyCofundCents)}. DEV only.
            </p>
          ) : null}
        </div>

        {activeGoal.teams ? (
          <div className="lifeMoment">
            <span>PRIVATE TEAM RACE · ONE TESTER = ONE VOTE</span>
            {activeGoal.teams.map((team) => (
              <button type="button" key={team.id} onClick={() => chooseTeam(team.id)} aria-pressed={teamId === team.id}>
                {team.label} · {formatUsdCents(team.prototypeFundedCents)} prototype aggregate
              </button>
            ))}
            <p className="livingMemory">Your team choice is local to this DEV session. No spend-weighted vote.</p>
          </div>
        ) : null}

        <div className="lifeMoment">
          <span>HOW WOULD YOU APPEAR?</span>
          <div className="correctionRow">
            <button type="button" onClick={() => chooseIdentity("anonymous")} aria-pressed={identityMode === "anonymous"}>
              Anonymous
            </button>
            <button type="button" onClick={() => chooseIdentity("alias")} aria-pressed={identityMode === "alias"}>
              Alias
            </button>
          </div>
          {identityMode === "alias" ? (
            <label className="livingMemory">
              Mara alias
              <input value={alias} maxLength={24} onChange={(event) => setAlias(event.target.value)} />
            </label>
          ) : null}
          <div className="correctionRow">
            <button type="button" onClick={() => chooseAmountVisibility("hidden")} aria-pressed={amountVisibility === "hidden"}>
              Hide amount
            </button>
            <button type="button" onClick={() => chooseAmountVisibility("public")} aria-pressed={amountVisibility === "public"}>
              Show amount by choice
            </button>
          </div>
          <p className="livingMemory">Legal identity, email, payment data and private Mara preferences are never public community fields.</p>
        </div>

        <div className="lifeMoment">
          <span>HYPOTHETICAL CONTRIBUTION · NO CHARGE</span>
          <div className="correctionRow">
            {AMOUNT_PRESETS.map((preset) => (
              <button type="button" key={preset} onClick={() => chooseAmount(preset)} aria-pressed={amountCents === preset}>
                {formatUsdCents(preset)}
              </button>
            ))}
          </div>
          <button type="button" onClick={recordContributionIntent}>I would contribute</button>
          {myParticipation ? (
            <p className="livingMemory">You marked intent for this Goal. That is not a payment, pledge, entitlement or revenue event.</p>
          ) : null}
        </div>

        <div className="lifeMoment">
          <span>WORLD ASSET CONSEQUENCE</span>
          <p>
            If a future real Goal were fulfilled under its frozen contract: funding closes → cleared-funds gate → acquisition/production → reveal → {activeGoal.worldAssetId} enters Mara canon.
          </p>
          <button type="button" onClick={simulateCompletion}>Simulate 100% → World Asset (DEV)</button>
          {completedGoalId === activeGoal.id ? (
            <div>
              <p><strong>DEV CANONICALIZED · {activeGoal.worldAssetId}</strong></p>
              <p>{activeGoal.contributorPayoff}</p>
              {myParticipation ? <p>“Tú tuviste algo que ver con esto.”</p> : null}
              <p className="livingMemory">Future Fantasy eligibility: {activeGoal.fantasyEligible ? "yes" : "not directly"}.</p>
            </div>
          ) : null}
        </div>

        <div className="livingActions">
          <button type="button" onClick={openHistory}>My History prototype</button>
          <button type="button" onClick={shareIntent}>Share Goal intent</button>
        </div>

        {historyOpen ? (
          <div className="lifeMoment">
            <span>PRIVATE · MY HISTORY WITH MARA</span>
            {participations.length === 0 ? (
              <p>No Capricho participation intent in this DEV session.</p>
            ) : (
              participations.map((item) => (
                <p key={item.caprichoId}>
                  You helped test: {getCapricho(item.caprichoId).title} · {item.identityMode === "alias" && item.alias ? item.alias : "anonymous"}
                </p>
              ))
            )}
          </div>
        ) : null}

        {status ? <p className="livingDisclosure" aria-live="polite">{status}</p> : null}
        <p className="livingDisclosure">
          No fake contributors, no fake public progress, no real scarcity, no payment, no raffle and no promise of fractional ownership. P0 tests comprehension, privacy, agency and desire only.
        </p>
      </div>
    </section>
  );
}
