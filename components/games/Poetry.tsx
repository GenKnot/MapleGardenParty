"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";

type Option = { id: string; verse: string; gloss: string | null; poet: string };
type View = {
  total: number;
  doneCount: number;
  hasStamp: boolean;
  current: { id: string; file: string; title: string; attempts: number; hint: string | null; options: Option[] } | null;
};
type Result = {
  right: boolean;
  finished: boolean;
  hint: string | null;
  reveal: { verse: Option; explain: string } | null;
  complete: boolean;
  doneCount: number;
};

export function Poetry() {
  const { t, locale, refresh } = useApp();
  const [v, setV] = useState<View | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/games/poetry?locale=${locale}`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      setV(await r.json());
      setError(false);
    } catch {
      setError(true);
    }
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (res) feedbackRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [res]);

  async function pick(paintingId: string, choice: string) {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const r = await fetch("/api/games/poetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paintingId, choice, locale }),
      });
      if (!r.ok) throw new Error();
      const j: Result = await r.json();
      setRes(j);
      if (!j.right) setWrong((w) => [...w, choice]);
      if (j.complete) refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function next() {
    setRes(null);
    setWrong([]);
    await load();
  }

  if (error && !v) {
    return (
      <div role="alert" className="card p-5 text-center">
        <p className="text-cinnabar">{t("common.error")}</p>
        <button className="btn btn-ghost mt-3" onClick={load}>
          {t("common.retry")}
        </button>
      </div>
    );
  }
  if (!v) return <p className="text-muted">{t("common.loading")}</p>;

  const cur = v.current;
  const finishedAll = !cur && !res;

  if (finishedAll) {
    return (
      <section className="card p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-cinnabar">{t("poetry.doneTitle")}</h2>
        <p className="mt-3">{t("poetry.doneBody")}</p>
        <Link href="/stamps" className="btn btn-primary mt-5">
          {t("quiz.toStamps")}
        </Link>
      </section>
    );
  }

  // While feedback is shown the server may already have advanced; keep showing the painting that was answered.
  const painting = cur ?? { id: "", file: "", title: "", attempts: 0, hint: null, options: [] as Option[] };
  const hint = res?.hint ?? cur?.hint ?? null;
  const revealedId = res?.reveal?.verse.id;

  return (
    <section>
      <p className="mb-2 text-sm text-muted">{t("poetry.rules")}</p>
      <p className="mb-3 text-sm font-medium text-cinnabar">
        {t("poetry.progress", { n: res?.doneCount ?? v.doneCount, goal: v.total })}
      </p>

      <div className="card overflow-hidden">
        {painting.file && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={painting.file} alt={painting.title} className="aspect-square w-full object-cover object-[50%_40%]" />
        )}
        <div className="p-5">
          <h2 className="font-serif text-xl font-bold">{t("poetry.pick")}</h2>
          {hint && !res?.finished && (
            <p role="status" className="mt-2 rounded-xl bg-cream p-3 text-sm">
              <span className="font-medium text-gold-deep">{t("poetry.hintLabel")}：</span>
              {hint}
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {painting.options.map((o) => {
              const state =
                revealedId === o.id ? "right" : wrong.includes(o.id) ? "wrong" : undefined;
              return (
                <li key={o.id}>
                  <button
                    className="option !rounded-2xl !py-3"
                    data-state={state}
                    disabled={busy || !!res?.finished || wrong.includes(o.id)}
                    onClick={() => pick(painting.id, o.id)}
                  >
                    <span className="flex-1">
                      <span className="block font-serif text-[17px] leading-relaxed">{o.verse}</span>
                      {o.gloss && <span className="mt-0.5 block text-sm text-muted">{o.gloss}</span>}
                      <span className="mt-0.5 block text-xs text-gold-deep">{o.poet}</span>
                    </span>
                    {state === "right" && <span aria-label="✓">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {res && (
            <div ref={feedbackRef} className="rise mt-5 rounded-xl bg-cream p-4">
              {res.right ? (
                <p className="font-bold text-[#3f7d4f]">{t("poetry.right")}</p>
              ) : res.finished ? (
                <p className="font-bold text-cinnabar">{t("poetry.revealed")}</p>
              ) : (
                <p className="font-bold text-cinnabar">{t("poetry.retry")}</p>
              )}
              {res.finished && res.reveal && (
                <p className="mt-2 text-sm leading-relaxed text-ink/85">{res.reveal.explain}</p>
              )}
              {res.finished &&
                (res.complete ? (
                  <Link href="/stamps" className="btn btn-primary mt-4 w-full">
                    {t("poetry.doneBody")} · {t("quiz.toStamps")}
                  </Link>
                ) : (
                  <button className="btn btn-primary mt-4 w-full" onClick={next}>
                    {t("poetry.next")}
                  </button>
                ))}
              {!res.finished && (
                <button className="btn btn-ghost mt-3 w-full" onClick={() => setRes(null)}>
                  {t("common.retry")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-cinnabar">
          {t("common.error")}
        </p>
      )}
    </section>
  );
}
