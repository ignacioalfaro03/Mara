"use client";

import { useEffect, useMemo, useState } from "react";
import { getOfferForExperience, nightSeries } from "@/data/commercial";
import { track } from "@/lib/analytics";

export function MomentumCommercePrototype({ experienceId }: { experienceId: string }) {
  const offer = useMemo(() => getOfferForExperience(experienceId), [experienceId]);
  const [intentCaptured, setIntentCaptured] = useState(false);
  const [mockPurchased, setMockPurchased] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";
  const belongsToCollection = offer?.collectionId === nightSeries.id;

  useEffect(() => {
    if (!offer) return;

    track("commercial_moment_shown", {
      offer_id: offer.id,
      moment: offer.moment,
      availability_type: offer.availability.type,
    });

    if (offer.availability.type !== "always_available") {
      track("scarcity_offer_viewed", {
        offer_id: offer.id,
        prototype_only: Boolean(offer.availability.prototypeOnly),
      });
    }
  }, [offer]);

  if (!offer) return null;

  function captureIntent() {
    setIntentCaptured(true);
    track("offer_opened", { offer_id: offer.id, offer_type: offer.type });
    track("premium_intent", { offer_id: offer.id, offer_type: offer.type });

    if (offer.type === "voice_upgrade") {
      track("voice_upgrade_interest", { offer_id: offer.id });
    }

    if (offer.type === "custom") {
      track("custom_slot_interest", { offer_id: offer.id, prototype_only: true });
    }
  }

  function simulatePurchase() {
    if (!isDevelopment) return;

    setMockPurchased(true);
    track("mock_purchase_completed", { offer_id: offer.id, development_only: true });
    track("purchase_resume", { offer_id: offer.id, resume_state: offer.resumeState });
    track("reward_delivered", { offer_id: offer.id, reward_style: offer.rewardStyle });

    if (belongsToCollection) {
      track("collection_item_acquired", { collection_id: nightSeries.id, development_only: true });
    }
  }

  const isPrototypeScarcity = Boolean(offer.availability.prototypeOnly);
  const collectionOwned = belongsToCollection && mockPurchased
    ? Array.from(new Set([...nightSeries.prototypeOwnedItemIds, "gym"]))
    : nightSeries.prototypeOwnedItemIds;

  return (
    <div className="premiumIntentCard">
      <span>P0 · MOMENTUM COMMERCE</span>
      <strong>{offer.maraLine}</strong>
      <p>{offer.scope}</p>

      {isPrototypeScarcity ? (
        <div className="livingMemory">
          <strong>P0 PROTOTYPE AVAILABILITY — NOT REAL INVENTORY</strong>
          <br />
          Demo: {offer.availability.capacityRemaining}/{offer.availability.capacityTotal} slots · reason: manual voice/QC capacity.
          This number must never be shown as real scarcity in production unless backed by enforceable inventory.
        </div>
      ) : null}

      {!intentCaptured ? (
        <button type="button" onClick={captureIntent}>{offer.ctaLabel}</button>
      ) : (
        <p className="livingMemory">Interés guardado. No hubo cobro ni checkout.</p>
      )}

      {intentCaptured && isDevelopment && !mockPurchased ? (
        <button type="button" onClick={simulatePurchase}>Simular purchase → resume (DEV ONLY)</button>
      ) : null}

      {mockPurchased ? (
        <div className="lifeMoment">
          <span>DEV MOCK · EXACT-STATE RESUME</span>
          <p>{offer.rewardLine ?? "Ya. Ahora sí."}</p>
          <p>
            Resume state: <code>{offer.resumeState}</code>. No transaction occurred; this only validates the post-purchase UX contract.
          </p>
          <button
            type="button"
            onClick={() => track("continuation_opened", { offer_id: offer.id, development_only: true })}
          >
            Continuar desde aquí
          </button>
        </div>
      ) : null}

      {belongsToCollection ? (
        <div className="livingMemory">
          <button
            type="button"
            className="livingReset"
            onClick={() => track("collection_viewed", { collection_id: nightSeries.id })}
          >
            {nightSeries.title}: {collectionOwned.length}/{nightSeries.itemIds.length}
          </button>
          <br />Completion concept: {nightSeries.completionReward}.
        </div>
      ) : null}
    </div>
  );
}
