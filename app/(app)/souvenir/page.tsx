"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { canvasToBlob, renderSouvenir, saveOrShare } from "@/lib/cards";
import { GAMES, STAMPS_REQUIRED } from "@/lib/games";

export default function Souvenir() {
  const { me, t, locale } = useApp();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const blobRef = useRef<Blob | null>(null);

  const eligible = me?.eligible === true;
  const stampKey = me?.stamps.join(",") ?? "";
  const nickname = me?.nickname ?? "";

  useEffect(() => {
    if (!eligible) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    const earned = GAMES.filter((g) => g.live && stampKey.split(",").includes(g.id)).map((g) => g.id);
    renderSouvenir({
      brand: t("brand.name"),
      sub: t("brand.sub"),
      cardTitle: t("souv.cardTitle"),
      forLabel: t("souv.for"),
      name: nickname,
      stampsLine: t("souv.stampsLine", { n: earned.length }),
      stamps: earned,
      dateText: t("souv.date"),
    })
      .then(canvasToBlob)
      .then((blob) => {
        if (cancelled) return;
        blobRef.current = blob;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setError(false);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // t changes with locale; regenerate so the card follows the chosen language
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, stampKey, nickname, locale]);

  if (!me) return null;

  return (
    <div className="rise">
      <h1 className="font-serif text-2xl font-bold">{t("souv.title")}</h1>
      {!eligible ? (
        <section className="card mt-4 p-6 text-center">
          <p>{t("souv.locked", { goal: STAMPS_REQUIRED })}</p>
          <Link href="/explore" className="btn btn-primary mt-5">
            {t("nav.explore")}
          </Link>
        </section>
      ) : (
        <section className="card mt-4 p-5 text-center">
          <p className="mb-4 text-sm text-muted">{t("souv.intro")}</p>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={t("souv.title")} className="mx-auto w-full max-w-sm rounded-xl border border-gold/40" />
          ) : error ? (
            <p role="alert" className="text-cinnabar">
              {t("common.error")}
            </p>
          ) : (
            <p className="py-16 text-muted">{t("common.loading")}</p>
          )}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              className="btn btn-primary"
              disabled={!url}
              onClick={() => blobRef.current && saveOrShare(blobRef.current, `${t("souv.fileName")}.png`, "save")}
            >
              {t("souv.save")}
            </button>
            <button
              className="btn btn-ghost"
              disabled={!url}
              onClick={() => blobRef.current && saveOrShare(blobRef.current, `${t("souv.fileName")}.png`, "share").catch(() => {})}
            >
              {t("greet.share")}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">{t("greet.longpress")}</p>
        </section>
      )}
    </div>
  );
}
