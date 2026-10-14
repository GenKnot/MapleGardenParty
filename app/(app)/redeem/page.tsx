"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useApp } from "@/components/AppProvider";
import { STAMPS_REQUIRED } from "@/lib/games";

export default function Redeem() {
  const { me, t, refresh } = useApp();
  const [token, setToken] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const eligible = me?.eligible === true;
  const redeemed = me?.redeemStatus === "redeemed";

  async function generate() {
    setError(false);
    try {
      const r = await fetch("/api/redeem", { method: "POST" });
      if (!r.ok) throw new Error();
      const j = await r.json();
      setToken(j.token);
      QRCode.toDataURL(`${location.origin}/staff?redeem=${j.token}`, {
        margin: 1,
        width: 360,
        color: { dark: "#292620", light: "#fffdf8" },
      }).then(setQr);
      refresh();
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    if (eligible && !redeemed && !token) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, redeemed]);

  // Poll so the screen flips to "claimed" once staff scan it.
  useEffect(() => {
    if (!token || redeemed) return;
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [token, redeemed, refresh]);

  if (!me) return null;

  return (
    <div className="rise">
      <h1 className="font-serif text-2xl font-bold">{t("redeem.title")}</h1>

      {!eligible && (
        <section className="card mt-4 p-6 text-center">
          <p>{t("redeem.locked", { goal: STAMPS_REQUIRED })}</p>
          <p className="mt-3 font-serif text-3xl font-bold text-cinnabar">
            {t("stamps.progress", { n: me.stamps.length, goal: STAMPS_REQUIRED })}
          </p>
          <Link href="/explore" className="btn btn-primary mt-5">
            {t("nav.explore")}
          </Link>
        </section>
      )}

      {eligible && redeemed && (
        <section className="card mt-4 p-6 text-center">
          <p className="font-serif text-2xl font-bold text-cinnabar">{t("redeem.status.redeemed")}</p>
          <p className="mt-3">{t("redeem.done")}</p>
          <Link href="/souvenir" className="btn btn-ghost mt-4">
            {t("souv.link")}
          </Link>
        </section>
      )}

      {eligible && !redeemed && (
        <section className="card mt-4 p-6 text-center">
          <p className="font-medium">{t("redeem.show")}</p>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={t("redeem.code")} width={280} height={280} className="mx-auto mt-4 rounded-xl" />
          ) : (
            <p className="mt-6 text-muted">{t("common.loading")}</p>
          )}
          {token && (
            <>
              <p className="mt-4 text-sm text-muted">{t("redeem.code")}</p>
              <p className="font-mono text-3xl font-bold tracking-[0.25em]">{token}</p>
              <p className="mt-3 inline-block rounded-full bg-cream px-3 py-1 text-sm text-gold-deep ring-1 ring-gold/50">
                {t("redeem.status.issued")}
              </p>
            </>
          )}
          {error && (
            <div role="alert" className="mt-4">
              <p className="text-sm text-cinnabar">{t("common.error")}</p>
              <button onClick={generate} className="btn btn-ghost mt-2">
                {t("common.retry")}
              </button>
            </div>
          )}
          <p className="mt-5 text-xs text-muted">{t("redeem.note")}</p>
          <Link href="/souvenir" className="mt-3 inline-block text-sm underline">
            {t("souv.link")}
          </Link>
        </section>
      )}
    </div>
  );
}
