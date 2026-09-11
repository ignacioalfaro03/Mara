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
  message: "No se suponía que Mara viera este encuadre. Estaba frente al espejo, con la pieza casi oscura, mirando el teléfono como si supiera exactamente cuándo iba a empezar a grabar.",
  followup: "Yo solo dejé el clip donde podía encontrarlo. Si quiere contarte por qué no se dio vuelta al tiro, que te lo explique ella.",
  mediaMode: "written_scene",
  maraReply: "Así que viste el clip. Sofi cree que me pilló distraída. Déjala. La parte entretenida es que todavía no sabe cuánto rato llevaba viendo su reflejo detrás del mío.",
} as const;

export type SofiWorldKnowledge = {
  discovered: boolean;
  discoveredAt: string | null;
  source: "local" | "server" | "none";
};