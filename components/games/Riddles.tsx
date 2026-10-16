"use client";

import { useState } from "react";
import { useApp } from "../AppProvider";
import { RoundGame } from "./RoundGame";

// Shows public/riddles/<id>.png when it exists, otherwise the emoji placeholder.
function ClueImage({ emoji, image, alt }: { emoji: string; image: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div role="img" aria-label={alt} className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-cream">
      {!loaded && (
        <span aria-hidden className="select-none text-7xl leading-none">
          {emoji}
        </span>
      )}
      <picture>
        <source srcSet={image.replace(/\.png$/, ".webp")} type="image/webp" />
        <img
          src={image}
          alt=""
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-contain ${loaded ? "" : "opacity-0"}`}
        />
      </picture>
    </div>
  );
}

export function Riddles() {
  const { t } = useApp();
  return (
    <RoundGame
      endpoint="/api/games/riddles"
      rulesKey="riddles.rules"
      passedKey="riddles.passedBody"
      failedKey="riddles.failedBody"
      renderMedia={(q) => <ClueImage emoji={q.media.emoji} image={q.media.image} alt={t("riddles.clueAlt")} />}
    />
  );
}
