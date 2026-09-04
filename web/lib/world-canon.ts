export const SOFI_CHARACTER = {
  key: "sofi_v1",
  name: "Sofi",
  age: 25,
  role: "amiga cercana de Mara",
  disclosure: "personaje virtual adulto",
} as const;

export const SOFI_FOUND_FOOTAGE = {
  eventKey: "sofi_phone_clip_v1",
  factKey: "sofi_found_footage_v1",
  sourceKey: "sofi_phone_clip_v1",
  title: "Sofi te mandó algo",
  message: "Mira lo que estaba haciendo Mara cuando juraba que la noche iba a ser tranquila 😂",
  followup: "No te voy a contar el resto. Pregúntale a ella.",
  mediaMode: "phone_found_footage_preview",
} as const;

export type SofiWorldKnowledge = {
  discovered: boolean;
  discoveredAt: string | null;
  source: "local" | "server" | "none";
};
