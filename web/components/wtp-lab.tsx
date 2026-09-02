"use client";

import { useEffect, useState } from "react";
import { getOfferForExperience } from "@/data/commercial";
import { track } from "@/lib/analytics";
import {
  assignWtpPriceBucket,
  type WtpPriceConfig,
  type WtpResponse,
} from "@/lib/p0/pricing-experiment";

const FIXTURE_EXPERIENCE_ID = "gym_late_voice_01";

export function WtpLab() {
  const [price, setPrice] = useState<WtpPriceConfig | null>(null);
  const [response, setResponse] = useState<WtpResponse | null>(null);
  const [continued, setContinued] = useState(false);
  const offer = getOfferForExperience(FIXTURE_EXPERIENCE_ID);

  useEffect(() => {
    const assigned = assignWtpPriceBucket();
    setPrice(assigned);
    track("wtp_price_assigned", {
      bucket: assigned.bucket,
      amount_usd_cents: assigned.amountUsdCents,
      offer_id: offer.id,
    });
    track("wtp_price_shown", {
      bucket: assigned.bucket,
      amount_usd_cents: assigned.amountUsdCents,
      offer_id: offer.id,
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
          <p className="livingMemory">
            Si una futura compra real fuera autorizada, el contrato sería: desbloqueo → regreso al mismo momento → payoff → continuación.
          </p>
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
          Un tester ve un solo precio. No mostrar P1/P2/P3 juntos durante la comparación principal.
        </p>
      </div>
    </section>
  );
}
