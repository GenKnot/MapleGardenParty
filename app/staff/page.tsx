"use client";

import { useCallback, useEffect, useState } from "react";
import { GAMES, HAS_ONSITE, ONSITE_GAME_IDS, type GameId } from "@/lib/games";
import { zhCN } from "@/lib/i18n/zh-CN";

type Tab = "redeem" | "confirm" | "stats";
type Stats = {
  participants: number;
  stampsByGame: Record<string, number>;
  reachedThree: number;
  redeemed: number;
  wishes: number;
  wishCategories: Record<string, number>;
};

const gameName = (id: string) => (zhCN as Record<string, string>)[`game.${id}.name`] ?? id;
const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export default function Staff() {
  const [staff, setStaff] = useState<string | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("redeem");
  const [prefill, setPrefill] = useState("");

  const check = useCallback(async () => {
    const r = await fetch("/api/staff/stats", { cache: "no-store" });
    setStaff(r.ok ? (await r.json()).staff : null);
  }, []);

  useEffect(() => {
    const t = new URLSearchParams(location.search).get("redeem");
    if (t) setPrefill(t.toUpperCase());
    check();
  }, [check]);

  if (staff === undefined) return <p className="p-6 text-muted">加载中…</p>;
  if (!staff) return <Login onDone={check} />;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">工作人员后台</h1>
        <div className="flex items-center gap-3 text-sm text-muted">
          {staff}
          <button
            className="underline"
            onClick={async () => {
              await post("/api/staff/logout", {});
              setStaff(null);
            }}
          >
            退出
          </button>
        </div>
      </header>

      <div role="tablist" className="mt-5 flex gap-2">
        {(
          [
            ["redeem", "兑奖核销"],
            ["confirm", "线下确认"],
            ["stats", "统计"],
          ] as const
        )
          .filter(([id]) => id !== "confirm" || HAS_ONSITE)
          .map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-12 flex-1 rounded-full border text-sm font-medium ${
              tab === id ? "border-ink bg-ink text-paper" : "border-gold/70 bg-paper"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "redeem" && <RedeemTab prefill={prefill} />}
        {tab === "confirm" && <ConfirmTab />}
        {tab === "stats" && <StatsTab />}
      </div>
    </main>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const input = "mt-1 min-h-12 w-full rounded-xl border border-gold bg-white px-4 text-lg outline-none focus:border-cinnabar";

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await post("/api/staff/login", { name, passcode: pass });
    if (r.ok) onDone();
    else setErr(r.status === 401 ? "口令不正确" : "请填写姓名/代号");
  }

  return (
    <main className="mx-auto max-w-sm px-4 pt-16">
      <form onSubmit={go} className="card space-y-4 p-6">
        <h1 className="font-serif text-2xl font-bold">工作人员登录</h1>
        <label className="block text-sm">
          你的名字或代号（用于核销记录）
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        </label>
        <label className="block text-sm">
          工作人员口令
          <input className={input} type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="off" />
        </label>
        {err && (
          <p role="alert" className="text-sm text-cinnabar">
            {err}
          </p>
        )}
        <button className="btn btn-primary w-full">登录</button>
      </form>
    </main>
  );
}

function RedeemTab({ prefill }: { prefill: string }) {
  const [token, setToken] = useState(prefill);
  const [result, setResult] = useState<{ kind: "ok" | "dup" | "none" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prefill) setToken(prefill);
  }, [prefill]);

  async function go() {
    setBusy(true);
    setResult(null);
    try {
      const r = await post("/api/staff/redeem", { token });
      const j = await r.json();
      if (j.ok) setResult({ kind: "ok", text: `核销成功：${j.nickname}（章：${j.stamps.map(gameName).join("、")}）。可以发放明信片。` });
      else if (j.reason === "already_redeemed")
        setResult({ kind: "dup", text: `已兑换，请勿重复发放。${j.redeemedAt ? `（${new Date(j.redeemedAt).toLocaleTimeString()}）` : ""}` });
      else if (j.reason === "not_found") setResult({ kind: "none", text: "找不到这个兑奖码，请核对。" });
      else setResult({ kind: "err", text: "请输入兑奖码。" });
    } catch {
      setResult({ kind: "err", text: "网络错误，请重试。如持续失败请使用纸质备用记录。" });
    }
    setBusy(false);
  }

  const color = { ok: "border-[#3f7d4f] bg-[#eef6ee]", dup: "border-cinnabar bg-[#fbeeec]", none: "border-cinnabar bg-[#fbeeec]", err: "border-cinnabar bg-[#fbeeec]" };

  return (
    <section className="card space-y-4 p-5">
      <label className="block text-sm">
        兑奖码（游客屏幕上的 10 位码，或扫二维码自动带入）
        <input
          value={token}
          onChange={(e) => setToken(e.target.value.toUpperCase())}
          className="mt-1 min-h-14 w-full rounded-xl border border-gold bg-white px-4 font-mono text-2xl tracking-widest outline-none focus:border-cinnabar"
          autoCapitalize="characters"
          autoComplete="off"
        />
      </label>
      <button onClick={go} disabled={busy || token.length < 6} className="btn btn-primary w-full">
        核销并发放
      </button>
      {result && (
        <p role="status" className={`rounded-xl border p-4 font-medium ${color[result.kind]}`}>
          {result.text}
        </p>
      )}
    </section>
  );
}

