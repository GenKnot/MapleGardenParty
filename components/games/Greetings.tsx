"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";
import { canvasToBlob, renderGreeting, saveOrShare, type Template } from "@/lib/cards";

const TEMPLATES: { id: Template; key: "greet.tpl.ink" | "greet.tpl.paper" | "greet.tpl.night"; swatch: string }[] = [
  { id: "ink", key: "greet.tpl.ink", swatch: "linear-gradient(160deg,#faf7f0 40%,#d9c8a6)" },
  { id: "paper", key: "greet.tpl.paper", swatch: "linear-gradient(160deg,#faf7f0,#f1e3c6)" },
  { id: "night", key: "greet.tpl.night", swatch: "linear-gradient(160deg,#2c2822,#1f1c18)" },
];

export function Greetings() {
  const { t, me, refresh } = useApp();
  const [tpl, setTpl] = useState<Template>("ink");
  const [text, setText] = useState("");
  const [sign, setSign] = useState(me?.nickname ?? "");
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "need" | "error">("idle");
  const [url, setUrl] = useState<string | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const len = [...text.trim()].length;
  const fileName = `${t("greet.fileName")}.png`;

  async function make(e: React.FormEvent) {
    e.preventDefault();
    if (len < 2 || len > 40) return setStatus("need");
    setStatus("busy");
    try {
      const canvas = await renderGreeting({ template: tpl, text: text.trim(), sign, footer: t("greet.footer") });
      const blob = await canvasToBlob(canvas);
      blobRef.current = blob;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = URL.createObjectURL(blob);
      setUrl(urlRef.current);
      const r = await fetch("/api/games/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!r.ok) throw new Error();
      await refresh();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const input = "mt-1 w-full rounded-xl border border-gold bg-white px-4 text-base outline-none focus:border-cinnabar";

  return (
    <div className="space-y-4">
      <form onSubmit={make} className="card p-5">
        <p>{t("greet.rules")}</p>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium">{t("greet.template")}</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {TEMPLATES.map((x) => (
              <button
                type="button"
                key={x.id}
                aria-pressed={tpl === x.id}
                onClick={() => setTpl(x.id)}
                className={`rounded-2xl border p-2 text-center text-xs transition ${
                  tpl === x.id ? "border-cinnabar ring-2 ring-cinnabar/30" : "border-gold/60"
                }`}
              >
                <span className="mb-1 block h-14 rounded-lg border border-gold/40" style={{ background: x.swatch }} />
                {t(x.key)}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block text-sm font-medium" htmlFor="blessing">
          {t("greet.text")} <span className="text-muted">({len}/40)</span>
        </label>
        <textarea
          id="blessing"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 80))}
          placeholder={t("greet.textPh")}
          className={`${input} p-3`}
        />

        <label className="mt-3 block text-sm font-medium" htmlFor="sign">
          {t("greet.sign")}
        </label>
        <input id="sign" value={sign} onChange={(e) => setSign(e.target.value)} maxLength={24} className={`${input} min-h-12`} />

        {(status === "need" || status === "error") && (
          <p role="alert" className="mt-3 text-sm text-cinnabar">
            {status === "need" ? t("greet.needText") : t("common.error")}
          </p>
        )}
        <button className="btn btn-primary mt-4 w-full" disabled={status === "busy"}>
          {status === "busy" ? t("common.loading") : t("greet.make")}
        </button>
      </form>

      {url && (
        <section className="card rise p-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={t("game.greetings.name")} className="mx-auto w-full max-w-sm rounded-xl border border-gold/40" />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button className="btn btn-primary" onClick={() => blobRef.current && saveOrShare(blobRef.current, fileName, "save")}>
              {t("greet.save")}
            </button>
            <button className="btn btn-ghost" onClick={() => blobRef.current && saveOrShare(blobRef.current, fileName, "share").catch(() => {})}>
              {t("greet.share")}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">{t("greet.longpress")}</p>
          {status === "done" && <p className="mt-3 font-medium text-gold-deep">{t("greet.stampGot")}</p>}
          <Link href="/stamps" className="mt-3 inline-block text-sm underline">
            {t("quiz.toStamps")}
          </Link>
        </section>
      )}
    </div>
  );
}
