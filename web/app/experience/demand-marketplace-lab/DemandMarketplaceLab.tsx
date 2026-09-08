"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./demand-marketplace.module.css";
import {
  aggregateDemandMarketplace,
  calculateDemandMetrics,
  DemandIdea,
  findSimilarDemand,
  formatClp,
  seededDemandIdeas,
  stageLabel,
  wtpOptionsMinor,
} from "@/lib/demand-marketplace-lab";

const emptyProposal = {
  title: "",
  city: "Chillán",
  category: "Social",
  description: "",
};

export default function DemandMarketplaceLab() {
  const [ideas, setIdeas] = useState<DemandIdea[]>(seededDemandIdeas);
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [committed, setCommitted] = useState<Record<string, boolean>>({});
  const [hostInterest, setHostInterest] = useState<Record<string, boolean>>({});
  const [wtp, setWtp] = useState<Record<string, number>>({});
  const [proposal, setProposal] = useState(emptyProposal);
  const [duplicate, setDuplicate] = useState<ReturnType<typeof findSimilarDemand>>(null);
  const [proposalMessage, setProposalMessage] = useState("");

  const summary = useMemo(() => aggregateDemandMarketplace(ideas), [ideas]);

  function joinIdea(id: string) {
    if (joined[id]) return;
    setJoined((current) => ({ ...current, [id]: true }));
    setIdeas((current) =>
      current.map((idea) =>
        idea.id === id ? { ...idea, interestedCount: idea.interestedCount + 1 } : idea,
      ),
    );
  }

  function commitIdea(id: string) {
    if (committed[id]) return;
    const selectedWtp = wtp[id];
    if (!selectedWtp) return;

    setJoined((current) => ({ ...current, [id]: true }));
    setCommitted((current) => ({ ...current, [id]: true }));
    setIdeas((current) =>
      current.map((idea) => {
        if (idea.id !== id) return idea;

        const wasJoined = Boolean(joined[id]);
        const matchingBucket = idea.wtpBuckets.find((bucket) => bucket.amountMinor === selectedWtp);
        const nextBuckets = matchingBucket
          ? idea.wtpBuckets.map((bucket) =>
              bucket.amountMinor === selectedWtp ? { ...bucket, count: bucket.count + 1 } : bucket,
            )
          : [...idea.wtpBuckets, { amountMinor: selectedWtp, count: 1 }];

        return {
          ...idea,
          interestedCount: idea.interestedCount + (wasJoined ? 0 : 1),
          committedCount: idea.committedCount + 1,
          wtpBuckets: nextBuckets,
        };
      }),
    );
  }

  function createProposal(forceVariant = false) {
    const title = proposal.title.trim();
    const city = proposal.city.trim();
    if (!title || !city) return;

    const match = findSimilarDemand(title, city, ideas);
    if (match && !forceVariant) {
      setDuplicate(match);
      setProposalMessage("");
      return;
    }

    const id = `user-${Date.now()}`;
    const newIdea: DemandIdea = {
      id,
      title,
      city,
      category: proposal.category.trim() || "Community",
      description:
        proposal.description.trim() || "Nueva demanda propuesta por la comunidad en este laboratorio.",
      creatorLabel: null,
      origin: "COMMUNITY",
      experienceType: "PHYSICAL",
      stage: "IDEA",
      interestedCount: 1,
      committedCount: 0,
      targetCommitments: 30,
      capacityTarget: 50,
      hostStatus: "NONE",
      wtpBuckets: [],
      tags: title.toLowerCase().split(/\s+/).filter(Boolean),
    };

    setIdeas((current) => [newIdea, ...current]);
    setJoined((current) => ({ ...current, [id]: true }));
    setProposal(emptyProposal);
    setDuplicate(null);
    setProposalMessage(forceVariant ? "Variante creada." : "Idea publicada en el laboratorio.");
  }

  function handleProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createProposal(false);
  }

  function joinDuplicate() {
    if (!duplicate) return;
    joinIdea(duplicate.idea.id);
    setProposal(emptyProposal);
    setProposalMessage(`Te sumaste a “${duplicate.idea.title}”.`);
    setDuplicate(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>DEV · DEMAND-TO-EXPERIENCE MARKETPLACE</p>
        <h1>¿Qué quieres que ocurra?</h1>
        <p className={styles.lede}>
          Mira lo que otras personas quieren hacer, súmate, declara cuánto pagarías o levanta una idea nueva. Todo en esta pantalla es sintético y local: no hay dinero real, reservas reales ni Hosts contratados.
        </p>
      </header>

      <section className={styles.summaryGrid} aria-label="Demand marketplace summary">
        <article><span>Personas interesadas</span><strong>{summary.interested}</strong></article>
        <article><span>Compromisos sintéticos</span><strong>{summary.committed}</strong></article>
        <article><span>Interest GMV</span><strong>{formatClp(summary.interestGmvMinor)}</strong></article>
        <article><span>Verified Demand GMV</span><strong>{formatClp(summary.verifiedDemandGmvMinor)}</strong></article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>DISCOVER DEMAND</p>
            <h2>La demanda se ve. La gente se suma.</h2>
          </div>
          <p>La métrica central no es el like: es cuánta intención económica real puede concentrarse alrededor de una experiencia.</p>
        </div>

        <div className={styles.cardGrid}>
          {ideas.map((idea) => {
            const metrics = calculateDemandMetrics(idea);
            const selectedWtp = wtp[idea.id] ?? 0;
            const isJoined = Boolean(joined[idea.id]);
            const isCommitted = Boolean(committed[idea.id]);
            const hostInterested = Boolean(hostInterest[idea.id]);

            return (
              <article className={styles.card} key={idea.id} data-testid={`demand-${idea.id}`}>
                <div className={styles.cardTopline}>
                  <span>{idea.city} · {idea.category}</span>
                  <span className={styles.stage}>{stageLabel(idea.stage)}</span>
                </div>

                <h3>{idea.title}</h3>
                <p className={styles.description}>{idea.description}</p>

                <div className={styles.metaRow}>
                  <span>{idea.creatorLabel ?? "Community-led"}</span>
                  <span>{idea.experienceType}</span>
                </div>

                <div className={styles.metrics}>
                  <div><span>Interested</span><strong>{idea.interestedCount}</strong></div>
                  <div><span>Committed</span><strong>{idea.committedCount}</strong></div>
                  <div><span>Avg. WTP</span><strong>{formatClp(metrics.averageWtpMinor)}</strong></div>
                  <div><span>Verified GMV</span><strong>{formatClp(metrics.verifiedDemandGmvMinor)}</strong></div>
                </div>

                <div className={styles.progressWrap}>
                  <div className={styles.progressText}>
                    <span>Unlock progress</span>
                    <strong>{metrics.progressPercent}%</strong>
                  </div>
                  <div className={styles.progressTrack} aria-hidden="true">
                    <div className={styles.progressFill} style={{ width: `${metrics.progressPercent}%` }} />
                  </div>
                  <small>{Math.max(0, idea.targetCommitments - idea.committedCount)} commitments to threshold</small>
                </div>

                <button
                  className={isJoined ? styles.secondaryButton : styles.primaryButton}
                  type="button"
                  onClick={() => joinIdea(idea.id)}
                  disabled={isJoined}
                >
                  {isJoined ? "YA ESTÁS DENTRO" : "ME SUMO"}
                </button>

                <div className={styles.commitBox}>
                  <label htmlFor={`wtp-${idea.id}`}>¿Cuánto pagarías?</label>
                  <select
                    id={`wtp-${idea.id}`}
                    value={selectedWtp}
                    onChange={(event) =>
                      setWtp((current) => ({ ...current, [idea.id]: Number(event.target.value) }))
                    }
                    disabled={isCommitted}
                  >
                    <option value={0}>Elige una señal</option>
                    {wtpOptionsMinor.map((amount) => (
                      <option key={amount} value={amount}>{formatClp(amount)}</option>
                    ))}
                  </select>
                  <button
                    className={styles.commitButton}
                    type="button"
                    disabled={!selectedWtp || isCommitted}
                    onClick={() => commitIdea(idea.id)}
                  >
                    {isCommitted ? "COMMIT SIMULADO" : "COMMIT"}
                  </button>
                  <small>Este botón no cobra dinero. Solo modela una señal verificable para el V1.</small>
                </div>

                {idea.stage === "HOST_WANTED" ? (
                  <div className={styles.hostBox}>
                    <div>
                      <span className={styles.kicker}>HOST WANTED</span>
                      <strong>Hay demanda. Falta quien la ejecute.</strong>
                    </div>
                    <button
                      type="button"
                      className={styles.hostButton}
                      onClick={() => setHostInterest((current) => ({ ...current, [idea.id]: true }))}
                      disabled={hostInterested}
                    >
                      {hostInterested ? "INTERÉS REGISTRADO" : "SOY HOST / ME INTERESA"}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.proposeSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>CREATE DEMAND</p>
            <h2>Aporta tu idea.</h2>
          </div>
          <p>No le pedimos al usuario que produzca un evento. Solo que diga qué quiere que exista.</p>
        </div>

        <form className={styles.form} onSubmit={handleProposal}>
          <label>
            ¿Qué quieres que ocurra?
            <input
              value={proposal.title}
              onChange={(event) => setProposal((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ej. Fiesta de máscaras de Mara"
              required
            />
          </label>
          <label>
            Ciudad
            <input
              value={proposal.city}
              onChange={(event) => setProposal((current) => ({ ...current, city: event.target.value }))}
              required
            />
          </label>
          <label>
            Categoría
            <input
              value={proposal.category}
              onChange={(event) => setProposal((current) => ({ ...current, category: event.target.value }))}
            />
          </label>
          <label className={styles.fullWidth}>
            Cuéntalo en una frase
            <textarea
              value={proposal.description}
              onChange={(event) => setProposal((current) => ({ ...current, description: event.target.value }))}
              placeholder="Qué imaginas, sin tener que resolver producción ni venue."
              rows={3}
            />
          </label>
          <button className={styles.primaryButton} type="submit">PROPONER EXPERIENCIA</button>
        </form>

        {duplicate ? (
          <div className={styles.duplicateBox} data-testid="duplicate-suggestion">
            <p className={styles.kicker}>YA HAY ALGO PARECIDO</p>
            <h3>{duplicate.idea.title} · {duplicate.idea.city}</h3>
            <p>Antes de fragmentar la demanda, Mara te propone concentrarla. Similitud estimada: {Math.round(duplicate.score * 100)}%.</p>
            <div className={styles.inlineActions}>
              <button type="button" className={styles.primaryButton} onClick={joinDuplicate}>SUMARME A ESTA</button>
              <button type="button" className={styles.secondaryButton} onClick={() => createProposal(true)}>CREAR VARIANTE</button>
            </div>
          </div>
        ) : null}

        {proposalMessage ? <p className={styles.message}>{proposalMessage}</p> : null}
      </section>

      <section className={styles.guardrail}>
        <p className={styles.kicker}>V1 BOUNDARY</p>
        <h2>Mara orquesta. Los Hosts ejecutan.</h2>
        <p>
          Este laboratorio prueba discovery, join, WTP, compromiso, deduplicación y Host interest. No activa pagos, payouts, contratos, venue bookings, migraciones de base de datos ni fulfillment físico.
        </p>
      </section>
    </main>
  );
}
