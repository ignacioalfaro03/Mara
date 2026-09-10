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
  message: "Mara juraba que la noche iba a ser tranquila. La pillé en la cocina cantando con una cuchara de micrófono 😂",
  followup: "Me pasó otra cuchara. Yo dije que no. Esa es toda la declaración que voy a dar. Pregúntale a ella.",
  mediaMode: "written_scene",
  maraReply: "Ya viste lo que te mandó Sofi. Se le olvidó decir que cantó el segundo coro más fuerte que yo. Y que fue ella la que pidió otra canción. Conveniente su versión, ¿no?",
} as const;

export type SofiWorldKnowledge = {
  discovered: boolean;
  discoveredAt: string | null;
  source: "local" | "server" | "none";
};
