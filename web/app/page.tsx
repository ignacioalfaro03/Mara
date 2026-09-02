"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroMedia" aria-label="Mara Vera visual placeholder">
          <div className="mediaFrame">
            <span>Visual identity slot</span>
          </div>
        </div>
        <div className="heroCopy">
          <p className="eyebrow">MEET MARA VERA</p>
          <h1>You don’t need another AI. You want someone worth coming back to.</h1>
          <p className="lede">
            Mara Vera is a synthetic virtual character with her own taste, voice, life and a way of figuring you out while you play.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta" onClick={() => track("hero_cta_click", { target: "first_living_experience" })}>
              Enter Mara
            </Link>
            <Link href="/meet-mara" className="textCta">Meet Mara</Link>
          </div>
          <p className="disclosure">AI-generated character · Adults only · P0 experience stores only local prototype state</p>
        </div>
      </section>

      <section className="statementGrid">
        <article>
          <span>01</span>
          <h2>She has a point of view.</h2>
          <p>Mara reacts, predicts and chooses. She is not designed to agree with everything or behave like a generic assistant.</p>
        </article>
        <article>
          <span>02</span>
          <h2>She starts figuring you out.</h2>
          <p>Your choices change what Mara shows next. The P0 keeps this lightweight, local and correctable.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Her life keeps moving.</h2>
          <p>Work, plans, a gym decision and open loops create continuity without pretending Mara is a hidden real person.</p>
        </article>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">FIRST LIVING EXPERIENCE</p>
        <h2>Don’t read about Mara. Meet her.</h2>
        <Link href="/experience" className="primaryCta" onClick={() => track("hero_cta_click", { target: "first_living_experience", placement: "home_closing" })}>
          Start the P0
        </Link>
        <p className="disclosure">No real checkout, provider or persistent relationship database is active in this prototype.</p>
      </section>
    </main>
  );
}
