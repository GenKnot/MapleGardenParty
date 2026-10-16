import "server-only";
import { db } from "@/lib/db";
import type { GameId } from "@/lib/games";
import type { Locale } from "@/lib/locales";
import { body, fail, localeOf, needParticipant, ok } from "./http";

export type RoundText = { q: string; o: string[]; e: string };
export type RoundQuestion = {
  id: string;
  answer: number;
  media: Record<string, string>;
  t: Record<Locale, RoundText>;
};

type State = {
  order: string[];
  index: number;
  correct: number;
  passed: boolean;
  pending: { chosen: number; right: boolean } | null;
};

function shuffle<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

/** Server-judged multiple-choice rounds: answers never leave the server until a question is answered. */
export function makeRound(cfg: { game: GameId; questions: RoundQuestion[]; goal: number; enabled?: boolean }) {
  const ids = cfg.questions.map((q) => q.id);
  const byId = new Map(cfg.questions.map((q) => [q.id, q]));
  const fresh = (): State => ({ order: shuffle(ids), index: 0, correct: 0, passed: false, pending: null });

  function view(s: State | null, locale: Locale, hasStamp: boolean) {
    const base = { hasStamp, goal: cfg.goal, total: ids.length };
    if (!s) return { ...base, phase: "intro" };
    const withCount = { ...base, correct: s.correct };
    const finished = s.index >= s.order.length;
    if (!s.pending && s.passed) return { ...withCount, phase: "passed" };
    if (!s.pending && finished) return { ...withCount, phase: "failed" };
    const q = byId.get(s.order[s.index])!;
    const t = q.t[locale];
    const question = { id: q.id, q: t.q, o: t.o, media: q.media };
    if (s.pending) {
      return {
        ...withCount,
        phase: "question",
        n: s.index + 1,
        question,
        feedback: { chosen: s.pending.chosen, right: s.pending.right, correctIndex: q.answer, explanation: t.e },
      };
    }
    return { ...withCount, phase: "question", n: s.index + 1, question };
  }

  async function GET(req: Request) {
    if (cfg.enabled === false) return fail("coming_soon", 403);
    const p = await needParticipant();
    if (!p) return fail("no_session", 401);
    const locale = localeOf(new URL(req.url).searchParams.get("locale"), p.locale);
    const [s, stamps] = await Promise.all([db.getProgress<State>(p.id, cfg.game), db.listStamps(p.id)]);
    return ok(view(s, locale, stamps.some((x) => x.gameId === cfg.game)));
  }

  async function POST(req: Request) {
    if (cfg.enabled === false) return fail("coming_soon", 403);
    const p = await needParticipant();
    if (!p) return fail("no_session", 401);
    const b = await body(req);
    const locale = localeOf(b.locale, p.locale);
    let s = await db.getProgress<State>(p.id, cfg.game);

    if (b.action === "start") {
      s = fresh();
    } else if (!s) {
      return fail("not_started", 409);
    } else if (b.action === "answer") {
      if (s.pending || s.index >= s.order.length) return fail("already_answered", 409);
      const choice = b.choice;
      if (typeof choice !== "number" || !Number.isInteger(choice) || choice < 0 || choice > 3) return fail("bad_choice");
      const q = byId.get(s.order[s.index])!;
      const right = choice === q.answer;
      s.pending = { chosen: choice, right };
      if (right) s.correct += 1;
      if (s.correct >= cfg.goal && !s.passed) {
        s.passed = true;
        await db.awardStamp(p.id, cfg.game);
      }
    } else if (b.action === "next") {
      if (!s.pending) return fail("not_answered", 409);
      s.pending = null;
      s.index += 1;
    } else {
      return fail("bad_action");
    }

    await db.saveProgress(p.id, cfg.game, s);
    const stamps = await db.listStamps(p.id);
    return ok(view(s, locale, stamps.some((x) => x.gameId === cfg.game)));
  }

  return { GET, POST };
}
