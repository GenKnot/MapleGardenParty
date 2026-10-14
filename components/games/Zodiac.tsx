"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";
import { ZODIAC, ZODIAC_MAX_YEAR, ZODIAC_MIN_YEAR } from "@/content/zodiac";

export function Zodiac() {
  const { t, locale, refresh } = useApp();
  const [year, setYear] = useState("");
  const [idx, setIdx] = useState<number | null>(null);
  const [error, setError] = useState<"invalid" | "net" | null>(null);
  const [busy, setBusy] = useState(false);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    const y = Number(year);
    if (!Number.isInteger(y) || y < ZODIAC_MIN_YEAR || y > ZODIAC_MAX_YEAR) return setError("invalid");
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/games/zodiac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: y }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      setIdx(j.index);
      refresh();
    } catch {
      setError("net");
    } finally {
      setBusy(false);
    }
  }

  const entry = idx !== null ? ZODIAC[locale][idx] : null;

  return (
    <div className="space-y-4">
      <form onSubmit={find} className="card p-5">
        <p>{t("zodiac.rules")}</p>
        <label className="mt-4 block text-sm font-medium" htmlFor="yr">
          {t("zodiac.year")}
        </label>
        <input
          id="yr"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
          placeholder="2000"
          className="mt-1 min-h-12 w-full rounded-xl border border-gold bg-white px-4 text-xl outline-none focus:border-cinnabar"
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-cinnabar">
            {error === "invalid"
              ? t("zodiac.invalid", { min: ZODIAC_MIN_YEAR, max: ZODIAC_MAX_YEAR })
              : t("common.error")}
          </p>
        )}
        <button className="btn btn-primary mt-4 w-full" disabled={busy || year.length !== 4}>
          {t("zodiac.find")}
        </button>
      </form>

      {entry && (
        <section className="card rise p-6 text-center">
          <p className="text-sm text-muted">{t("zodiac.result", { z: entry.name })}</p>
          <p className="mt-2 font-serif text-7xl font-bold text-cinnabar">{entry.name}</p>
          <p className="mt-4 leading-relaxed">{entry.fact}</p>
          <p className="mt-4 text-xs text-muted">{t("zodiac.lunarNote")}</p>
          <p className="mt-4 font-medium text-gold-deep">{t("zodiac.stampGot")}</p>
          <Link href="/stamps" className="btn btn-primary mt-4">
            {t("zodiac.toStamps")}
          </Link>
        </section>
      )}
    </div>
  );
}
