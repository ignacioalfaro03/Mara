"use client";

import { useEffect, useMemo, useState } from "react";
import { getOfferForExperience, nightSeries } from "@/data/commercial";
import { track } from "@/lib/analytics";
import {
  getCommercialExperimentConfig,
  readCommercialExperimentVariant,
  type CommercialExperimentVariant,
} from "@/lib/p0/commercial-experiment";
import {
  assignWtpPriceBucket,
  type WtpPriceConfig,
  type WtpResponse,
} from "@/lib/p0/pricing-experiment";

const FIXTURE_EXPERIENCE_ID = "gym_late_voice_01";

export function WtpLab() {
  const [price, setPrice] = useState<WtpPriceConfig | null>(null);
  const [treatment, setTreatment] = useState<CommercialExperimentVariant>("A_offer_only");
  const [response, setResponse] = useState<WtpResponse | null>(null);
  const [continued, setContinued] = useState(false);
  const offer = getOfferForExperience(FIXTURE_EXPERIENCE_ID);
  const treatmentConfig = useMemo(() => getCommercialExperimentConfig(treatment), [treatment]);
  const belongsToCollection = offer.collectionId === nightSeries.id;

  useEffect(() => {
    const activeTreatment = readCommercialExperimentVariant() ?? "A_offer_only";
    const assigned = assignWtpPriceBucket();
    setTreatment(activeTreatment);
    setPrice(assigned);
    track("wtp_price_assigned", {
      bucket: assigned.bucket,
      amount_usd_cents: assigned.amountUsdCents,
      offer_id: offer.id,
      treatment: activeTreatment,
    });
    track("wtp_price_shown", {
      bucket: assigned.bucket,
      amount_usd_cents: assigned.amountUsdCents,
      offer_id: offer.id,
      treatment: activeTreatment,
    });
  }, [offer.id]);

  if (!price) return null;
  const activePrice = price;

  function answer(next: WtpResponse) {
    if (response) return;
    setResponse(next);
    track(
      next === "yes" ? "wtp_response_yes" : next === "maybe" ? "wtp_response_maybe" : "wtp_response_no",
      {
        bucket: activePrice.bucket,
        amount_usd_cents: activePrice.amountUsdCents,
        offer_id: offer.id,
        treatment,
      },
    );
  }

  function continueAfterPrice() {
    if (!response || continued) return;
    setContinued(true);
    track("wtp_post_price_continued", {
      bucket: activePrice.bucket,
      amount_usd_cents: activePrice.amountUsdCents,
      response,
      offer_id: offer.id,
      treatment,
    });
  }

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · P0 WILLINGNESS TO PAY</p>
        <h1>La otra parte la seguiría desde acá contigo.</h1>
        <p className="livingLead">{offer.maraLine}</p>

        <div className="premiumIntentCard">
          <span>PRECIO HIPOTÉTICO · NO SE COBRARÁ</span>
          <strong>{activePrice.display}</strong>
          <p>
            Pago único hipotético por: {offer.scope.replace(" P0 intent only.", "")} No es suscripción.
            En P0 no existe checkout, cargo ni entitlement real.
          </p>

          {treatmentConfig.showRewardContract ? (
            <div className="commerceValueContract">
              <span>PAYOFF</span>
              <p>Si esto se comprara de verdad, Mara reaccionaría en contexto y la experiencia seguiría desde este mismo punto.</p>
            </div>
          ) : null}

          {treatmentConfig.showOwnership && belongsToCollection ? (
            <div className="commerceValueContract">
              <span>MY HISTORY WITH MARA</span>
              <p>Esta experiencia también quedaría dentro de tu colección/historia adquirida.</p>
            </div>
          ) : null}

          <p className="livingMemory">Treatment congelado para este test: {treatment}.</p>
        </div>

        {!response ? (
          <div className="livingChoices">
            <button className="livingChoice" type="button" onClick={() => answer("yes")}>
              <strong>Sí, a ese precio seguiría</strong>
              <span>Esto mide intención declarada, no compra.</span>
            </button>
            <button className="livingChoice" type="button" onClick={() => answer("maybe")}>
              <strong>Tal vez / depende</strong>
              <span>El valor todavía no me queda completamente claro.</span>
            </button>
            <button className="livingChoice" type="button" onClick={() => answer("no")}>
              <strong>No a ese precio</strong>
              <span>Seguir con Mara no se castiga.</span>
            </button>
          </div>
        ) : (
          <div className="lifeMoment">
            <span>RESPUESTA REGISTRADA</span>
            <p>
              {response === "yes"
                ? "Ya. Me sirve saber que ahí sí ves valor."
                : response === "maybe"
                  ? "Bien. Entonces todavía tendría que demostrarte mejor qué recibes."
                  : "Perfecto. A ese precio no. Seguimos igual."}
            </p>
            {!continued ? (
              <button type="button" onClick={continueAfterPrice}>Seguir con Mara</button>
            ) : (
              <p className="livingMemory">Continuidad post-precio registrada.</p>
            )}
          </div>
        )}

        <p className="livingDisclosure">
          Primero fija A/B/C en el DEV panel y luego cambia solo P1/P2/P3. Un tester ve un solo precio.
        </p>
      </div>
    </section>
  );
}
