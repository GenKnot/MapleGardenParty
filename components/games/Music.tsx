"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";
import { RoundGame } from "./RoundGame";

type State = "idle" | "playing" | "ended" | "error";

// Sound only starts from a tap, and the animated bars give a visual cue that something is playing.
function AudioClip({ src }: { src: string }) {
  const { t } = useApp();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );

  async function toggle() {
    if (!audio.current) {
      const a = new Audio(src);
      a.onended = () => setState("ended");
      a.onerror = () => setState("error");
      audio.current = a;
    }
    const a = audio.current;
    if (state === "playing") {
      a.pause();
      a.currentTime = 0;
      setState("idle");
      return;
    }
    a.currentTime = 0;
    try {
      await a.play();
      setState("playing");
    } catch {
      setState("error");
    }
  }

  const label = state === "playing" ? t("music.playing") : state === "idle" ? t("music.play") : t("music.replay");

  return (
    <div className="grid place-items-center rounded-2xl bg-cream px-4 py-6">
      <button
        onClick={toggle}
        aria-pressed={state === "playing"}
        className="grid h-24 w-24 place-items-center rounded-full bg-cinnabar text-[#fffaf0] shadow-lg transition active:scale-95"
      >
        {state === "playing" ? (
          <span className="eq flex h-8 items-end gap-1" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
          </svg>
        )}
        <span className="sr-only">{label}</span>
      </button>
      <p role="status" className="mt-3 text-sm font-medium text-ink/80">
        {state === "error" ? <span className="text-cinnabar">{t("music.audioError")}</span> : label}
      </p>
    </div>
  );
}

export function Music() {
  const { t } = useApp();
  return (
    <>
      <RoundGame
        endpoint="/api/games/music"
        rulesKey="music.rules"
        passedKey="music.passedBody"
        failedKey="music.failedBody"
        renderMedia={(q) => <AudioClip src={q.media.audio} />}
      />
      <p className="mt-4 text-center">
        <Link href="/credits" className="inline-flex min-h-11 items-center text-sm text-muted underline">
          {t("music.credits")}
        </Link>
      </p>
    </>
  );
}
