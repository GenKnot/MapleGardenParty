"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./AppProvider";
import { LangSwitch } from "./LangSwitch";

export function Welcome({ kiosk = false }: { kiosk?: boolean }) {
  const { t, locale, me, ready, refresh } = useApp();
  const router = useRouter();
  const [nick, setNick] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  // A shared tablet must always begin with a clean session.
  const checkedKiosk = useRef(false);
  useEffect(() => {
    if (!kiosk || !ready || checkedKiosk.current) return;
    checkedKiosk.current = true;
    if (me) fetch("/api/session", { method: "DELETE" }).finally(() => refresh());
  }, [kiosk, ready, me, refresh]);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    const nickname = nick.trim();
    if (!nickname || busy) return;
    setBusy(true);
    setError(false);
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, locale, kiosk }),
      });
      if (!r.ok) throw new Error();
      await refresh();
      router.push("/explore");
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  const big = kiosk;
  return (
    <main
      className="relative isolate flex min-h-dvh flex-col items-center overflow-hidden bg-paper bg-cover bg-bottom"
      style={{ backgroundImage: "url(/images/welcome.jpg)" }}
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-paper via-paper/70 to-transparent" />
      <div className={`flex w-full flex-1 flex-col items-center px-5 pb-10 pt-8 transition-opacity duration-200 ${ready ? "opacity-100" : "opacity-0"} ${big ? "max-w-3xl" : "max-w-md"}`}>
        <LangSwitch large={big} />

        <header className={`text-center ${big ? "mt-16" : "mt-10"}`}>
          <h1 className={`font-serif font-bold tracking-[0.2em] text-ink ${big ? "text-7xl" : "text-5xl"}`}>
            {t("brand.name")}
          </h1>
          <p className={`mt-3 font-serif tracking-widest text-gold-deep ${big ? "text-2xl" : "text-lg"}`}>
            {t("brand.sub")}
          </p>
          <p className={`mt-2 text-muted ${big ? "text-lg" : "text-sm"}`}>{t("brand.date")}</p>
          <p className={`mx-auto mt-6 max-w-sm text-ink/80 ${big ? "max-w-xl text-xl" : "text-base"}`}>
            {t("welcome.tagline")}
          </p>
        </header>

        <form onSubmit={start} className={`card rise mt-auto w-full bg-paper/90 p-5 backdrop-blur ${big ? "mt-12 p-8" : "mt-10"}`}>
          <label htmlFor="nick" className={`block font-medium ${big ? "text-xl" : ""}`}>
            {t("welcome.nickLabel")}
          </label>
          <input
            id="nick"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            maxLength={40}
            autoComplete="off"
            placeholder={t("welcome.nickPlaceholder")}
            className={`mt-2 w-full rounded-xl border border-gold bg-white px-4 text-ink outline-none focus:border-cinnabar ${
              big ? "min-h-16 text-2xl" : "min-h-12 text-lg"
            }`}
          />
          <p className="mt-2 text-sm text-muted">{t("welcome.nickHint")}</p>

          <button
            type="submit"
            disabled={!nick.trim() || busy || !ready}
            className={`btn btn-primary mt-4 w-full ${big ? "min-h-16 text-xl" : ""}`}
          >
            {busy ? t("common.loading") : t("welcome.start")}
          </button>

          {!kiosk && ready && me && (
            <button type="button" onClick={() => router.push("/explore")} className="btn btn-ghost mt-3 w-full">
              {t("welcome.resume")} · {me.nickname}
            </button>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-cinnabar">
              {t("welcome.error")}
            </p>
          )}
          <p className="mt-4 text-center text-xs text-muted">{kiosk ? t("kiosk.private") : t("welcome.privacy")}</p>
        </form>
      </div>
    </main>
  );
}
