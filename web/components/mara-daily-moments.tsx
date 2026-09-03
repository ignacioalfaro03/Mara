"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { canonicalMaraImage, maraMoments, type MaraMoment } from "@/lib/mara-media-content";

const storageKey = "mara_public_moment_choices_v1";

type StoredChoice = {
  momentId: string;
  choiceId: string;
  at: string;
};

function rememberChoice(momentId: string, choiceId: string) {
  try {
    const current = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as StoredChoice[];
    const withoutSameMoment = current.filter((item) => item.momentId !== momentId);
    const next = [...withoutSameMoment, { momentId, choiceId, at: new Date().toISOString() }].slice(-20);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // The experience still works if local storage is unavailable.
  }
}

function MomentMedia({ moment }: { moment: MaraMoment }) {
  const [failed, setFailed] = useState(false);
  const canPlayVideo = moment.mediaKind === "video" && Boolean(moment.mediaSrc) && !failed;
  const canPlayVoice = moment.mediaKind === "voice" && Boolean(moment.mediaSrc) && !failed;

  if (canPlayVideo) {
    return (
      <video
        className="dailyMomentMedia"
        muted
        loop
        playsInline
        controls
        preload="metadata"
        poster={moment.poster || canonicalMaraImage}
        onError={() => setFailed(true)}
      >
        <source src={moment.mediaSrc} />
      </video>
    );
  }

  return (
    <div className="dailyMomentStill">
      <Image
        src={moment.poster || canonicalMaraImage}
        alt="Mara Vera"
        fill
        sizes="(max-width: 800px) 100vw, 50vw"
        style={{ objectPosition: moment.imagePosition || "50% 35%" }}
      />
      <div className="dailyMomentStillShade" />
      {moment.mediaKind === "video" ? <span className="formatBadge">CLIP</span> : null}
      {moment.mediaKind === "voice" ? (
        <div className="voiceTeaserBadge">
          <span>{canPlayVoice ? "▶" : "VOICE NOTE"}</span>
          <strong>{canPlayVoice ? "Tócala para escuchar" : "La voz entra cuando el momento lo pide."}</strong>
          {canPlayVoice ? (
            <audio controls preload="none" onError={() => setFailed(true)}>
              <source src={moment.mediaSrc} />
            </audio>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function MaraDailyMoments() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const visibleMoments = useMemo(() => maraMoments, []);

  function choose(moment: MaraMoment, choiceId: string) {
    setAnswers((current) => ({ ...current, [moment.id]: choiceId }));
    rememberChoice(moment.id, choiceId);
  }

  return (
    <section className="dailyMomentsSection" aria-labelledby="daily-moments-title">
      <div className="dailyMomentsIntro">
        <p className="eyebrow">HOY CON MARA</p>
        <h2 id="daily-moments-title">No llegas a una pantalla. Llegas a su día.</h2>
        <p>
          Café, gym, una Story, un audio a medio mandar. No todo tiene que ser una gran conversación: a veces basta con llegar en el momento justo.
        </p>
      </div>

      <div className="dailyMomentsGrid">
        {visibleMoments.map((moment) => {
          const selected = answers[moment.id];
          const reaction = moment.choices?.find((choice) => choice.id === selected)?.reaction;

          return (
            <article className="dailyMomentCard" key={moment.id}>
              <div className="dailyMomentMediaWrap">
                <MomentMedia moment={moment} />
              </div>
              <div className="dailyMomentBody">
                <div className="dailyMomentMeta">
                  <span>{moment.time}</span>
                  <span>{moment.eyebrow}</span>
                </div>
                <h3>{moment.title}</h3>
                <p>{moment.body}</p>

                {moment.choices && !selected ? (
                  <div className="dailyMomentChoices" aria-label={`Decidir en ${moment.title}`}>
                    {moment.choices.map((choice) => (
                      <button key={choice.id} type="button" onClick={() => choose(moment, choice.id)}>
                        {choice.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                {reaction ? (
                  <div className="dailyMomentReaction" role="status">
                    <span>MARA</span>
                    <strong>“{reaction}”</strong>
                    <button type="button" onClick={() => setAnswers((current) => ({ ...current, [moment.id]: "" }))}>
                      Cambiar
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <p className="dailyMomentsPrivacy">
        Estas decisiones quedan locales en esta Alpha. Guardamos la acción; no inventamos una identidad a partir de ella.
      </p>
    </section>
  );
}
