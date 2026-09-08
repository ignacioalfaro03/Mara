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
    shortDescription: "Una continuación privada, breve y concreta después de tu primera escena con Mara.",
    longDescription:
      "El primer producto pagado de Mara es deliberadamente simple: una pieza privada que continúa la escena inicial y queda asociada a tu cuenta. Sirve para probar el loop comprar → desbloquear → volver sin convertir Mara en un servicio de chat infinito.",
    includes: ["Desbloqueo único", "Acceso ligado a tu cuenta", "Relectura desde tu biblioteca", "Sin consumo variable de IA"],
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
    shortDescription: "Una experiencia guiada con principio, tensión, cierre y un siguiente paso claro.",
    longDescription:
      "Esta experiencia ya tiene un prototipo editorial en el inventario de Mara, pero no se marcará como comprable hasta que el activo final, su QA y su entitlement estén registrados. La tienda muestra el producto sin fingir que un archivo todavía no producido existe.",
    includes: ["Experiencia acotada", "Narrativa propia", "Callback reutilizable", "Preparada para colección"],
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
    shortDescription: "Una escena nocturna pensada para venderse y volver a reproducirse sin operación manual.",
    longDescription:
      "After Midnight representa el tipo de inventario que Mara debe acumular: una experiencia nombrada, reconocible, empaquetable y reutilizable. Se mantiene como próxima hasta completar producción y QA del activo final.",
    includes: ["Formato evergreen", "Experiencia delimitada", "Alta reutilización", "Lista para upsell"],
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
    shortDescription: "La primera colección evergreen: varias experiencias existentes empaquetadas para elevar AOV.",
    longDescription:
      "La colección es el destino comercial del catálogo: agrupa activos ya producidos en vez de obligar a crear algo nuevo para cada venta. Se activará cuando existan suficientes experiencias finales y entitlements para entregar el bundle completo de forma automática.",
    includes: ["Varias experiencias", "Precio bundle", "Acceso persistente", "Siguiente compra evidente"],
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
