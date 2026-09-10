export type AttributionSource = "CREATOR" | "MARA" | "CROSS_CREATOR";
export type SignalSource = "USER_DECLARED" | "PURCHASE_BEHAVIOR" | "PLATFORM_EVENT" | "DERIVED";
export type SignalLabel = "DECLARED" | "OBSERVED" | "DERIVED";
export type SignalScope = "CREATOR_CHARACTER" | "CREATOR_ACCOUNT";
export type ConsentStatus = "USER_PROVIDED" | "TRANSACTIONAL_NECESSITY" | "DERIVED_FROM_ALLOWED_SIGNALS";
export type ProductFormat = "audio" | "collection" | "personalized" | "session" | "membership";
export type FanSegment =
  | "FIRST_TIME_BUYER"
  | "REPEAT_BUYER"
  | "VIP"
  | "MEMBER"
  | "DORMANT"
  | "CUSTOMER_WAITING_FOR_DELIVERY"
  | "AUDIO_BUYER"
  | "COLLECTOR"
  | "CREATOR_BROUGHT"
  | "MARA_DISCOVERED";

export type NextBestActionType =
  | "FULFILL"
  | "POST_PURCHASE_FOLLOWUP"
  | "COMPLETE_COLLECTION"
  | "OFFER_MEMBERSHIP"
  | "REACTIVATE_WITH_FREE_PREVIEW"
  | "WAIT"
  | "NO_ACTION";

export type PreferenceSignal = {
  label: SignalLabel;
  source: SignalSource;
  key: string;
  displayValue: string;
  explanation: string;
  confidence: "explicit" | "high" | "medium";
  createdAt: string;
  scope: SignalScope;
  consentStatus: ConsentStatus;
  creatorVisible: boolean;
  userEditable: boolean;
};

export type SyntheticFan = {
  alias: string;
  relationshipDays: number;
  firstPurchaseDaysAgo: number;
  lastPurchaseDaysAgo: number;
  totalSpendMinor: number;
  creatorNetEarningsMinor: number;
  orderCount: number;
  creatorMinutes: number;
  formatsPurchased: ProductFormat[];
  membershipActive: boolean;
  collectionCompletion: number;
  pendingFulfillment: boolean;
  lastCreatorActionDaysAgo: number;
  attribution: AttributionSource;
  preferences: PreferenceSignal[];
};

