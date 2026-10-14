"use client";

import Link from "next/link";
import { useApp } from "../AppProvider";
import { StampImg } from "../StampImg";
import { GAMES, type GameId } from "@/lib/games";
import { Quiz } from "./Quiz";
import { Zodiac } from "./Zodiac";
import { Wishes } from "./Wishes";
import { Onsite } from "./Onsite";
import { Poetry } from "./Poetry";
import { Calligraphy } from "./Calligraphy";
import { Greetings } from "./Greetings";

export function GameView({ id }: { id: GameId }) {
  const { t, me } = useApp();
  const meta = GAMES.find((g) => g.id === id)!;
  const earned = me?.stamps.includes(id) ?? false;

  return (
    <div className="rise">
      <Link href="/explore" className="inline-flex min-h-11 items-center text-sm text-muted">
        ← {t("common.back")}
      </Link>
      <div className="mt-1 flex items-center gap-4">
        <StampImg id={id} earned={earned} size={64} alt={earned ? t("stamps.earned") : t("stamps.locked")} />
        <h1 className="font-serif text-2xl font-bold">{t(`game.${id}.name`)}</h1>
      </div>

      <div className="mt-5">
        {!meta.live && <p className="card p-5 text-muted">{t("common.comingSoon")}</p>}
        {meta.live && id === "culture-quiz" && <Quiz />}
        {meta.live && id === "zodiac" && <Zodiac />}
        {meta.live && id === "wishes" && <Wishes />}
        {meta.live && id === "poetry" && <Poetry />}
        {meta.live && id === "calligraphy" && <Calligraphy />}
        {meta.live && id === "greetings" && <Greetings />}
        {meta.live && meta.kind === "onsite" && <Onsite id={id} />}
      </div>
    </div>
  );
}
