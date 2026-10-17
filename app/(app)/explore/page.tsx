"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { StampImg } from "@/components/StampImg";
import { HAS_ONSITE, STAMPS_REQUIRED, VISIBLE_GAMES } from "@/lib/games";

type Filter = "all" | "online" | "onsite";

export default function Explore() {
  const { me, t } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  if (!me) return null;

  const n = Math.min(me.stamps.length, STAMPS_REQUIRED);
  const list = VISIBLE_GAMES.filter((g) => filter === "all" || g.kind === filter);
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("explore.all") },
    { id: "online", label: t("explore.online") },
    { id: "onsite", label: t("explore.onsite") },
  ];

  return (
    <div className="rise">
      <section className="card p-5">
        <h1 className="font-serif text-2xl font-bold">{t("explore.hello", { name: me.nickname })}</h1>
        <p className="mt-1 text-sm text-muted">{t("explore.howto", { goal: STAMPS_REQUIRED })}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: STAMPS_REQUIRED }, (_, i) => (
              <span
                key={i}
                className={`h-3 w-10 rounded-full ${i < n ? "bg-cinnabar" : "bg-cream ring-1 ring-gold/60"}`}
              />
            ))}
          </div>
          <p className="text-sm font-medium">{t("explore.progress", { n, goal: STAMPS_REQUIRED })}</p>
        </div>
        {me.eligible && (
          <Link href="/redeem" className="btn btn-primary mt-4 w-full">
            {t("stamps.goRedeem")}
          </Link>
        )}
      </section>

      {HAS_ONSITE && (
        <div role="group" className="mt-5 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-11 rounded-full border px-5 text-sm font-medium ${
                filter === f.id ? "border-ink bg-ink text-paper" : "border-gold/70 bg-paper"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {list.map((g) => {
          const done = me.stamps.includes(g.id);
          const inner = (
            <>
              <StampImg id={g.id} earned={done} size={72} alt="" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-lg font-bold">{t(`game.${g.id}.name`)}</h2>
                </div>
                <p className="mt-1 text-sm text-muted">{t(`game.${g.id}.desc`)}</p>
                <p className="mt-2 flex gap-2 text-xs">
                  <span className="rounded-full bg-cream px-2 py-0.5 text-gold-deep ring-1 ring-gold/50">
                    {g.kind === "online" ? t("tag.online") : t("tag.onsite")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      done
                        ? "bg-cinnabar text-[#fffaf0]"
                        : g.live
                          ? "bg-ink text-paper"
                          : "bg-cream text-muted ring-1 ring-muted/30"
                    }`}
                  >
                    {done ? t("tag.done") : g.live ? t("tag.play") : t("tag.soon")}
                  </span>
                </p>
              </div>
            </>
          );
          return (
            <li key={g.id}>
              {g.live ? (
                <Link href={`/games/${g.id}`} className="card flex min-h-28 items-center gap-4 p-4 transition hover:bg-cream">
                  {inner}
                </Link>
              ) : (
                <div aria-disabled="true" className="card flex min-h-28 items-center gap-4 p-4 opacity-60">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
