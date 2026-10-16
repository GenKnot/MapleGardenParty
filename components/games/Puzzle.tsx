"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";

type View = { file: string; aspect: string; perm: number[]; hasStamp: boolean };
type Done = { title: string; note: string };

const N = 3;

export function Puzzle() {
  const { t, locale, refresh } = useApp();
  const [view, setView] = useState<View | null>(null);
  const [perm, setPerm] = useState<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [peek, setPeek] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [error, setError] = useState<"net" | "verify" | null>(null);
  const [moves, setMoves] = useState(0);
  const swaps = useRef<[number, number][]>([]);

  const apply = (v: View) => {
    setView(v);
    setPerm(v.perm);
    setSel(null);
    setDone(null);
    swaps.current = [];
    setMoves(0);
  };

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/games/puzzle?locale=${locale}`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      apply(await r.json());
      setError(null);
    } catch {
      setError("net");
    }
  }, [locale]);

  useEffect(() => {
    load();
    // the board is dealt once per visit; changing language must not reshuffle it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function restart() {
    try {
      const r = await fetch("/api/games/puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restart", locale }),
      });
      if (!r.ok) throw new Error();
      apply(await r.json());
      setError(null);
    } catch {
      setError("net");
    }
  }

  async function finish() {
    try {
      const r = await fetch("/api/games/puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", swaps: swaps.current, locale }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      if (!j.solved) return setError("verify");
      setDone({ title: j.title, note: j.note });
      setError(null);
      refresh();
    } catch {
      setError("verify");
    }
  }

  function tap(i: number) {
    if (done) return;
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    const next = [...perm];
    [next[sel], next[i]] = [next[i], next[sel]];
    swaps.current.push([sel, i]);
    setMoves(swaps.current.length);
    setPerm(next);
    setSel(null);
    if (next.every((tile, pos) => tile === pos)) finish();
  }

  if (error === "net" && !view) {
    return (
      <div role="alert" className="card p-5 text-center">
        <p className="text-cinnabar">{t("common.error")}</p>
        <button className="btn btn-ghost mt-3" onClick={load}>
          {t("common.retry")}
        </button>
      </div>
    );
  }
  if (!view) return <p className="text-muted">{t("common.loading")}</p>;

  const art = { backgroundImage: `url(${view.file})` };

  return (
    <section className="space-y-4">
      <div className="card p-5">
        <p className="text-sm text-muted">{t("puzzle.rules")}</p>
        {!done && (
          <p className="mt-2 text-sm font-medium text-cinnabar" aria-live="polite">
            {t("puzzle.moves", { n: moves })}
          </p>
        )}

        {peek && !done && (
          <div
            className="mx-auto mt-3 w-28 rounded-lg border border-gold/60 bg-cover bg-center"
            style={{ ...art, aspectRatio: view.aspect }}
            role="img"
            aria-label={t("puzzle.peek")}
          />
        )}

        <div
          className="relative mx-auto mt-4 grid w-full max-w-sm gap-0.5 overflow-hidden rounded-xl bg-gold/40 p-0.5"
          style={{ aspectRatio: view.aspect, gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)` }}
        >
          {perm.map((tile, pos) => (
            <button
              key={pos}
              onClick={() => tap(pos)}
              disabled={!!done}
              aria-pressed={sel === pos}
              aria-label={t("puzzle.tile", { n: pos + 1 })}
              className={`relative rounded-[3px] bg-no-repeat outline-offset-[-3px] transition ${
                sel === pos ? "z-10 outline outline-[3px] outline-cinnabar" : ""
              }`}
              style={{
                ...art,
                backgroundSize: `${N * 100}% ${N * 100}%`,
                backgroundPosition: `${((tile % N) * 100) / (N - 1)}% ${(Math.floor(tile / N) * 100) / (N - 1)}%`,
              }}
            />
          ))}
        </div>

        {!done && (
          <div className="mt-4 flex gap-3">
            <button className="btn btn-ghost flex-1" onClick={() => setPeek((p) => !p)} aria-pressed={peek}>
              {peek ? t("puzzle.peekHide") : t("puzzle.peek")}
            </button>
            <button className="btn btn-ghost flex-1" onClick={restart}>
              {t("puzzle.restart")}
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-cinnabar">
            {error === "net" ? t("common.error") : t("puzzle.error")}
          </p>
        )}
      </div>

      {done && (
        <section className="card rise p-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-cinnabar">{t("puzzle.doneTitle")}</h2>
          <p className="mt-3 font-serif text-lg font-bold">{done.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">{done.note}</p>
          <p className="mt-4 font-medium text-gold-deep">{t("puzzle.doneBody")}</p>
          <Link href="/stamps" className="btn btn-primary mt-4">
            {t("quiz.toStamps")}
          </Link>
        </section>
      )}
    </section>
  );
}
