"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "../AppProvider";

type Alt = { q: string; o: string[] };
type View = { goal: number; chars: string[]; done: string[]; hasStamp: boolean; alt: Record<string, Alt> };
type Pt = [number, number];

const SERIF = '"Songti SC","Songti TC","Noto Serif CJK SC","Noto Serif SC","Source Han Serif SC","STSong",serif';
const MASK = 128;

// Judge on a small raster: how much of the glyph the child covered, and how much of their ink stayed near the glyph.
function judge(char: string, strokes: Pt[][]) {
  const make = () => {
    const c = document.createElement("canvas");
    c.width = c.height = MASK;
    const x = c.getContext("2d", { willReadFrequently: true })!;
    x.fillStyle = "#000";
    x.strokeStyle = "#000";
    x.lineCap = x.lineJoin = "round";
    return x;
  };
  const glyph = (fat: number) => {
    const x = make();
    x.font = `700 ${MASK * 0.82}px ${SERIF}`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(char, MASK / 2, MASK / 2);
    if (fat) {
      x.lineWidth = fat;
      x.strokeText(char, MASK / 2, MASK / 2);
    }
    return x.getImageData(0, 0, MASK, MASK).data;
  };
  const ink = (w: number) => {
    const x = make();
    x.lineWidth = w;
    for (const s of strokes) {
      x.beginPath();
      s.forEach(([px, py], i) => (i ? x.lineTo(px * MASK, py * MASK) : x.moveTo(px * MASK, py * MASK)));
      if (s.length === 1) x.lineTo(s[0][0] * MASK + 0.1, s[0][1] * MASK);
      x.stroke();
    }
    return x.getImageData(0, 0, MASK, MASK).data;
  };
  const G = glyph(0);
  const Gd = glyph(16);
  const U = ink(4);
  const Ud = ink(16);
  let g = 0, gHit = 0, u = 0, uHit = 0;
  for (let i = 3; i < G.length; i += 4) {
    if (G[i] > 100) {
      g++;
      if (Ud[i] > 100) gHit++;
    }
    if (U[i] > 100) {
      u++;
      if (Gd[i] > 100) uHit++;
    }
  }
  return { coverage: g ? gHit / g : 0, precision: u ? uHit / u : 0, inkPixels: u };
}

