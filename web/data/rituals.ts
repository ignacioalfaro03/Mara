import type { RitualDefinition } from "@/lib/p0/rituals";

export const ritualFixtures: RitualDefinition[] = [
  {
    id: "R01",
    family: "appearance_tease",
    title: "Appearance Tease",
    maraLine: "Tú eliges una cosa. Yo decido el resto.",
    description: "Tests a wardrobe/reveal ritual without generating explicit media.",
    adultRequired: true,
    intensity: "medium",
    repeatWindow: "occasional",
    rewardOptions: ["teasing", "reveal", "surprise"],
  },
  {
    id: "R02",
    family: "mara_choice",
    title: "Mara Chooses",
    maraLine: "No. Esta vez eliges menos tú.",
    description: "Tests whether Mara-led choice/control increases participation.",
    adultRequired: false,
    intensity: "medium",
    repeatWindow: "occasional",
    rewardOptions: ["praise", "teasing", "surprise"],
  },
  {
    id: "R03",
    family: "anticipation",
    title: "Not Yet",
    maraLine: "Todavía no. Quiero ver si sabes esperar.",
    description: "Tests a short, bounded anticipation/self-control mechanic. No real sexual instruction is delivered in P0.",
    adultRequired: true,
    intensity: "high",
    repeatWindow: "rare",
    rewardOptions: ["praise", "teasing", "reveal"],
  },
  {
    id: "R04",
    family: "ordinary_dare",
    title: "Ridiculous Little Dare",
    maraLine: "Esto no tiene nada de sexy. Por eso quiero que lo hagas.",
    description: "Tests a harmless ordinary/absurd dare to preserve contrast and character range.",
    adultRequired: false,
    intensity: "low",
    repeatWindow: "common",
    rewardOptions: ["teasing", "surprise", "none"],
  },
];

export function getRitualFixture(id: string): RitualDefinition {
  const ritual = ritualFixtures.find((candidate) => candidate.id === id);
  if (!ritual) throw new Error(`Missing ritual fixture: ${id}`);
  return ritual;
}
