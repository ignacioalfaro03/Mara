"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { MaraHeroVisual } from "@/components/mara-presence";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroMedia" aria-label="Mara Vera">
          <MaraHeroVisual />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">MEET MARA VERA</p>
          <h1>You don’t need another AI. You want someone worth coming back to.</h1>
          <p className="lede">
            Mara Vera is a synthetic virtual character with her own taste, point of view, life and a way of figuring you out while you interact.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta" onClick={() => track("hero_cta_click", { target: "launch_experience" })}>
              Enter Mara
            </Link>
            <Link href="/meet-mara" className="textCta">Meet Mara</Link>
          </div>
          <p className="disclosure">AI-generated character · Adults only · Early access</p>
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
          <p>Your choices change what happens next, without forcing you through a giant profile or configuration screen.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Her life keeps moving.</h2>
          <p>Work, plans and unfinished moments create continuity without pretending Mara is a hidden real person.</p>
        </article>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">EARLY ACCESS</p>
        <h2>Don’t read about Mara. Meet her.</h2>
        <Link href="/experience" className="primaryCta" onClick={() => track("hero_cta_click", { target: "launch_experience", placement: "home_closing" })}>
          Enter Mara
        </Link>
        <p className="disclosure">Mara is evolving. The first public experience is intentionally small, personal and text-first.</p>
      </section>
    </main>
  );
}