export function Calligraphy() {
  const { t, locale, refresh } = useApp();
  const [v, setV] = useState<View | null>(null);
  const [char, setChar] = useState<string | null>(null);
  const [alt, setAlt] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "warn"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [complete, setComplete] = useState(false);

  const guide = useRef<HTMLCanvasElement>(null);
  const draw = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Pt[][]>([]);
  const startedAt = useRef(0);
  const [hasInk, setHasInk] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/games/calligraphy?locale=${locale}`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      const j: View = await r.json();
      setV(j);
      setComplete(j.done.length >= j.goal);
      setError(false);
    } catch {
      setError(true);
    }
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  const paintGuide = useCallback(() => {
    const c = guide.current;
    if (!c || !char) return;
    const size = c.getBoundingClientRect().width;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    c.width = c.height = Math.round(size * dpr);
    const x = c.getContext("2d")!;
    x.scale(dpr, dpr);
    x.clearRect(0, 0, size, size);
    x.strokeStyle = "rgba(168,60,50,0.22)";
    x.lineWidth = 1;
    x.setLineDash([6, 6]);
    x.strokeRect(0.5, 0.5, size - 1, size - 1);
    x.beginPath();
    x.moveTo(size / 2, 0); x.lineTo(size / 2, size);
    x.moveTo(0, size / 2); x.lineTo(size, size / 2);
    x.moveTo(0, 0); x.lineTo(size, size);
    x.moveTo(size, 0); x.lineTo(0, size);
    x.stroke();
    x.setLineDash([]);
    x.fillStyle = "rgba(41,38,32,0.16)";
    x.font = `700 ${size * 0.82}px ${SERIF}`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(char, size / 2, size / 2);

    const d = draw.current!;
    d.width = d.height = Math.round(size * dpr);
    d.getContext("2d")!.scale(dpr, dpr);
  }, [char]);

  useEffect(() => {
    if (!char || alt) return;
    strokes.current = [];
    setHasInk(false);
    setMsg(null);
    startedAt.current = 0;
    paintGuide();
    let lastW = guide.current?.getBoundingClientRect().width ?? 0;
    const onResize = () => {
      const w = guide.current?.getBoundingClientRect().width ?? 0;
      if (Math.abs(w - lastW) < 1) return; // mobile toolbars change height only; keep the child's strokes
      lastW = w;
      paintGuide();
      strokes.current = [];
      setHasInk(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [char, alt, paintGuide]);

  function pos(e: React.PointerEvent): Pt {
    const r = draw.current!.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
  }

  function seg(a: Pt, b: Pt) {
    const c = draw.current!;
    const size = c.getBoundingClientRect().width;
    const x = c.getContext("2d")!;
    x.strokeStyle = "#292620";
    x.lineWidth = Math.max(8, size * 0.032);
    x.lineCap = x.lineJoin = "round";
    x.beginPath();
    x.moveTo(a[0] * size, a[1] * size);
    x.lineTo(b[0] * size, b[1] * size);
    x.stroke();
  }

  function down(e: React.PointerEvent) {
    e.preventDefault();
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {}
    if (!startedAt.current) startedAt.current = Date.now();
    const p = pos(e);
    strokes.current.push([p]);
    seg(p, [p[0] + 0.0005, p[1]]);
    setHasInk(true);
    setMsg(null);
  }
  function move(e: React.PointerEvent) {
    if (!(e.buttons || e.pressure) || !strokes.current.length) return;
    const s = strokes.current[strokes.current.length - 1];
    const p = pos(e);
    seg(s[s.length - 1], p);
    s.push(p);
  }

  function clear() {
    strokes.current = [];
    startedAt.current = 0;
    setHasInk(false);
    setMsg(null);
    const d = draw.current;
    if (d) d.getContext("2d")!.clearRect(0, 0, d.width, d.height);
  }

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    setError(false);
    try {
      const r = await fetch("/api/games/calligraphy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, char, locale }),
      });
      if (r.status === 422) {
        setMsg({ kind: "warn", text: t("calli.tooLittle") });
        return null;
      }
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      setError(true);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!char || busy) return;
    const { coverage, precision, inkPixels } = judge(char, strokes.current);
    if (inkPixels < 120 || coverage < 0.5) return setMsg({ kind: "warn", text: t("calli.tooLittle") });
    if (precision < 0.55) return setMsg({ kind: "warn", text: t("calli.tooOff") });
    const thin = strokes.current.map((s) => s.filter((_, i) => i % 2 === 0 || i === s.length - 1));
    const j = await post({ strokes: thin, ms: Date.now() - startedAt.current });
    if (j?.correct) finishChar(j);
  }

  async function answerAlt(i: number) {
    const j = await post({ altChoice: i });
    if (!j) return;
    if (j.correct) finishChar(j);
    else setMsg({ kind: "warn", text: t("calli.altWrong") });
  }

  async function finishChar(j: { complete: boolean }) {
    setMsg({ kind: "ok", text: t("calli.good") });
    await load();
    await refresh();
    if (j.complete) setComplete(true);
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

  if (complete) {
    return (
      <section className="card p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-cinnabar">{t("calli.doneTitle")}</h2>
        <p className="mt-3">{t("calli.doneBody")}</p>
        <Link href="/stamps" className="btn btn-primary mt-5">
          {t("quiz.toStamps")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <p className="text-sm text-muted">{t("calli.rules", { goal: v.goal })}</p>
      <p className="text-sm font-medium text-cinnabar">{t("calli.progress", { n: v.done.length, goal: v.goal })}</p>

      <div className="grid grid-cols-4 gap-2" role="group" aria-label={t("calli.pick")}>
        {v.chars.map((c) => {
          const done = v.done.includes(c);
          return (
            <button
              key={c}
              aria-pressed={char === c}
              onClick={() => {
                setChar(c);
                setAlt(false);
                setMsg(null);
              }}
              className={`relative grid aspect-square place-items-center rounded-2xl border font-serif text-4xl font-bold ${
                char === c ? "border-cinnabar bg-cinnabar/10" : "border-gold/60 bg-[#fffdf8]"
              }`}
            >
              {c}
              {done && (
                <span className="absolute right-1.5 top-1.5 rounded-full bg-cinnabar px-1.5 text-[10px] font-sans font-medium text-[#fffaf0]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {char && !alt && (
        <div className="card p-4">
          <p className="mb-2 text-center text-sm text-muted">{t("calli.draw")}</p>
          <div className="relative mx-auto aspect-square w-full max-w-[420px] rounded-xl bg-white">
            <canvas ref={guide} className="absolute inset-0 h-full w-full" aria-hidden />
            <canvas
              ref={draw}
              className="absolute inset-0 h-full w-full cursor-crosshair rounded-xl"
              style={{ touchAction: "none" }}
              onPointerDown={down}
              onPointerMove={move}
              role="img"
              aria-label={`${t("calli.draw")}: ${char}`}
            />
          </div>

          {msg && (
            <p role="status" className={`mt-3 text-center font-medium ${msg.kind === "ok" ? "text-[#3f7d4f]" : "text-cinnabar"}`}>
              {msg.text}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <button className="btn btn-ghost flex-1" onClick={clear} disabled={!hasInk || busy}>
              {t("calli.clear")}
            </button>
            <button className="btn btn-primary flex-1" onClick={submit} disabled={!hasInk || busy}>
              {t("calli.submit")}
            </button>
          </div>
          <button
            className="mt-3 w-full min-h-11 text-sm text-muted underline"
            onClick={() => {
              setAlt(true);
              setMsg(null);
            }}
          >
            {t("calli.alt")}
          </button>
        </div>
      )}

      {char && alt && (
        <div className="card p-5">
          <p className="text-center font-serif text-6xl font-bold text-cinnabar">{char}</p>
          <h2 className="mt-3 font-serif text-lg font-bold">{v.alt[char].q}</h2>
          <ul className="mt-4 space-y-3">
            {v.alt[char].o.map((o, i) => (
              <li key={i}>
                <button className="option" disabled={busy} onClick={() => answerAlt(i)}>
                  {o}
                </button>
              </li>
            ))}
          </ul>
          {msg && (
            <p role="status" className={`mt-3 text-center font-medium ${msg.kind === "ok" ? "text-[#3f7d4f]" : "text-cinnabar"}`}>
              {msg.text}
            </p>
          )}
          <button className="mt-3 w-full min-h-11 text-sm text-muted underline" onClick={() => setAlt(false)}>
            {t("calli.altBack")}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-center text-sm text-cinnabar">
          {t("common.error")}
        </p>
      )}
    </section>
  );
}
