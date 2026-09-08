export type DemandStage =
  | "IDEA"
  | "RISING"
  | "VALIDATED"
  | "HOST_WANTED"
  | "HOST_PROPOSALS"
  | "UNLOCKED"
  | "BOOKING"
  | "HAPPENING"
  | "COMPLETED"
  | "MEMORY";

export type DemandFulfillmentType =
  | "DIGITAL_PRODUCT"
  | "DIGITAL_EXPERIENCE"
  | "MEMBERSHIP"
  | "COLLAB"
  | "MERCH"
  | "PHYSICAL_EXPERIENCE"
  | "HYBRID";

export type DemandOrigin = "COMMUNITY" | "CREATOR" | "HOST";
export type HostStatus = "NONE" | "WANTED" | "INTERESTED" | "PROPOSALS" | "SELECTED";
export type PrivacyMode = "PUBLIC" | "PSEUDONYMOUS" | "PRIVATE";

export type WtpBucket = {
  amountMinor: number;
  count: number;
};

export type DemandIdea = {
  id: string;
  title: string;
  city: string;
  category: string;
  description: string;
  creatorLabel: string | null;
  worldLabel: string | null;
  origin: DemandOrigin;
  fulfillmentType: DemandFulfillmentType;
  privacyMode: PrivacyMode;
  stage: DemandStage;
  interestedCount: number;
  pledgedCount: number;
  committedCount: number;
  targetCommitments: number;
  capacityTarget: number | null;
  hostStatus: HostStatus;
  wtpBuckets: WtpBucket[];
  tags: string[];
};

export type DemandMetrics = {
  averageWtpMinor: number;
  interestGmvMinor: number;
  pledgedGmvMinor: number;
  verifiedDemandGmvMinor: number;
  progressPercent: number;
};

export type SimilarDemandMatch = {
  idea: DemandIdea;
  score: number;
};

export const wtpOptionsMinor = [5_000_00, 8_000_00, 12_000_00, 20_000_00, 35_000_00, 50_000_00, 80_000_00];

export const seededDemandIdeas: DemandIdea[] = [
  {
    id: "mara-audio-collection-online",
    title: "Mara Audio Collection: Community Cut",
    city: "Online",
    category: "Creator content",
    description: "La comunidad pide una colección digital producida una vez y desbloqueada por demanda agregada.",
    creatorLabel: "Mara Vera",
    worldLabel: "Mara World",
    origin: "COMMUNITY",
    fulfillmentType: "DIGITAL_PRODUCT",
    privacyMode: "PSEUDONYMOUS",
    stage: "RISING",
    interestedCount: 264,
    pledgedCount: 148,
    committedCount: 96,
    targetCommitments: 120,
    capacityTarget: null,
    hostStatus: "NONE",
    wtpBuckets: [
      { amountMinor: 5_000_00, count: 48 },
      { amountMinor: 8_000_00, count: 62 },
      { amountMinor: 12_000_00, count: 28 },
      { amountMinor: 20_000_00, count: 10 },
    ],
    tags: ["mara", "audio", "collection", "digital", "creator"],
  },
  {
    id: "mara-inner-circle-online",
    title: "Mara Inner Circle — Founding Cohort",
    city: "Online",
    category: "Membership",
    description: "Demanda por una membresía limitada con prioridad, votaciones, drops y reconocimiento dentro del World.",
    creatorLabel: "Mara Vera",
    worldLabel: "Mara World",
    origin: "COMMUNITY",
    fulfillmentType: "MEMBERSHIP",
    privacyMode: "PRIVATE",
    stage: "VALIDATED",
    interestedCount: 181,
    pledgedCount: 103,
    committedCount: 79,
    targetCommitments: 90,
    capacityTarget: 150,
    hostStatus: "NONE",
    wtpBuckets: [
      { amountMinor: 8_000_00, count: 29 },
      { amountMinor: 12_000_00, count: 41 },
      { amountMinor: 20_000_00, count: 25 },
      { amountMinor: 35_000_00, count: 8 },
    ],
    tags: ["mara", "inner", "circle", "membership", "private"],
  },
  {
    id: "mara-masked-night-chillan",
    title: "Mara Masked Night",
    city: "Chillán",
    category: "Community IRL",
    description: "Una noche de máscaras y universo Mara activada por demanda local, con privacidad como parte central del formato.",
    creatorLabel: "Mara Vera",
    worldLabel: "Mara World",
    origin: "COMMUNITY",
    fulfillmentType: "PHYSICAL_EXPERIENCE",
    privacyMode: "PSEUDONYMOUS",
    stage: "HOST_WANTED",
    interestedCount: 186,
    pledgedCount: 118,
    committedCount: 72,
    targetCommitments: 88,
    capacityTarget: 180,
    hostStatus: "WANTED",
    wtpBuckets: [
      { amountMinor: 20_000_00, count: 39 },
      { amountMinor: 35_000_00, count: 43 },
      { amountMinor: 50_000_00, count: 26 },
      { amountMinor: 80_000_00, count: 10 },
    ],
    tags: ["mara", "masked", "party", "fiesta", "night", "privacy"],
  },
  {
    id: "creator-collab-online",
    title: "Mara × Creator Pilot — Community Collab",
    city: "Online",
    category: "Collaboration",
    description: "Los usuarios piden una colaboración entre Worlds antes de que ambas Creator decidan producirla.",
    creatorLabel: "Mara Vera + Creator Pilot",
    worldLabel: "Cross-World",
    origin: "COMMUNITY",
    fulfillmentType: "COLLAB",
    privacyMode: "PUBLIC",
    stage: "UNLOCKED",
    interestedCount: 319,
    pledgedCount: 176,
    committedCount: 132,
    targetCommitments: 120,
    capacityTarget: null,
    hostStatus: "SELECTED",
    wtpBuckets: [
      { amountMinor: 5_000_00, count: 42 },
      { amountMinor: 8_000_00, count: 69 },
      { amountMinor: 12_000_00, count: 47 },
      { amountMinor: 20_000_00, count: 18 },
    ],
    tags: ["mara", "creator", "collab", "cross", "world", "digital"],
  },
  {
    id: "rooftop-dinner-santiago",
    title: "Rooftop Dinner After Dark",
    city: "Santiago",
    category: "Community",
    description: "Demanda comunitaria para una cena nocturna. Demuestra que el engine también puede funcionar sin Creator.",
    creatorLabel: null,
    worldLabel: "Community Demand",
    origin: "COMMUNITY",
    fulfillmentType: "PHYSICAL_EXPERIENCE",
    privacyMode: "PUBLIC",
    stage: "VALIDATED",
    interestedCount: 128,
    pledgedCount: 82,
    committedCount: 58,
    targetCommitments: 70,
    capacityTarget: 90,
    hostStatus: "INTERESTED",
    wtpBuckets: [
      { amountMinor: 35_000_00, count: 21 },
      { amountMinor: 50_000_00, count: 33 },
      { amountMinor: 80_000_00, count: 28 },
    ],
    tags: ["dinner", "rooftop", "food", "social", "night"],
  },
];

