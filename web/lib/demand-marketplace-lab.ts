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

export type ExperienceType = "PHYSICAL" | "DIGITAL" | "HYBRID";
export type DemandOrigin = "COMMUNITY" | "CREATOR" | "HOST";
export type HostStatus = "NONE" | "WANTED" | "INTERESTED" | "PROPOSALS" | "SELECTED";

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
  origin: DemandOrigin;
  experienceType: ExperienceType;
  stage: DemandStage;
  interestedCount: number;
  committedCount: number;
  targetCommitments: number;
  capacityTarget: number;
  hostStatus: HostStatus;
  wtpBuckets: WtpBucket[];
  tags: string[];
};

export type DemandMetrics = {
  averageWtpMinor: number;
  interestGmvMinor: number;
  verifiedDemandGmvMinor: number;
  progressPercent: number;
};

export type SimilarDemandMatch = {
  idea: DemandIdea;
  score: number;
};

export const wtpOptionsMinor = [15_000_00, 25_000_00, 35_000_00, 50_000_00];

export const seededDemandIdeas: DemandIdea[] = [
  {
    id: "mara-masked-night-chillan",
    title: "Mara Masked Night",
    city: "Chillán",
    category: "Nightlife",
    description: "Una noche de máscaras, música y universo Mara activada por demanda local.",
    creatorLabel: "Mara Vera",
    origin: "COMMUNITY",
    experienceType: "PHYSICAL",
    stage: "HOST_WANTED",
    interestedCount: 186,
    committedCount: 72,
    targetCommitments: 88,
    capacityTarget: 180,
    hostStatus: "WANTED",
    wtpBuckets: [
      { amountMinor: 20_000_00, count: 39 },
      { amountMinor: 25_000_00, count: 71 },
      { amountMinor: 35_000_00, count: 54 },
      { amountMinor: 50_000_00, count: 22 },
    ],
    tags: ["mara", "masked", "party", "fiesta", "night"],
  },
  {
    id: "karaoke-mara-concepcion",
    title: "Karaoke Mara",
    city: "Concepción",
    category: "Social",
    description: "Karaoke de comunidad con una capa Mara, grupos pequeños y final colectivo.",
    creatorLabel: "Mara Vera",
    origin: "COMMUNITY",
    experienceType: "PHYSICAL",
    stage: "RISING",
    interestedCount: 91,
    committedCount: 27,
    targetCommitments: 60,
    capacityTarget: 100,
    hostStatus: "NONE",
    wtpBuckets: [
      { amountMinor: 12_000_00, count: 20 },
      { amountMinor: 18_000_00, count: 39 },
      { amountMinor: 25_000_00, count: 24 },
      { amountMinor: 35_000_00, count: 8 },
    ],
    tags: ["mara", "karaoke", "music", "social"],
  },
  {
    id: "rooftop-dinner-santiago",
    title: "Rooftop Dinner After Dark",
    city: "Santiago",
    category: "Food & social",
    description: "Cena nocturna en rooftop para conocer gente nueva. No requiere Creator.",
    creatorLabel: null,
    origin: "COMMUNITY",
    experienceType: "PHYSICAL",
    stage: "VALIDATED",
    interestedCount: 128,
    committedCount: 58,
    targetCommitments: 70,
    capacityTarget: 90,
    hostStatus: "INTERESTED",
    wtpBuckets: [
      { amountMinor: 30_000_00, count: 29 },
      { amountMinor: 45_000_00, count: 47 },
      { amountMinor: 60_000_00, count: 38 },
      { amountMinor: 80_000_00, count: 14 },
    ],
    tags: ["dinner", "rooftop", "food", "social", "night"],
  },
  {
    id: "creator-room-digital",
    title: "Creator Room: Build It With Us",
    city: "Online",
    category: "Creator",
    description: "Sesión digital limitada donde la comunidad decide el próximo concepto junto a una Creator.",
    creatorLabel: "Creator Pilot",
    origin: "CREATOR",
    experienceType: "DIGITAL",
    stage: "UNLOCKED",
    interestedCount: 214,
    committedCount: 104,
    targetCommitments: 100,
    capacityTarget: 150,
    hostStatus: "SELECTED",
    wtpBuckets: [
      { amountMinor: 8_000_00, count: 56 },
      { amountMinor: 12_000_00, count: 81 },
      { amountMinor: 20_000_00, count: 54 },
      { amountMinor: 30_000_00, count: 23 },
    ],
    tags: ["creator", "digital", "community", "session"],
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
    verifiedDemandGmvMinor: averageWtpMinor * idea.committedCount,
    progressPercent: Math.min(100, Math.round((idea.committedCount / target) * 100)),
  };
}

export function aggregateDemandMarketplace(ideas: DemandIdea[]) {
  return ideas.reduce(
    (summary, idea) => {
      const metrics = calculateDemandMetrics(idea);
      summary.interested += idea.interestedCount;
      summary.committed += idea.committedCount;
      summary.interestGmvMinor += metrics.interestGmvMinor;
      summary.verifiedDemandGmvMinor += metrics.verifiedDemandGmvMinor;
      if (idea.stage === "HOST_WANTED") summary.hostWanted += 1;
      return summary;
    },
    {
      interested: 0,
      committed: 0,
      interestGmvMinor: 0,
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
