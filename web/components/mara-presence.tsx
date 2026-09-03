"use client";

import { useState } from "react";

const DEFAULT_MARA_IMAGE_URL = "/mara/mara-v1-reference.jpg";
const DEFAULT_MARA_IMAGE_VERSION = "1c4c4d3";
const ENV_MARA_IMAGE_URL = process.env.NEXT_PUBLIC_MARA_HERO_IMAGE?.trim();
const MARA_VOICE_URL = process.env.NEXT_PUBLIC_MARA_VOICE_URL?.trim();
const MAX_IMAGE_ATTEMPTS = 3;

function imageUrlForAttempt(attempt: number) {
  const base = ENV_MARA_IMAGE_URL || DEFAULT_MARA_IMAGE_URL;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}mara_v=${DEFAULT_MARA_IMAGE_VERSION}&retry=${attempt}`;
}

function MaraImage({ className, compact = false, label }: { className: string; compact?: boolean; label: string }) {
  const [attempt, setAttempt] = useState(0);
  const failed = attempt >= MAX_IMAGE_ATTEMPTS;

  if (!failed) {
    const src = imageUrlForAttempt(attempt);
    return (
      <div className={className} aria-label={label} style={{ padding: 0, overflow: "hidden" }}>
        <img
          key={src}
          src={src}
          alt={label}
          width={1024}
          height={1536}
          loading="eager"
          decoding="async"
          fetchPriority={compact ? "auto" : "high"}
          data-mara-image-attempt={attempt}
          onError={() => {
            window.setTimeout(() => setAttempt((current) => current + 1), 250 * (attempt + 1));
          }}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "inherit",
            objectFit: "cover",
            objectPosition: compact ? "50% 28%" : "50% 34%",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div className={className} aria-label={`${label} · imagen temporalmente no disponible`}>
      <span>MARA</span>
    </div>
  );
}

export function MaraHeroVisual() {
  return <MaraImage className="mediaFrame" label="Mara Vera" />;
}

export function MaraPortrait({ compact = false, label = "Mara Vera" }: { compact?: boolean; label?: string }) {
  const className = compact ? "livingPortrait livingPortraitCompact" : "livingPortrait";
  return <MaraImage className={className} compact={compact} label={label} />;
}

export function MaraVoiceMoment({ transcript }: { transcript: string }) {
  if (!MARA_VOICE_URL) {
    return <div className="maraMessage">{transcript}</div>;
  }

  return (
    <div className="voiceNote">
      <div className="voiceAvatar" aria-hidden="true">M</div>
      <div style={{ flex: 1 }}>
        <audio controls preload="metadata" src={MARA_VOICE_URL} style={{ width: "100%" }}>
          Tu navegador no puede reproducir este audio.
        </audio>
        <details>
          <summary>Texto</summary>
          <p className="voiceTranscript">{transcript}</p>
        </details>
      </div>
    </div>
  );
}
