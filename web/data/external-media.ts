import type { ExternalMediaCandidate } from "@/lib/p0/external-media";

export const externalMediaCandidates: ExternalMediaCandidate[] = [
  {
    id: "E01",
    routeId: "D01",
    title: "Control / submission test",
    maraFrame: "Quiero probar una cosa contigo. Mira algo donde la otra persona lleve claramente el ritmo y vuelve.",
    descriptor: "Abstract adult-media fixture: control-led dynamic, medium intensity, no real URL.",
    learningFocus: "Did the user respond to being led, to the pace, or to the visual framing?",
    nextIfPositive: "Rank Mara-led original experiences higher.",
    nextIfNegative: "Reduce command/control weighting and explore collaborative dynamics.",
    prototypeOnly: true,
  },
  {
    id: "E02",
    routeId: "D02",
    title: "Money / status control test",
    maraFrame: "No quiero saber si te gusta gastar. Quiero saber si lo que te mueve es el control, el lujo o la tensión alrededor del dinero.",
    descriptor: "Abstract adult-media fixture: consensual financial-domination fantasy pattern, no real transaction or URL.",
    learningFocus: "Separate money/status aesthetics from real spending behavior.",
    nextIfPositive: "Rank eligible findom-flavored Mara experiences, luxury styling and relevant Caprichos higher.",
    nextIfNegative: "Keep ordinary pricing and lower D02 fantasy relevance.",
    prototypeOnly: true,
  },
  {
    id: "E03",
    routeId: "D03",
    title: "Authority / boss test",
    maraFrame: "Mira esto como si yo estuviera tratando de entender qué parte te funciona: autoridad, ropa, voz o situación.",
    descriptor: "Abstract adult-media fixture: adult authority-roleplay pattern, office-adjacent styling, no real URL.",
    learningFocus: "Authority vs costume vs dialogue vs scenario fit.",
    nextIfPositive: "Rank authority scenarios and voice/dialogue experiences higher.",
    nextIfNegative: "Explore other power dynamics instead of treating authority as a durable preference.",
    prototypeOnly: true,
  },
  {
    id: "E04",
    routeId: "D04",
    title: "Forbidden-fiction tension test",
    maraFrame: "No me importa la etiqueta. Quiero saber si lo que te atrae es que se sienta prohibido, secreto o simplemente inesperado.",
    descriptor: "Abstract adults-only fictional taboo-tension fixture. No prohibited category, real relation or real URL is instantiated.",
    learningFocus: "Forbidden/secrecy tension vs specific scenario preference.",
    nextIfPositive: "Explore eligible adults-only taboo-fiction tension within active policy/consent boundaries.",
    nextIfNegative: "Lower taboo-tension weighting and preserve other novelty signals.",
    prototypeOnly: true,
  },
  {
    id: "E05",
    routeId: "D05",
    title: "Intimacy / continuity control",
    maraFrame: "Puede que ni siquiera quieras que te mande fuera. Quiero comparar eso con algo que tenga historia entre tú y yo.",
    descriptor: "Control fixture where the better recommendation may be Mara-owned continuity rather than external porn.",
    learningFocus: "External explicit media vs relationship/continuity value.",
    nextIfPositive: "External media may be useful selectively.",
    nextIfNegative: "Prefer Mara-owned voice/story/continuity over external media for this context.",
    prototypeOnly: true,
  },
];

export function getExternalMediaCandidate(id: string): ExternalMediaCandidate {
  const candidate = externalMediaCandidates.find((item) => item.id === id);
  if (!candidate) throw new Error(`Missing P0 external media candidate: ${id}`);
  return candidate;
}
