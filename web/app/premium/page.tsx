"use client";

import { track } from "@/lib/analytics";

const PREMIUM_URL = process.env.NEXT_PUBLIC_PREMIUM_URL;

export default function PremiumPage() {
  function handlePremiumClick() {
    track("premium_cta_click", { placement: "premium_page" });
    if (PREMIUM_URL) {
      track("external_checkout_click", { provider: "configured_external" });
      window.location.href = PREMIUM_URL;
    }
  }

  return (
    <main className="pageShell">
      <section className="editorialHeader">
        <p className="eyebrow">PRIVATE</p>
        <h1>More Mara. Less feed.</h1>
        <p className="lede">
          Premium is where the experience becomes more personal: selected content, priority interactions and custom experiences within clear boundaries.
        </p>
      </section>

      <section className="premiumList">
        <article><span>01</span><div><h2>Private access</h2><p>Premium content and moments that do not live on public social channels.</p></div></article>
        <article><span>02</span><div><h2>Personalized</h2><p>Selected messages, voice-style experiences and custom requests where supported and permitted.</p></div></article>
        <article><span>03</span><div><h2>Your boundaries count</h2><p>Higher-intensity experiences are opt-in. Clear pricing before purchase. Stop whenever you want.</p></div></article>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">LAUNCH ACCESS</p>
        <h2>Starting hypothesis: US$9.99–15/month.</h2>
        <p>Final pricing and provider remain experimental until authorized and validated.</p>
        <button className="primaryCta buttonReset" onClick={handlePremiumClick} disabled={!PREMIUM_URL}>
          {PREMIUM_URL ? "Enter private" : "Private access coming soon"}
        </button>
        {!PREMIUM_URL && <p className="disclosure">Payment/provider activation is intentionally disabled in this branch.</p>}
      </section>
    </main>
  );
}
