export type SessionPhase =
  | "entry"
  | "read_moment"
  | "play"
  | "build"
  | "surprise"
  | "optional_peak"
  | "payoff"
  | "normalize"
  | "open_loop"
  | "close";

export type AttentionBudgetState = "available" | "cooling_down" | "exhausted";

export type AttentionBudgetKey =
  | "commercial"
  | "high_intensity"
  | "v3_voice"
  | "ritual"
  | "external_media"
  | "callback"
  | "capricho";

export type AttentionBudgets = Record<AttentionBudgetKey, AttentionBudgetState>;

export type SessionActionId =
  | "talk"
  | "ask"
  | "tease"
  | "voice"
  | "ritual"
  | "external_media"
  | "capricho"
  | "paid_continuation"
  | "normalize"
  | "open_loop";

export type SessionContextFixture = {
  id: string;
  title: string;
  summary: string;
  phase: SessionPhase;
  currentIntent: string;
  consentScopes: string[];
  budgets: AttentionBudgets;
  hasRelevantOpenLoop: boolean;
  recentOfferDeclined: boolean;
  wantsMaraSpecifically: boolean;
  commercialCandidateAvailable: boolean;
};

export type SessionActionCandidate = {
  id: SessionActionId;
  label: string;
  description: string;
  baseScore: number;
  phaseFit: Partial<Record<SessionPhase, number>>;
  intentTags: string[];
  requiredConsent?: string[];
  budgetKey?: AttentionBudgetKey;
  commercial?: boolean;
  highIntensity?: boolean;
  requiresOpenLoop?: boolean;
  externalHandoff?: boolean;
};

export type RankedAction = SessionActionCandidate & {
  score: number;
  reasons: string[];
};

export type RejectedAction = SessionActionCandidate & {
  rejectedBecause: string;
};

export type OrchestrationDecision = {
  selected: RankedAction;
  runnerUp?: RankedAction;
  ranked: RankedAction[];
  rejected: RejectedAction[];
};

function budgetPenalty(state: AttentionBudgetState) {
  if (state === "available") return 0;
  if (state === "cooling_down") return 4;
  return 8;
}

export function rankNextActions(
  context: SessionContextFixture,
  candidates: SessionActionCandidate[],
): OrchestrationDecision {
  const ranked: RankedAction[] = [];
  const rejected: RejectedAction[] = [];

  for (const candidate of candidates) {
    const requiredConsent = candidate.requiredConsent ?? [];
    const missingConsent = requiredConsent.find((scope) => !context.consentScopes.includes(scope));

    if (missingConsent) {
      rejected.push({ ...candidate, rejectedBecause: `missing consent: ${missingConsent}` });
      continue;
    }

    if (candidate.commercial && !context.commercialCandidateAvailable) {
      rejected.push({ ...candidate, rejectedBecause: "no relevant commercial candidate" });
      continue;
    }

    if (candidate.commercial && context.recentOfferDeclined) {
      rejected.push({ ...candidate, rejectedBecause: "user just declined an offer" });
      continue;
    }

    if (candidate.externalHandoff && context.wantsMaraSpecifically) {
      rejected.push({ ...candidate, rejectedBecause: "user wants Mara specifically; outbound handoff has high interruption cost" });
      continue;
    }

    if (candidate.requiresOpenLoop && !context.hasRelevantOpenLoop) {
      rejected.push({ ...candidate, rejectedBecause: "no relevant open loop" });
      continue;
    }

    if (candidate.budgetKey && context.budgets[candidate.budgetKey] === "exhausted") {
      rejected.push({ ...candidate, rejectedBecause: `${candidate.budgetKey} attention budget exhausted` });
      continue;
    }

    if (candidate.highIntensity && context.budgets.high_intensity !== "available") {
      rejected.push({ ...candidate, rejectedBecause: "high-intensity budget is cooling down" });
      continue;
    }

    let score = candidate.baseScore;
    const reasons: string[] = [];

    const phaseScore = candidate.phaseFit[context.phase] ?? 0;
    score += phaseScore;
    if (phaseScore > 0) reasons.push(`fits ${context.phase} phase`);

    if (candidate.intentTags.includes(context.currentIntent)) {
      score += 4;
      reasons.push("fits current explicit intent");
    }

    if (candidate.budgetKey) {
      const penalty = budgetPenalty(context.budgets[candidate.budgetKey]);
      score -= penalty;
      if (penalty > 0) reasons.push(`${candidate.budgetKey} budget penalty`);
    }

    if (candidate.commercial) {
      score -= budgetPenalty(context.budgets.commercial);
      if (context.phase === "normalize" || context.phase === "payoff") {
        score -= 5;
        reasons.push("commercial interruption cost after payoff/peak");
      }
    }

    if (candidate.id === "normalize" && context.phase === "normalize") {
      score += 7;
      reasons.push("peak → recovery → continuity");
    }

    if (candidate.id === "open_loop" && context.hasRelevantOpenLoop) {
      score += 4;
      reasons.push("relevant unresolved continuity");
    }

    if (candidate.externalHandoff && context.phase === "surprise") {
      score += 3;
      reasons.push("exploration phase can support curated handoff");
    }

    ranked.push({ ...candidate, score, reasons });
  }

  ranked.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const selected = ranked[0];
  if (!selected) throw new Error(`No eligible session action for context ${context.id}`);

  return {
    selected,
    runnerUp: ranked[1],
    ranked,
    rejected,
  };
}
