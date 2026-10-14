"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useApp } from "@/components/AppProvider";
import { StampImg } from "@/components/StampImg";
import { GAMES, STAMPS_REQUIRED } from "@/lib/games";

export default function Stamps() {
  const { me, t, refresh } = useApp();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!me) return null;
  const n = me.stamps.length;
  const live = GAMES.filter((g) => g.live);

  return (
    <div className="rise">
      <h1 className="font-serif text-2xl font-bold">{t("stamps.title")}</h1>

      <section className="card mt-4 p-5 text-center">
        <p className="font-serif text-4xl font-bold text-cinnabar">
          {t("stamps.progress", { n: Math.min(n, STAMPS_REQUIRED), goal: STAMPS_REQUIRED })}
        </p>
        <p className="mt-2 text-sm text-muted">
          {me.eligible ? t("stamps.ready") : t("stamps.need", { n: STAMPS_REQUIRED - n })}
        </p>
        {me.eligible && (
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/redeem" className="btn btn-primary">
              {t("stamps.goRedeem")}
            </Link>
            <Link href="/souvenir" className="btn btn-ghost">
              {t("souv.link")}
            </Link>
          </div>
        )}
      </section>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {live.map((g) => {
          const earned = me.stamps.includes(g.id);
          return (
            <li key={g.id}>
              <Link
                href={`/games/${g.id}`}
                className="card flex h-full flex-col items-center gap-2 p-4 text-center"
              >
                <StampImg id={g.id} earned={earned} size={96} alt="" />
                <span className="font-serif font-bold">{t(`game.${g.id}.name`)}</span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs ${
                    earned ? "bg-cinnabar text-[#fffaf0]" : "bg-cream text-muted ring-1 ring-muted/30"
                  }`}
                >
                  {earned ? `✓ ${t("stamps.earned")}` : t("stamps.locked")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="card mt-5 p-5 text-center">
        <p className="text-sm text-muted">{t("stamps.myCode")}</p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-[0.3em]">{me.shortCode}</p>
        <p className="mt-2 text-xs text-muted">{t("stamps.codeHint")}</p>
      </section>
    </div>
  );
}