export function weightedAverageWtpMinor(idea: Pick<DemandIdea, "wtpBuckets">): number {
  const totalCount = idea.wtpBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
  if (totalCount === 0) return 0;

  const weighted = idea.wtpBuckets.reduce(
    (sum, bucket) => sum + bucket.amountMinor * bucket.count,
    0,
  );

  return Math.round(weighted / totalCount);
}

export function calculateDemandMetrics(idea: DemandIdea): DemandMetrics {
  const averageWtpMinor = weightedAverageWtpMinor(idea);
  const target = Math.max(idea.targetCommitments, 1);

  return {
    averageWtpMinor,
    interestGmvMinor: averageWtpMinor * idea.interestedCount,
    pledgedGmvMinor: averageWtpMinor * idea.pledgedCount,
    verifiedDemandGmvMinor: averageWtpMinor * idea.committedCount,
    progressPercent: Math.min(100, Math.round((idea.committedCount / target) * 100)),
  };
}

export function aggregateDemandMarketplace(ideas: DemandIdea[]) {
  return ideas.reduce(
    (summary, idea) => {
      const metrics = calculateDemandMetrics(idea);
      summary.interested += idea.interestedCount;
      summary.pledged += idea.pledgedCount;
      summary.committed += idea.committedCount;
      summary.interestGmvMinor += metrics.interestGmvMinor;
      summary.pledgedGmvMinor += metrics.pledgedGmvMinor;
      summary.verifiedDemandGmvMinor += metrics.verifiedDemandGmvMinor;
      if (idea.stage === "HOST_WANTED") summary.hostWanted += 1;
      return summary;
    },
    {
      interested: 0,
      pledged: 0,
      committed: 0,
      interestGmvMinor: 0,
      pledgedGmvMinor: 0,
      verifiedDemandGmvMinor: 0,
      hostWanted: 0,
    },
  );
}

const stopWords = new Set([
  "de",
  "del",
  "la",
  "el",
  "en",
  "una",
  "un",
  "con",
  "the",
  "a",
  "and",
]);

const synonymMap: Record<string, string> = {
  fiesta: "party",
  party: "party",
  noche: "night",
  night: "night",
  mascara: "masked",
  mascaras: "masked",
  masked: "masked",
  rooftop: "rooftop",
  terraza: "rooftop",
  audio: "audio",
  audios: "audio",
  membresia: "membership",
  membership: "membership",
  colaboracion: "collab",
  collaboration: "collab",
  collab: "collab",
};

function normalizeTokens(input: string): string[] {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !stopWords.has(token))
    .map((token) => synonymMap[token] ?? token);
}

export function demandSimilarityScore(title: string, city: string, idea: DemandIdea): number {
  if (city.trim().toLowerCase() !== idea.city.trim().toLowerCase()) return 0;

  const proposed = new Set(normalizeTokens(title));
  const existing = new Set([
    ...normalizeTokens(idea.title),
    ...idea.tags.map((tag) => synonymMap[tag] ?? tag),
  ]);

  if (proposed.size === 0 || existing.size === 0) return 0;

  let overlap = 0;
  for (const token of proposed) {
    if (existing.has(token)) overlap += 1;
  }

  return overlap / Math.max(1, Math.min(proposed.size, existing.size));
}

export function findSimilarDemand(
  title: string,
  city: string,
  ideas: DemandIdea[],
): SimilarDemandMatch | null {
  const matches = ideas
    .map((idea) => ({ idea, score: demandSimilarityScore(title, city, idea) }))
    .filter((candidate) => candidate.score >= 0.5)
    .sort((a, b) => b.score - a.score);

  return matches.length > 0 ? matches[0] : null;
}

export function formatClp(minor: number): string {
  const pesos = Math.round(minor / 100);
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(pesos);
}

export function stageLabel(stage: DemandStage): string {
  return stage.replaceAll("_", " ");
}

export function fulfillmentLabel(type: DemandFulfillmentType): string {
  return type.replaceAll("_", " ");
}

export function isPhysicalDemand(type: DemandFulfillmentType): boolean {
  return type === "PHYSICAL_EXPERIENCE" || type === "HYBRID";
}
