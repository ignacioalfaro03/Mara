"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./demand-marketplace.module.css";
import {
  aggregateDemandMarketplace,
  calculateDemandMetrics,
  DemandFulfillmentType,
  DemandIdea,
  findSimilarDemand,
  formatClp,
  fulfillmentLabel,
  isPhysicalDemand,
  PrivacyMode,
  seededDemandIdeas,
  stageLabel,
  wtpOptionsMinor,
} from "@/lib/demand-marketplace-lab";

type ProposalState = {
  title: string;
  city: string;
  category: string;
  description: string;
  worldLabel: string;
  fulfillmentType: DemandFulfillmentType;
  privacyMode: PrivacyMode;
};

const emptyProposal: ProposalState = {
  title: "",
  city: "Online",
  category: "Creator demand",
  description: "",
  worldLabel: "Mara World",
  fulfillmentType: "DIGITAL_PRODUCT",
  privacyMode: "PSEUDONYMOUS",
};

export default function DemandMarketplaceLab() {
  const [ideas, setIdeas] = useState<DemandIdea[]>(seededDemandIdeas);
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [pledged, setPledged] = useState<Record<string, boolean>>({});
  const [committed, setCommitted] = useState<Record<string, boolean>>({});
  const [hostInterest, setHostInterest] = useState<Record<string, boolean>>({});
  const [wtp, setWtp] = useState<Record<string, number>>({});
  const [proposal, setProposal] = useState<ProposalState>(emptyProposal);
  const [duplicate, setDuplicate] = useState<ReturnType<typeof findSimilarDemand>>(null);
  const [proposalMessage, setProposalMessage] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const summary = useMemo(() => aggregateDemandMarketplace(ideas), [ideas]);
  const worldOpportunities = useMemo(
    () =>
      ideas
        .filter((idea) => idea.worldLabel === "Mara World")
        .sort(
          (a, b) =>
            calculateDemandMetrics(b).verifiedDemandGmvMinor -
            calculateDemandMetrics(a).verifiedDemandGmvMinor,
        )
        .slice(0, 3),
    [ideas],
  );

  function recordHistory(message: string) {
    setHistory((current) => [message, ...current].slice(0, 8));
  }

  function joinIdea(id: string) {
    if (joined[id]) return;
    const idea = ideas.find((candidate) => candidate.id === id);
    setJoined((current) => ({ ...current, [id]: true }));
    setIdeas((current) =>
      current.map((candidate) =>
        candidate.id === id
          ? { ...candidate, interestedCount: candidate.interestedCount + 1 }
          : candidate,
      ),
    );
    if (idea) recordHistory(`WANT · Te sumaste a “${idea.title}”.`);
  }

  function pledgeIdea(id: string) {
    if (pledged[id]) return;
    const selectedWtp = wtp[id];
    if (!selectedWtp) return;

    const wasJoined = Boolean(joined[id]);
    const idea = ideas.find((candidate) => candidate.id === id);

    setJoined((current) => ({ ...current, [id]: true }));
    setPledged((current) => ({ ...current, [id]: true }));
    setIdeas((current) =>
      current.map((candidate) => {
        if (candidate.id !== id) return candidate;

        const matchingBucket = candidate.wtpBuckets.find(
          (bucket) => bucket.amountMinor === selectedWtp,
        );
        const nextBuckets = matchingBucket
          ? candidate.wtpBuckets.map((bucket) =>
              bucket.amountMinor === selectedWtp
                ? { ...bucket, count: bucket.count + 1 }
                : bucket,
            )
          : [...candidate.wtpBuckets, { amountMinor: selectedWtp, count: 1 }];

        return {
          ...candidate,
          interestedCount: candidate.interestedCount + (wasJoined ? 0 : 1),
          pledgedCount: candidate.pledgedCount + 1,
          wtpBuckets: nextBuckets,
        };
      }),
    );

    if (idea) {
      recordHistory(`PLEDGE · Declaraste ${formatClp(selectedWtp)} para “${idea.title}”.`);
    }
  }

  function commitIdea(id: string) {
    if (committed[id] || !pledged[id]) return;
    const selectedWtp = wtp[id];
    if (!selectedWtp) return;

    const idea = ideas.find((candidate) => candidate.id === id);
    setCommitted((current) => ({ ...current, [id]: true }));
    setIdeas((current) =>
      current.map((candidate) =>
        candidate.id === id
          ? { ...candidate, committedCount: candidate.committedCount + 1 }
          : candidate,
      ),
    );

    if (idea) {
      recordHistory(`COMMIT · Reforzaste tu intención para “${idea.title}”.`);
    }
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
      category: proposal.category.trim() || "Community demand",
      description:
        proposal.description.trim() ||
        "Nueva demanda propuesta por la comunidad en este laboratorio.",
      creatorLabel: proposal.worldLabel.trim() ? "Creator / World request" : null,
      worldLabel: proposal.worldLabel.trim() || null,
      origin: "COMMUNITY",
      fulfillmentType: proposal.fulfillmentType,
      privacyMode: proposal.privacyMode,
      stage: "IDEA",
      interestedCount: 1,
      pledgedCount: 0,
      committedCount: 0,
      targetCommitments: 30,
      capacityTarget: isPhysicalDemand(proposal.fulfillmentType) ? 50 : null,
      hostStatus: isPhysicalDemand(proposal.fulfillmentType) ? "NONE" : "NONE",
      wtpBuckets: [],
      tags: title.toLowerCase().split(/\s+/).filter(Boolean),
    };

    setIdeas((current) => [newIdea, ...current]);
    setJoined((current) => ({ ...current, [id]: true }));
    setProposal(emptyProposal);
    setDuplicate(null);
    setProposalMessage(forceVariant ? "Variante creada." : "Demanda publicada en el laboratorio.");
    recordHistory(`REQUEST_CREATED · Levantaste “${title}”.`);
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
        <p className={styles.eyebrow}>DEV · PRIVATE DEMAND NETWORK</p>
        <h1>¿Qué quieres que exista?</h1>
        <p className={styles.lede}>
          Pide un producto, una colaboración, una membresía o una experiencia. Otras personas pueden sumarse, declarar cuánto pagarían y convertir deseo disperso en una oportunidad económica visible. Todo aquí es sintético y local: no hay cobros, reservas ni Hosts reales.
        </p>
      </header>

      <section className={styles.summaryGrid} aria-label="Private demand network summary">
        <article><span>WANT / interesados</span><strong>{summary.interested}</strong></article>
        <article><span>Pledges</span><strong>{summary.pledged}</strong></article>
        <article><span>Commits sintéticos</span><strong>{summary.committed}</strong></article>
        <article><span>Verified Demand GMV</span><strong>{formatClp(summary.verifiedDemandGmvMinor)}</strong></article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>DISCOVER DEMAND</p>
            <h2>No todo tiene que existir antes de que alguien lo quiera.</h2>
          </div>
          <p>WANT mide interés. PLEDGE agrega willingness to pay. COMMIT representa una señal sintética más fuerte. No son equivalentes.</p>
        </div>

        <div className={styles.cardGrid}>
          {ideas.map((idea) => {
            const metrics = calculateDemandMetrics(idea);
            const selectedWtp = wtp[idea.id] ?? 0;
            const isJoined = Boolean(joined[idea.id]);
            const isPledged = Boolean(pledged[idea.id]);
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
                  <span>{idea.worldLabel ?? "Open network"}</span>
                  <span>{fulfillmentLabel(idea.fulfillmentType)}</span>
                </div>
                <div className={styles.metaRow}>
                  <span>{idea.creatorLabel ?? "Community-led"}</span>
                  <span>Privacy · {idea.privacyMode}</span>
                </div>

                <div className={styles.metrics}>
                  <div><span>Want</span><strong>{idea.interestedCount}</strong></div>
                  <div><span>Pledge</span><strong>{idea.pledgedCount}</strong></div>
                  <div><span>Commit</span><strong>{idea.committedCount}</strong></div>
                  <div><span>Avg. WTP</span><strong>{formatClp(metrics.averageWtpMinor)}</strong></div>
                </div>

                <div className={styles.progressWrap}>
                  <div className={styles.progressText}>
                    <span>Unlock progress</span>
                    <strong>{metrics.progressPercent}%</strong>
                  </div>
                  <div className={styles.progressTrack} aria-hidden="true">
                    <div className={styles.progressFill} style={{ width: `${metrics.progressPercent}%` }} />
                  </div>
                  <small>{Math.max(0, idea.targetCommitments - idea.committedCount)} commits to threshold · Verified GMV {formatClp(metrics.verifiedDemandGmvMinor)}</small>
                </div>

                <button
                  className={isJoined ? styles.secondaryButton : styles.primaryButton}
                  type="button"
                  onClick={() => joinIdea(idea.id)}
                  disabled={isJoined}
                >
                  {isJoined ? "WANT REGISTRADO" : "ME SUMO · WANT"}
                </button>

                <div className={styles.commitBox}>
                  <label htmlFor={`wtp-${idea.id}`}>¿Cuánto pagarías si esto existiera?</label>
                  <select
                    id={`wtp-${idea.id}`}
                    value={selectedWtp}
                    onChange={(event) =>
                      setWtp((current) => ({ ...current, [idea.id]: Number(event.target.value) }))
                    }
                    disabled={isPledged}
                  >
                    <option value={0}>Elige una señal</option>
                    {wtpOptionsMinor.map((amount) => (
                      <option key={amount} value={amount}>{formatClp(amount)}</option>
                    ))}
                  </select>
                  <div className={styles.inlineActions}>
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      disabled={!selectedWtp || isPledged}
                      onClick={() => pledgeIdea(idea.id)}
                    >
                      {isPledged ? "PLEDGE REGISTRADO" : "PLEDGE"}
                    </button>
                    <button
                      className={styles.commitButton}
                      type="button"
                      disabled={!isPledged || isCommitted}
                      onClick={() => commitIdea(idea.id)}
                    >
                      {isCommitted ? "COMMIT SIMULADO" : "COMMIT"}
                    </button>
                  </div>
                  <small>Estos botones no cobran dinero. PLEDGE y COMMIT solo modelan señales económicas distintas para el V2.</small>
                </div>

                {idea.stage === "HOST_WANTED" && isPhysicalDemand(idea.fulfillmentType) ? (
                  <div className={styles.hostBox}>
                    <div>
                      <span className={styles.kicker}>HOST WANTED · FUTURE SUPPLY</span>
                      <strong>Hay demanda física. Falta quien pueda ejecutarla.</strong>
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

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>CREATOR WORLD VIEW</p>
            <h2>What your World wants.</h2>
          </div>
          <p>La Creator deja de adivinar qué producir: ve demanda agregada y puede priorizar oportunidades por señal económica.</p>
        </div>
        <div className={styles.cardGrid}>
          {worldOpportunities.map((idea) => {
            const metrics = calculateDemandMetrics(idea);
            return (
              <article className={styles.card} key={`world-${idea.id}`}>
                <div className={styles.cardTopline}>
                  <span>{idea.worldLabel}</span>
                  <span className={styles.stage}>{stageLabel(idea.stage)}</span>
                </div>
                <h3>{idea.title}</h3>
                <p className={styles.description}>{fulfillmentLabel(idea.fulfillmentType)} · {idea.privacyMode}</p>
                <div className={styles.metrics}>
                  <div><span>Pledges</span><strong>{idea.pledgedCount}</strong></div>
                  <div><span>Commits</span><strong>{idea.committedCount}</strong></div>
                  <div><span>Pledged GMV</span><strong>{formatClp(metrics.pledgedGmvMinor)}</strong></div>
                  <div><span>Verified GMV</span><strong>{formatClp(metrics.verifiedDemandGmvMinor)}</strong></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.proposeSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>MAKE IT HAPPEN</p>
            <h2>Di qué quieres. No diseñes la operación.</h2>
          </div>
          <p>Mara debe estructurar la demanda por debajo. El usuario solo necesita expresar el resultado que quiere.</p>
        </div>

        <form className={styles.form} onSubmit={handleProposal}>
          <label className={styles.fullWidth}>
            ¿Qué quieres que exista?
            <input
              value={proposal.title}
              onChange={(event) => setProposal((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ej. Quiero una colección de audios de Mara"
              required
            />
          </label>
          <label>
            Mercado / ciudad
            <input
              value={proposal.city}
              onChange={(event) => setProposal((current) => ({ ...current, city: event.target.value }))}
              required
            />
          </label>
          <label>
            World
            <input
              value={proposal.worldLabel}
              onChange={(event) => setProposal((current) => ({ ...current, worldLabel: event.target.value }))}
              placeholder="Mara World"
            />
          </label>
          <label>
            Tipo
            <select
              value={proposal.fulfillmentType}
              onChange={(event) =>
                setProposal((current) => ({
                  ...current,
                  fulfillmentType: event.target.value as DemandFulfillmentType,
                }))
              }
            >
              <option value="DIGITAL_PRODUCT">Digital product</option>
              <option value="DIGITAL_EXPERIENCE">Digital experience</option>
              <option value="MEMBERSHIP">Membership</option>
              <option value="COLLAB">Collab</option>
              <option value="MERCH">Merch</option>
              <option value="PHYSICAL_EXPERIENCE">Physical experience</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </label>
          <label>
            Privacidad
            <select
              value={proposal.privacyMode}
              onChange={(event) =>
                setProposal((current) => ({
                  ...current,
                  privacyMode: event.target.value as PrivacyMode,
                }))
              }
            >
              <option value="PUBLIC">Public</option>
              <option value="PSEUDONYMOUS">Pseudonymous</option>
              <option value="PRIVATE">Private</option>
            </select>
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
              placeholder="Qué quieres, sin resolver producción, Creator, Host ni venue."
              rows={3}
            />
          </label>
          <button className={styles.primaryButton} type="submit">MAKE IT HAPPEN</button>
        </form>

        {duplicate ? (
          <div className={styles.duplicateBox} data-testid="duplicate-suggestion">
            <p className={styles.kicker}>YA HAY DEMANDA PARECIDA</p>
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

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>MY HISTORY · RETENTION PROOF</p>
            <h2>Tu participación deja huella.</h2>
          </div>
          <p>Este V2 guarda historia solo en estado local para demostrar el loop. No persiste datos de usuario.</p>
        </div>
        <div className={styles.cardGrid}>
          {history.length === 0 ? (
            <article className={styles.card}>
              <h3>Aún no hay historia local.</h3>
              <p className={styles.description}>Haz WANT, PLEDGE, COMMIT o crea demanda para ver cómo Mara puede convertir actividad en memoria y retorno.</p>
            </article>
          ) : (
            history.map((entry, index) => (
              <article className={styles.card} key={`${entry}-${index}`}>
                <p className={styles.description}>{entry}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={styles.guardrail}>
        <p className={styles.kicker}>V2 BOUNDARY</p>
        <h2>Demand first. Supply second.</h2>
        <p>
          Este laboratorio prueba demanda transversal, WANT/PLEDGE/COMMIT, World context, privacidad e historia local. No activa pagos, payouts, Creator licensing, contratos, QR, venue bookings, trabajo de Hosts, migraciones de base de datos ni fulfillment físico.
        </p>
      </section>
    </main>
  );
}