export type NextBestAction = {
  type: NextBestActionType;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export const ACTION_COOLDOWN_DAYS = 7;
export const DORMANT_DAYS = 30;

const SYNTHETIC_SIGNAL_DATE = "2026-09-07T12:00:00Z";

type BaseSignal = Omit<PreferenceSignal, "createdAt" | "scope" | "consentStatus">;

function declaredSignal(signal: BaseSignal): PreferenceSignal {
  return {
    ...signal,
    createdAt: SYNTHETIC_SIGNAL_DATE,
    scope: "CREATOR_CHARACTER",
    consentStatus: "USER_PROVIDED",
  };
}

function observedSignal(signal: BaseSignal): PreferenceSignal {
  return {
    ...signal,
    createdAt: SYNTHETIC_SIGNAL_DATE,
    scope: "CREATOR_CHARACTER",
    consentStatus: "TRANSACTIONAL_NECESSITY",
  };
}

function derivedSignal(signal: BaseSignal): PreferenceSignal {
  return {
    ...signal,
    createdAt: SYNTHETIC_SIGNAL_DATE,
    scope: "CREATOR_CHARACTER",
    consentStatus: "DERIVED_FROM_ALLOWED_SIGNALS",
  };
}

export const syntheticFans: SyntheticFan[] = [
  {
    alias: "luna_24",
    relationshipDays: 2,
    firstPurchaseDaysAgo: 2,
    lastPurchaseDaysAgo: 2,
    totalSpendMinor: 1290,
    creatorNetEarningsMinor: 1030,
    orderCount: 1,
    creatorMinutes: 4,
    formatsPurchased: ["audio"],
    membershipActive: false,
    collectionCompletion: 0,
    pendingFulfillment: false,
    lastCreatorActionDaysAgo: 30,
    attribution: "MARA",
    preferences: [
      declaredSignal({
        label: "DECLARED",
        source: "USER_DECLARED",
        key: "preferred_format",
        displayValue: "Audio",
        explanation: "The fan selected audio as a preferred product format.",
        confidence: "explicit",
        creatorVisible: true,
        userEditable: true,
      }),
      observedSignal({
        label: "OBSERVED",
        source: "PURCHASE_BEHAVIOR",
        key: "last_purchase_format",
        displayValue: "Audio",
        explanation: "The first completed purchase was an audio product.",
        confidence: "high",
        creatorVisible: true,
        userEditable: false,
      }),
    ],
  },
  {
    alias: "nico_scl",
    relationshipDays: 46,
    firstPurchaseDaysAgo: 46,
    lastPurchaseDaysAgo: 4,
    totalSpendMinor: 5390,
    creatorNetEarningsMinor: 4470,
    orderCount: 4,
    creatorMinutes: 20,
    formatsPurchased: ["collection", "audio", "collection", "collection"],
    membershipActive: false,
    collectionCompletion: 0.75,
    pendingFulfillment: false,
    lastCreatorActionDaysAgo: 9,
    attribution: "CREATOR",
    preferences: [
      observedSignal({
        label: "OBSERVED",
        source: "PURCHASE_BEHAVIOR",
        key: "collection_pattern",
        displayValue: "3 collection purchases",
        explanation: "Three of four completed purchases were collection products.",
        confidence: "high",
        creatorVisible: true,
        userEditable: false,
      }),
      derivedSignal({
        label: "DERIVED",
        source: "DERIVED",
        key: "collection_completion",
        displayValue: "75% complete",
        explanation: "Purchase history shows three of four products in the current collection are owned.",
        confidence: "high",
        creatorVisible: true,
        userEditable: false,
      }),
    ],
  },
  {
    alias: "marea",
    relationshipDays: 81,
    firstPurchaseDaysAgo: 81,
    lastPurchaseDaysAgo: 42,
    totalSpendMinor: 2490,
    creatorNetEarningsMinor: 2010,
    orderCount: 2,
    creatorMinutes: 8,
    formatsPurchased: ["audio", "collection"],
    membershipActive: false,
    collectionCompletion: 0.25,
    pendingFulfillment: false,
    lastCreatorActionDaysAgo: 36,
    attribution: "MARA",
    preferences: [
      derivedSignal({
        label: "DERIVED",
        source: "DERIVED",
        key: "commercial_dormancy",
        displayValue: "Dormant",
        explanation: "No completed purchase has occurred in the last 30 days.",
        confidence: "high",
        creatorVisible: true,
        userEditable: false,
      }),
    ],
  },
  {
    alias: "rio_norte",
    relationshipDays: 17,
    firstPurchaseDaysAgo: 17,
    lastPurchaseDaysAgo: 1,
    totalSpendMinor: 3890,
    creatorNetEarningsMinor: 3150,
    orderCount: 3,
    creatorMinutes: 18,
    formatsPurchased: ["audio", "personalized", "personalized"],
    membershipActive: true,
    collectionCompletion: 0,
    pendingFulfillment: true,
    lastCreatorActionDaysAgo: 1,
    attribution: "CREATOR",
    preferences: [
      declaredSignal({
        label: "DECLARED",
        source: "USER_DECLARED",
        key: "preferred_language",
        displayValue: "Español",
        explanation: "The fan explicitly selected Spanish for fulfillment.",
        confidence: "explicit",
        creatorVisible: true,
        userEditable: true,
      }),
      observedSignal({
        label: "OBSERVED",
        source: "PLATFORM_EVENT",
        key: "pending_fulfillment",
        displayValue: "1 personalized product pending",
        explanation: "A paid personalized product has not yet been marked fulfilled.",
        confidence: "high",
        creatorVisible: true,
        userEditable: false,
      }),
    ],
  },
];

export function visiblePreferenceSignals(fan: SyntheticFan) {
  return fan.preferences.filter((signal) => signal.creatorVisible);
}

export function deriveSegments(fan: SyntheticFan): FanSegment[] {
  const segments: FanSegment[] = [];

  if (fan.orderCount === 1) segments.push("FIRST_TIME_BUYER");
  if (fan.orderCount >= 2) segments.push("REPEAT_BUYER");
  if (fan.creatorNetEarningsMinor >= 4000 || fan.orderCount >= 4) segments.push("VIP");
  if (fan.membershipActive) segments.push("MEMBER");
  if (fan.lastPurchaseDaysAgo >= DORMANT_DAYS) segments.push("DORMANT");
  if (fan.pendingFulfillment) segments.push("CUSTOMER_WAITING_FOR_DELIVERY");
  if (fan.formatsPurchased.filter((format) => format === "audio").length >= 2) segments.push("AUDIO_BUYER");
  if (fan.formatsPurchased.filter((format) => format === "collection").length >= 2) segments.push("COLLECTOR");
  if (fan.attribution === "CREATOR") segments.push("CREATOR_BROUGHT");
  if (fan.attribution === "MARA") segments.push("MARA_DISCOVERED");

  return segments;
}

export function recommendNextAction(fan: SyntheticFan): NextBestAction {
  if (fan.pendingFulfillment) {
    return {
      type: "FULFILL",
      title: "Entrega pendiente",
      reason: "Hay un producto personalizado pagado que todavía necesita fulfillment.",
      priority: "high",
    };
  }

  if (fan.lastCreatorActionDaysAgo < ACTION_COOLDOWN_DAYS) {
    return {
      type: "WAIT",
      title: "No empujar ahora",
      reason: `Hubo una acción de creadora hace menos de ${ACTION_COOLDOWN_DAYS} días. El cooldown evita sobrecontacto.`,
      priority: "low",
    };
  }

  if (fan.orderCount === 1 && fan.lastPurchaseDaysAgo <= 3) {
    return {
      type: "POST_PURCHASE_FOLLOWUP",
      title: "Agradece la primera compra",
      reason: "Es un comprador nuevo. Prioriza una buena experiencia antes de un upsell.",
      priority: "medium",
    };
  }

  if (fan.orderCount >= 2 && fan.collectionCompletion >= 0.5 && fan.collectionCompletion < 1) {
    return {
      type: "COMPLETE_COLLECTION",
      title: "Completar colección",
      reason: "Ya compró repetidamente y tiene una colección incompleta. Recomienda solo la pieza faltante relevante.",
      priority: "medium",
    };
  }

  if (fan.orderCount >= 3 && !fan.membershipActive) {
    return {
      type: "OFFER_MEMBERSHIP",
      title: "Probar membresía",
      reason: "Existe recurrencia suficiente para ofrecer acceso recurrente sin asumir una preferencia íntima.",
      priority: "medium",
    };
  }

  if (fan.lastPurchaseDaysAgo >= DORMANT_DAYS) {
    return {
      type: "REACTIVATE_WITH_FREE_PREVIEW",
      title: "Reactivar con muestra gratis",
      reason: "La relación comercial está dormida. Empieza con valor gratuito, no con presión de compra.",
      priority: "low",
    };
  }

  return {
    type: "NO_ACTION",
    title: "Sin acción recomendada",
    reason: "No hay una oportunidad comercial clara que justifique contactar ahora.",
    priority: "low",
  };
}

export function money(minor: number, currency = "USD") {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency }).format(minor / 100);
}

