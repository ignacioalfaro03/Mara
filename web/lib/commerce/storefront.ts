export type StoreProductStatus = "available" | "planned";
export type StoreProductKind = "entry" | "scene" | "collection";

export type StoreProduct = {
  slug: string;
  offerSlug: string | null;
  entitlementKey: string | null;
  kind: StoreProductKind;
  status: StoreProductStatus;
  eyebrow: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  includes: string[];
  priceLabel: string;
  nextSlug: string | null;
  sourceAsset: string;
};

export const storefrontProducts: StoreProduct[] = [
  {
    slug: "night-note",
    offerSlug: "private_after_scene_note_v1",
    entitlementKey: "private_after_scene_note_v1",
    kind: "entry",
    status: "available",
    eyebrow: "EMPIEZA AQUÍ",
    title: "La nota de esta noche",
    shortDescription: "Hay una parte de esta noche que no dejé en la escena gratis. Es corta. Privada. Y se queda contigo.",
    longDescription:
      "No todo lo que pasa con Mara tiene que durar horas. Esta es una continuación privada de la primera escena: la desbloqueas una vez, la guardas y puedes volver cuando quieras.",
    includes: ["Nota privada completa", "Desbloqueo único", "Guardada en tu biblioteca", "Puedes volver a abrirla"],
    priceLabel: "US$4.99",
    nextSlug: "after-midnight",
    sourceAsset: "existing commerce entitlement",
  },
  {
    slug: "other-side",
    offerSlug: null,
    entitlementKey: null,
    kind: "scene",
    status: "planned",
    eyebrow: "ESCENA",
    title: "Al otro lado de la puerta",
    shortDescription: "Una puerta cerrada, una regla y Mara decidiendo cuánto te deja ver.",
    longDescription:
      "Empieza con algo simple: cerrar la puerta. Después Mara lleva la escena hasta el final sin convertirla en una conversación eterna. Cuando esté completa, aparecerá aquí para guardarla.",
    includes: ["Experiencia guiada", "Inicio y cierre definidos", "Ritual reconocible", "Continuación conectada"],
    priceLabel: "Próximamente",
    nextSlug: "after-midnight",
    sourceAsset: "web/content/scenes/MARA_SCENE_001_OTHER_SIDE.md",
  },
  {
    slug: "after-midnight",
    offerSlug: null,
    entitlementKey: null,
    kind: "scene",
    status: "planned",
    eyebrow: "ESCENA",
    title: "After Midnight",
    shortDescription: "Más tarde cambia el tono. Mara también.",
    longDescription:
      "Una experiencia nocturna hecha para abrirla cuando quieras algo más intenso que el contenido público, pero sin tener que quedarte conectado toda la noche. Entra, sigue la escena y vuelve a ella después.",
    includes: ["Escena nocturna", "Secuencia guiada", "Acceso persistente", "Conecta con la colección Night"],
    priceLabel: "Próximamente",
    nextSlug: "night-vol-1",
    sourceAsset: "web/content/scenes/MARA_SCENE_004_AFTER_MIDNIGHT.md",
  },
  {
    slug: "night-vol-1",
    offerSlug: null,
    entitlementKey: null,
    kind: "collection",
    status: "planned",
    eyebrow: "COLECCIÓN",
    title: "Mara Night — Vol. I",
    shortDescription: "Varias noches de Mara reunidas en un solo lugar.",
    longDescription:
      "Cuando las primeras escenas estén completas, Mara Night las reunirá como una colección. Una compra, varias experiencias y una biblioteca que puedes volver a abrir sin perseguir cada publicación por separado.",
    includes: ["Varias experiencias", "Precio de colección", "Todo guardado junto", "Acceso para volver cuando quieras"],
    priceLabel: "En preparación",
    nextSlug: null,
    sourceAsset: "web/content/MARA_IMMERSIVE_SCENES_CATALOG_V1.md",
  },
];

export const availableStorefrontProducts = storefrontProducts.filter((product) => product.status === "available");

export function getStoreProduct(slug: string) {
  return storefrontProducts.find((product) => product.slug === slug) ?? null;
}

export function getStoreProductByEntitlement(entitlementKey: string) {
  return storefrontProducts.find((product) => product.entitlementKey === entitlementKey) ?? null;
}

export function getStoreProductByOfferSlug(offerSlug: string) {
  return storefrontProducts.find((product) => product.offerSlug === offerSlug) ?? null;
}