function ConfirmTab() {
  const [code, setCode] = useState("");
  const [game, setGame] = useState<GameId>(ONSITE_GAME_IDS[0]);
  const [msg, setMsg] = useState<string | null>(null);
  const [lookup, setLookup] = useState<{ nickname: string; stamps: string[] } | null>(null);

  async function find() {
    setMsg(null);
    const r = await fetch(`/api/staff/lookup?code=${encodeURIComponent(code)}`);
    if (!r.ok) {
      setLookup(null);
      return setMsg("找不到这个编号。");
    }
    setLookup(await r.json());
  }

  async function confirm() {
    const r = await post("/api/staff/confirm", { code, gameId: game });
    const j = await r.json();
    if (!r.ok) return setMsg("确认失败：" + (j.error ?? ""));
    setMsg(j.awarded ? `已为 ${j.nickname} 确认「${gameName(game)}」。` : `${j.nickname} 已经有这枚章了。`);
    find();
  }

  return (
    <section className="card space-y-4 p-5">
      <label className="block text-sm">
        游客编号（6 位）
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && find()}
          maxLength={6}
          autoCapitalize="characters"
          autoComplete="off"
          className="mt-1 min-h-14 w-full rounded-xl border border-gold bg-white px-4 font-mono text-2xl tracking-widest outline-none focus:border-cinnabar"
        />
      </label>
      <button onClick={find} disabled={code.length < 6} className="btn btn-ghost w-full">
        查找
      </button>
      {lookup && (
        <div className="rounded-xl bg-cream p-4">
          <p className="font-medium">{lookup.nickname}</p>
          <p className="mt-1 text-sm text-muted">已有章：{lookup.stamps.length ? lookup.stamps.map(gameName).join("、") : "暂无"}</p>
          <div className="mt-4 flex gap-2">
            {GAMES.filter((g) => g.kind === "onsite").map((g) => (
              <button
                key={g.id}
                aria-pressed={game === g.id}
                onClick={() => setGame(g.id)}
                className={`min-h-12 flex-1 rounded-full border text-sm font-medium ${game === g.id ? "border-cinnabar bg-cinnabar text-[#fffaf0]" : "border-gold/70 bg-paper"}`}
              >
                {gameName(g.id)}
              </button>
            ))}
          </div>
          <button onClick={confirm} className="btn btn-primary mt-4 w-full">
            确认已完成
          </button>
        </div>
      )}
      {msg && (
        <p role="status" className="rounded-xl border border-gold bg-paper p-3 text-sm">
          {msg}
        </p>
      )}
    </section>
  );
}

function StatsTab() {
  const [s, setS] = useState<Stats | null>(null);
  const load = useCallback(async () => {
    const r = await fetch("/api/staff/stats", { cache: "no-store" });
    if (r.ok) setS((await r.json()).stats);
  }, []);
  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  if (!s) return <p className="text-muted">加载中…</p>;
  const cell = (label: string, value: number) => (
    <div className="card p-4 text-center">
      <p className="font-serif text-3xl font-bold text-cinnabar">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {cell("参与人数", s.participants)}
        {cell("集满3章", s.reachedThree)}
        {cell("已兑奖", s.redeemed)}
        {cell("心愿数", s.wishes)}
      </div>
      <section className="card p-4">
        <h2 className="font-medium">各项目完成量</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {GAMES.filter((g) => g.live).map((g) => (
            <li key={g.id} className="flex justify-between">
              <span>{gameName(g.id)}</span>
              <span className="font-mono">{s.stampsByGame[g.id] ?? 0}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="card p-4">
        <h2 className="font-medium">心愿类别</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {Object.entries(s.wishCategories).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span>{(zhCN as Record<string, string>)[`wishes.cat.${k}`] ?? k}</span>
              <span className="font-mono">{v}</span>
            </li>
          ))}
          {Object.keys(s.wishCategories).length === 0 && <li className="text-muted">暂无</li>}
        </ul>
      </section>
    </div>
  );
}
