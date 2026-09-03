export type MaraMomentChoice = {
  id: string;
  label: string;
  reaction: string;
};

export type MaraMoment = {
  id: string;
  time: string;
  eyebrow: string;
  title: string;
  body: string;
  mediaKind: "image" | "video" | "voice";
  mediaSrc?: string;
  poster?: string;
  imagePosition?: string;
  choices?: MaraMomentChoice[];
};

export const canonicalMaraImage = "/mara/mara-v1-reference.jpg";

export const maraHeroVideo = process.env.NEXT_PUBLIC_MARA_HERO_VIDEO || undefined;

export const maraMoments: MaraMoment[] = [
  {
    id: "morning-coffee",
    time: "08:12",
    eyebrow: "RECIÉN DESPIERTA",
    title: "El café está hecho. Mara todavía no.",
    body: "Abrió el notebook, miró el café y volvió a sentarse en la cama. Dice que son cinco minutos.",
    mediaKind: process.env.NEXT_PUBLIC_MARA_MORNING_VIDEO ? "video" : "image",
    mediaSrc: process.env.NEXT_PUBLIC_MARA_MORNING_VIDEO || undefined,
    poster: canonicalMaraImage,
    imagePosition: "48% 30%",
    choices: [
      { id: "coffee", label: "Café. Ahora.", reaction: "Pesado. Ya voy." },
      { id: "five-more", label: "Cinco minutos.", reaction: "Sabía que ibas a dejarme." },
    ],
  },
  {
    id: "gym-last-set",
    time: "13:27",
    eyebrow: "GYM",
    title: "Dijo que hoy no venía.",
    body: "Terminó viniendo igual. Ahora está negociando consigo misma el último ejercicio.",
    mediaKind: process.env.NEXT_PUBLIC_MARA_GYM_VIDEO ? "video" : "image",
    mediaSrc: process.env.NEXT_PUBLIC_MARA_GYM_VIDEO || undefined,
    poster: canonicalMaraImage,
    imagePosition: "54% 42%",
    choices: [
      { id: "finish", label: "Termínalo.", reaction: "Ya. Uno más y me voy." },
      { id: "leave", label: "Ándate nomás.", reaction: "Qué mala influencia. Me gusta un poco." },
    ],
  },
  {
    id: "story-before-going-out",
    time: "20:41",
    eyebrow: "ANTES DE SALIR",
    title: "Lleva demasiado rato mirando la misma Story.",
    body: "No sabe si subirla, guardarla o mandársela a alguien antes. Tú llegaste justo en esa parte.",
    mediaKind: process.env.NEXT_PUBLIC_MARA_STORY_VIDEO ? "video" : "image",
    mediaSrc: process.env.NEXT_PUBLIC_MARA_STORY_VIDEO || undefined,
    poster: canonicalMaraImage,
    imagePosition: "62% 34%",
    choices: [
      { id: "post", label: "Súbela.", reaction: "Mmm. Quizás." },
      { id: "keep", label: "No todavía.", reaction: "Eso estaba pensando." },
    ],
  },
  {
    id: "late-voice",
    time: "23:18",
    eyebrow: "NOTA DE VOZ",
    title: "Grabó algo. Todavía no decide si mandarlo.",
    body: "Hay momentos que funcionan mejor cuando Mara habla que cuando explica.",
    mediaKind: "voice",
    mediaSrc: process.env.NEXT_PUBLIC_MARA_NIGHT_VOICE_URL || undefined,
    poster: canonicalMaraImage,
    imagePosition: "45% 40%",
    choices: [
      { id: "send", label: "Mándalo.", reaction: "Ansioso." },
      { id: "wait", label: "Déjame esperando.", reaction: "Eso sí lo puedo hacer." },
    ],
  },
];