export function earningsPerCreatorHour(fan: SyntheticFan) {
  if (fan.creatorMinutes <= 0) return null;
  return Math.round((fan.creatorNetEarningsMinor / fan.creatorMinutes) * 60);
}

export function dashboardSummary(fans: SyntheticFan[]) {
  const grossMinor = fans.reduce((sum, fan) => sum + fan.totalSpendMinor, 0);
  const creatorNetMinor = fans.reduce((sum, fan) => sum + fan.creatorNetEarningsMinor, 0);
  const creatorMinutes = fans.reduce((sum, fan) => sum + fan.creatorMinutes, 0);
  const repeatBuyers = fans.filter((fan) => fan.orderCount >= 2).length;
  const creatorSourcedMinor = fans
    .filter((fan) => fan.attribution === "CREATOR")
    .reduce((sum, fan) => sum + fan.totalSpendMinor, 0);
  const maraSourcedMinor = fans
    .filter((fan) => fan.attribution === "MARA")
    .reduce((sum, fan) => sum + fan.totalSpendMinor, 0);

  return {
    grossMinor,
    creatorNetMinor,
    repeatBuyers,
    repeatRate: fans.length === 0 ? 0 : repeatBuyers / fans.length,
    earningsPerHourMinor: creatorMinutes === 0 ? 0 : Math.round((creatorNetMinor / creatorMinutes) * 60),
    creatorSourcedMinor,
    maraSourcedMinor,
  };
}
