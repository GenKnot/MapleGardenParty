"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";

type View =
  | { phase: "intro"; hasStamp: boolean; passScore: number; total: number }
  | { phase: "passed"; hasStamp: boolean; correct: number; passScore: number; total: number }
  | { phase: "failed"; hasStamp: boolean; correct: number; passScore: number; total: number }
  | {
      phase: "question";
      hasStamp: boolean;
      correct: number;
      passScore: number;
      total: number;
      n: number;
      question: { id: number; q: string; o: string[] };
      feedback?: { chosen: number; right: boolean; correctIndex: number; explanation: string };
    };

export function Quiz() {
  const { t, locale, refresh } = useApp();
  const [v, setV] = useState<View | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const fbRef = useRef<HTMLDivElement>(null);
  const hasFeedback = v?.phase === "question" && !!v.feedback;

  useEffect(() => {
    if (hasFeedback) fbRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [hasFeedback]);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/games/culture-quiz?locale=${locale}`, { cache: "no-store" });
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

  async function act(payload: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const r = await fetch("/api/games/culture-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      if (!r.ok) throw new Error();
      const next: View = await r.json();
      setV(next);
      if (next.hasStamp) refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
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

  if (v.phase === "intro") {
    return (
      <section className="card p-6">
        <p>{t("quiz.rules")}</p>
        {v.hasStamp && <p className="mt-3 text-sm text-gold-deep">{t("quiz.alreadyHave")}</p>}
        <button className="btn btn-primary mt-5 w-full" disabled={busy} onClick={() => act({ action: "start" })}>
          {t("quiz.start")}
        </button>
      </section>
    );
  }

  if (v.phase === "passed" || v.phase === "failed") {
    const passed = v.phase === "passed";
    return (
      <section className="card p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-cinnabar">
          {passed ? t("quiz.passedTitle") : t("quiz.failedTitle")}
        </h2>
        <p className="mt-3">
          {passed ? t("quiz.passedBody", { n: v.correct }) : t("quiz.failedBody", { n: v.correct })}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {passed && (
            <Link href="/stamps" className="btn btn-primary">
              {t("quiz.toStamps")}
            </Link>
          )}
          <button className={`btn ${passed ? "btn-ghost" : "btn-primary"}`} disabled={busy} onClick={() => act({ action: "start" })}>
            {t("quiz.restart")}
          </button>
        </div>
      </section>
    );
  }

  const fb = v.feedback;
  return (
    <section aria-live="polite">
      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span>{t("quiz.question", { n: v.n, total: v.total })}</span>
        <span className="font-medium text-cinnabar">{t("quiz.progress", { n: v.correct, goal: v.passScore })}</span>
      </div>
      <div className="card p-5">
        <h2 className="font-serif text-xl font-bold leading-relaxed">{v.question.q}</h2>
        <ul className="mt-5 space-y-3">
          {v.question.o.map((text, i) => {
            const state = !fb ? undefined : i === fb.correctIndex ? "right" : i === fb.chosen ? "wrong" : undefined;
            return (
              <li key={i}>
                <button
                  className="option"
                  data-state={state}
                  disabled={busy || !!fb}
                  onClick={() => act({ action: "answer", choice: i })}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold text-sm text-gold-deep">
                    {"ABCD"[i]}
                  </span>
                  <span className="flex-1">{text}</span>
                  {state === "right" && <span aria-label="✓">✓</span>}
                  {state === "wrong" && <span aria-label="✗">✗</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {fb && (
          <div ref={fbRef} className="rise mt-5 rounded-xl bg-cream p-4">
            <p className={`font-bold ${fb.right ? "text-[#3f7d4f]" : "text-cinnabar"}`}>
              {fb.right ? t("quiz.right") : t("quiz.wrong")}
            </p>
            {!fb.right && (
              <p className="mt-1 text-sm font-medium">{t("quiz.answerWas", { a: v.question.o[fb.correctIndex] })}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-ink/85">{fb.explanation}</p>
            <button className="btn btn-primary mt-4 w-full" disabled={busy} onClick={() => act({ action: "next" })}>
              {t("quiz.next")}
            </button>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-cinnabar">
          {t("common.error")}
        </p>
      )}
    </section>
  );
}
