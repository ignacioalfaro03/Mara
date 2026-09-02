"use client";

import { useEffect, useMemo, useState } from "react";
import { getOfferForExperience, nightSeries } from "@/data/commercial";
import { track } from "@/lib/analytics";
import {
  assignCommercialExperimentVariant,
  getCommercialExperimentConfig,
  type CommercialExperimentVariant,
} from "@/lib/p0/commercial-experiment";

export function MomentumCommercePrototype({ experienceId }: { experienceId: string }) {
  const offer = useMemo(() => getOfferForExperience(experienceId), [experienceId]);
  const [variant, setVariant] = useState<CommercialExperimentVariant>("A_offer_only");
  const [variantReady, setVariantReady] = useState(false);
  const [intentCaptured, setIntentCaptured] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mockPurchased, setMockPurchased] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";
  const config = useMemo(() => getCommercialExperimentConfig(variant), [variant]);

  useEffect(() => {
    const assigned = assignCommercialExperimentVariant();
    setVariant(assigned);
    setVariantReady(true);
    track("commercial_experiment_assigned", { experiment: "momentum_commerce_p0", variant: assigned });
  }, []);

  useEffect(() => {
    if (!offer || !variantReady) return;

    track("commercial_moment_shown", {
      offer_id: offer.id,
      moment: offer.moment,
      availability_type: offer.availability.type,
      variant,
    });

    if (offer.availability.type !== "always_available") {
      track("scarcity_offer_viewed", {
        offer_id: offer.id,
        prototype_only: Boolean(offer.availability.prototypeOnly),
        variant,
      });
    }
  }, [offer, variant, variantReady]);

  if (!offer) return null;

  const activeOffer = offer;
  const belongsToCollection = activeOffer.collectionId === nightSeries.id;

  function captureIntent() {
    setIntentCaptured(true);
    track("offer_opened", { offer_id: activeOffer.id, offer_type: activeOffer.type, variant });
    track("premium_intent", { offer_id: activeOffer.id, offer_type: activeOffer.type, variant });

    if (activeOffer.type === "voice_upgrade") {
      track("voice_upgrade_interest", { offer_id: activeOffer.id, variant });
    }

    if (activeOffer.type === "custom") {
      track("custom_slot_interest", { offer_id: activeOffer.id, prototype_only: true, variant });
    }
  }

  function dismissOffer() {
    setDismissed(true);
    track("commercial_offer_dismissed", {
      offer_id: activeOffer.id,
      offer_type: activeOffer.type,
      variant,
      consequence: "none",
    });
  }

  function simulatePurchase() {
    if (!isDevelopment) return;

    setMockPurchased(true);
    track("mock_purchase_completed", { offer_id: activeOffer.id, development_only: true, variant });
    track("purchase_resume", { offer_id: activeOffer.id, resume_state: activeOffer.resumeState, variant });

    if (config.showRewardContract) {
      track("reward_delivered", { offer_id: activeOffer.id, reward_style: activeOffer.rewardStyle, variant });
    }

    if (config.showOwnership && belongsToCollection) {
      track("collection_item_acquired", { collection_id: nightSeries.id, development_only: true, variant });
    }
  }

  if (dismissed) {
    return (
      <div className="commerceDismissed" aria-live="polite">
        <span>MARA</span>
        <p>Ya. Seguimos.</p>
      </div>
    );
  }

  const isPrototypeScarcity = Boolean(activeOffer.availability.prototypeOnly);
  const collectionOwned = config.showOwnership && belongsToCollection && mockPurchased
    ? Array.from(new Set([...nightSeries.prototypeOwnedItemIds, "gym"]))
    : nightSeries.prototypeOwnedItemIds;

  return (
    <div className="premiumIntentCard">
      <span>P0 · MOMENTUM COMMERCE</span>
      {isDevelopment ? <small className="livingMemory">Experiment: {variant}</small> : null}
      <strong>{activeOffer.maraLine}</strong>
      <p>{activeOffer.scope}</p>

      {config.showRewardContract ? (
        <div className="commerceValueContract">
          <span>PAYOFF</span>
          <p>Si esto se desbloqueara, Mara reaccionaría en contexto y la experiencia seguiría desde este mismo punto.</p>
        </div>
      ) : null}

      {config.showOwnership && belongsToCollection ? (
        <div className="commerceValueContract">
          <span>MY HISTORY WITH MARA</span>
          <p>Esta experiencia también quedaría dentro de tu colección/historia adquirida.</p>
        </div>
      ) : null}

      {isPrototypeScarcity ? (
        <div className="livingMemory">
          <strong>P0 PROTOTYPE AVAILABILITY — NOT REAL INVENTORY</strong>
          <br />
          Demo: {activeOffer.availability.capacityRemaining}/{activeOffer.availability.capacityTotal} slots · reason: manual voice/QC capacity.
          This number must never be shown as real scarcity in production unless backed by enforceable inventory.
        </div>
      ) : null}

      {!intentCaptured ? (
        <div className="commerceActions">
          <button type="button" onClick={captureIntent}>{activeOffer.ctaLabel}</button>
          <button type="button" className="commerceSkip" onClick={dismissOffer}>Ahora no</button>
        </div>
      ) : (
        <p className="livingMemory">Interés guardado. No hubo cobro ni checkout.</p>
      )}

      {intentCaptured && isDevelopment && !mockPurchased ? (
        <button type="button" onClick={simulatePurchase}>Simular purchase → resume (DEV ONLY)</button>
      ) : null}

      {mockPurchased ? (
        <div className="lifeMoment">
          <span>DEV MOCK · EXACT-STATE RESUME</span>
          <p>{config.showRewardContract ? (activeOffer.rewardLine ?? "Ya. Ahora sí.") : "Ya. Ahora sí."}</p>
          <p>
            Resume state: <code>{activeOffer.resumeState}</code>. No transaction occurred; this only validates the post-purchase UX contract.
          </p>
          <button
            type="button"
            onClick={() => track("continuation_opened", { offer_id: activeOffer.id, development_only: true, variant })}
          >
            Continuar desde aquí
          </button>
        </div>
      ) : null}

      {config.showOwnership && belongsToCollection ? (
        <div className="livingMemory">
          <button
            type="button"
            className="livingReset"
            onClick={() => track("collection_viewed", { collection_id: nightSeries.id, variant })}
          >
            {nightSeries.title}: {collectionOwned.length}/{nightSeries.itemIds.length}
          </button>
          <br />Completion concept: {nightSeries.completionReward}.
        </div>
      ) : null}
    </div>
  );
}
