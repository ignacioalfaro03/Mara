const ACTION_TITLES: Record<string, string> = {
  fulfill: "Fulfill this first.",
  post_purchase_followup: "Cuida esta primera compra.",
  related_offer: "Hay una compra siguiente relevante.",
  complete_collection: "Hay una compra siguiente relevante.",
  offer_membership: "Puede tener sentido ofrecer recurrencia.",
  reactivate_with_value: "Reactiva con valor, no presión.",
  reactivate_with_free_preview: "Reactiva con valor, no presión.",
  wait: "No vendas nada ahora.",
  learn_more: "Aprende antes de vender.",
  no_action: "No hay una acción comercial clara.",
};

const NON_ACKNOWLEDGEABLE_ACTIONS = new Set(["fulfill", "wait", "no_action"]);

export function normalizeCreatorAction(action: string | null | undefined) {
  const normalized = action?.trim().toLowerCase();
  return normalized || "no_action";
}

export function creatorActionTitle(action: string | null | undefined) {
  const normalized = normalizeCreatorAction(action);
  return ACTION_TITLES[normalized] ?? normalized.replaceAll("_", " ");
}

export function isCreatorActionAcknowledgeable(action: string | null | undefined) {
  const normalized = normalizeCreatorAction(action);
  return normalized in ACTION_TITLES && !NON_ACKNOWLEDGEABLE_ACTIONS.has(normalized);
}
