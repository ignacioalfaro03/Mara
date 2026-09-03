"use client";

import Image from "next/image";
import { useState } from "react";
import { canonicalMaraImage } from "@/lib/mara-media-content";

export function MaraMediaStage({ videoSrc }: { videoSrc?: string }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const shouldShowVideo = Boolean(videoSrc) && !videoFailed;

  return (
    <div className="maraMediaStage" aria-label="Mara Vera ahora">
      {shouldShowVideo ? (
        <video
          className="maraMediaVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={canonicalMaraImage}
          onError={() => setVideoFailed(true)}
        >
          <source src={videoSrc} />
        </video>
      ) : (
        <Image
          className="maraMediaFallback"
          src={canonicalMaraImage}
          alt="Mara Vera"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 55vw"
        />
      )}

      <div className="maraMediaShade" />
      <div className="maraMediaNow">
        <span className="maraMediaDot" aria-hidden="true" />
        <span>AHORA · ANTES DE SALIR</span>
      </div>
      <p className="maraMediaWhisper">“Ya cambié de idea dos veces.”</p>
    </div>
  );
}
