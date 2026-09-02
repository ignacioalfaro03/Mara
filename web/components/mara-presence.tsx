"use client";

import { useState } from "react";

const MARA_IMAGE_URL = process.env.NEXT_PUBLIC_MARA_HERO_IMAGE?.trim();
const MARA_VOICE_URL = process.env.NEXT_PUBLIC_MARA_VOICE_URL?.trim();

function MaraImage({ className, compact = false, label }: { className: string; compact?: boolean; label: string }) {
  const [failed, setFailed] = useState(false);

  if (MARA_IMAGE_URL && !failed) {
    return (
      <div className={className} aria-label={label} style={{ padding: 0, overflow: "hidden" }}>
        <img
          src={MARA_IMAGE_URL}
          alt={label}
          loading={compact ? "lazy" : "eager"}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", minHeight: "inherit", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div className={className} aria-label={label}>
      <span>M</span>
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
