import type { CaprichoDefinition } from "@/lib/p0/caprichos";

export const caprichos: CaprichoDefinition[] = [
  {
    id: "black_bag_01",
    title: "Black Bag",
    category: "personal_capricho",
    maraLine: "No lo necesito. Ese claramente no es el problema.",
    targetCents: 42000,
    prototypeFundedCents: 28600,
    prototypeContributorCount: 43,
    currency: "USD",
    physical: true,
    worldAssetId: "asset_black_bag_01",
    status: "funding",
    worldAssetStatus: "funding",
    overfundingPolicy: "hard_close",
    failurePolicy: "open_ended",
    contributorPayoff: "First Look + private Mara callback",
    fantasyEligible: true,
  },
  {
    id: "camera_01",
    title: "Make Mara Better · Camera",
    category: "make_mara_better",
    maraLine: "Si voy a hacer esto mejor, quiero que se note de verdad.",
    targetCents: 120000,
    prototypeFundedCents: 49200,
    prototypeContributorCount: 61,
    currency: "USD",
    physical: true,
    worldAssetId: "asset_camera_01",
    status: "funding",
    worldAssetStatus: "funding",
    overfundingPolicy: "hard_close",
    failurePolicy: "open_ended",
    contributorPayoff: "Behind-the-upgrade reveal + private World Builder marker",
    fantasyEligible: false,
  },
  {
    id: "car_01",
    title: "Mara Garage · Car",
    category: "mara_garage",
    maraLine: "Tengo una pésima idea. Y ya sabes que eso normalmente me entusiasma.",
    targetCents: 500000,
    prototypeFundedCents: 231000,
    prototypeContributorCount: 118,
    currency: "USD",
    physical: true,
    worldAssetId: "asset_car_01",
    status: "funding",
    worldAssetStatus: "funding",
    overfundingPolicy: "hard_close",
    failurePolicy: "open_ended",
    contributorPayoff: "Garage Crew marker + one contributor vote",
    fantasyEligible: true,
    companyCofundCents: 1000000,
    teams: [
      { id: "black", label: "Team Black", prototypeFundedCents: 131000 },
      { id: "silver", label: "Team Silver", prototypeFundedCents: 100000 },
    ],
  },
];

export function getCapricho(id: string): CaprichoDefinition {
  const goal = caprichos.find((item) => item.id === id);
  if (!goal) throw new Error(`Missing P0 Capricho fixture: ${id}`);
  return goal;
}
