"use client";

import { useEffect } from "react";
import { useApp } from "../AppProvider";
import type { GameId } from "@/lib/games";

export function Onsite({ id }: { id: GameId }) {
  const { t, me, refresh } = useApp();
  const earned = me?.stamps.includes(id) ?? false;

  // Staff confirm on their own device, so poll until the stamp shows up.
  useEffect(() => {
    if (earned) return;
    const timer = setInterval(refresh, 4000);
    return () => clearInterval(timer);
  }, [earned, refresh]);

  if (!me) return null;

  return (
    <section className="card p-6 text-center">
      {earned ? (
        <p className="font-serif text-xl font-bold text-cinnabar">{t("onsite.earned")}</p>
      ) : (
        <>
          <p className="leading-relaxed">{t(`onsite.how.${id as "pitch-pot" | "handcraft"}`)}</p>
          <p className="mt-5 text-sm text-muted">{t("onsite.showCode")}</p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-[0.3em]">{me.shortCode}</p>
          <button className="btn btn-ghost mt-5" onClick={refresh}>
            {t("onsite.refresh")}
          </button>
        </>
      )}
    </section>
  );
}
