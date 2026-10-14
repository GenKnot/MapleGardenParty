"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";
import { WISH_CATEGORIES } from "@/lib/wishes";

export function Wishes() {
  const { t, me, refresh } = useApp();
  const [picked, setPicked] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "need" | "error">("idle");

  const toggle = (c: string) => setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (picked.length === 0) return setState("need");
    setState("busy");
    try {
      const r = await fetch("/api/games/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: picked, message, isPublic }),
      });
      if (!r.ok) throw new Error();
      await refresh();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <section className="card rise p-6 text-center">
        <p className="font-serif text-xl font-bold text-cinnabar">{t("wishes.thanks")}</p>
        <Link href="/stamps" className="btn btn-primary mt-5">
          {t("quiz.toStamps")}
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="card p-5">
      <p>{t("wishes.rules")}</p>
      {me?.stamps.includes("wishes") && <p className="mt-2 text-sm text-gold-deep">{t("quiz.alreadyHave")}</p>}
      <fieldset className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <legend className="sr-only">{t("game.wishes.name")}</legend>
        {WISH_CATEGORIES.map((c) => {
          const on = picked.includes(c);
          return (
            <button
              type="button"
              key={c}
              aria-pressed={on}
              onClick={() => toggle(c)}
              className={`min-h-12 rounded-full border px-4 text-left transition-colors ${
                on ? "border-cinnabar bg-cinnabar/10 font-medium" : "border-gold/70 bg-white"
              }`}
            >
              <span aria-hidden className="mr-2">{on ? "✓" : "○"}</span>
              {t(`wishes.cat.${c}`)}
            </button>
          );
        })}
      </fieldset>

      <label className="mt-5 block text-sm font-medium" htmlFor="msg">
        {t("wishes.message")}
      </label>
      <textarea
        id="msg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={280}
        rows={3}
        placeholder={t("wishes.messagePh")}
        className="mt-1 w-full rounded-xl border border-gold bg-white p-3 text-base outline-none focus:border-cinnabar"
      />

      <label className="mt-3 flex items-start gap-3">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[#a83c32]"
        />
        <span className="text-sm">{t("wishes.public")}</span>
      </label>

      {(state === "need" || state === "error") && (
        <p role="alert" className="mt-3 text-sm text-cinnabar">
          {state === "need" ? t("wishes.needOne") : t("common.error")}
        </p>
      )}
      <button className="btn btn-primary mt-5 w-full" disabled={state === "busy"}>
        {state === "busy" ? t("common.loading") : t("wishes.submit")}
      </button>
    </form>
  );
}
