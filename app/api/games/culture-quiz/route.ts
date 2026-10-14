import { db } from "@/lib/db";
import { PASS_CORRECT, QUESTIONS, QUESTION_IDS } from "@/content/questions";
import type { Locale } from "@/lib/locales";
import { body, fail, localeOf, needParticipant, ok } from "@/lib/server/http";

type QuizState = {
  order: number[];
  index: number;
  correct: number;
  passed: boolean;
  pending: { chosen: number; right: boolean } | null;
};

const GAME = "culture-quiz" as const;

function shuffle<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

const fresh = (): QuizState => ({ order: shuffle(QUESTION_IDS), index: 0, correct: 0, passed: false, pending: null });

function view(s: QuizState | null, locale: Locale, hasStamp: boolean) {
  if (!s) return { phase: "intro", hasStamp, passScore: PASS_CORRECT, total: QUESTION_IDS.length };
  const base = { hasStamp, correct: s.correct, passScore: PASS_CORRECT, total: s.order.length };
  const finished = s.index >= s.order.length;
  if (!s.pending && s.passed) return { ...base, phase: "passed" };
  if (finished && !s.pending) return { ...base, phase: "failed" };
  const q = QUESTIONS.find((x) => x.id === s.order[s.index])!;
  const t = q.t[locale];
  const question = { id: q.id, q: t.q, o: t.o };
  if (s.pending) {
    return {
      ...base,
      phase: "question",
      n: s.index + 1,
      question,
      feedback: { chosen: s.pending.chosen, right: s.pending.right, correctIndex: q.answer, explanation: t.e },
    };
  }
  return { ...base, phase: "question", n: s.index + 1, question };
}

export async function GET(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const locale = localeOf(new URL(req.url).searchParams.get("locale"), p.locale);
  const [s, stamps] = await Promise.all([db.getProgress<QuizState>(p.id, GAME), db.listStamps(p.id)]);
  return ok(view(s, locale, stamps.some((x) => x.gameId === GAME)));
}

export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  const locale = localeOf(b.locale, p.locale);
  let s = await db.getProgress<QuizState>(p.id, GAME);

  if (b.action === "start") {
    s = fresh();
  } else if (!s) {
    return fail("not_started", 409);
  } else if (b.action === "answer") {
    if (s.pending || s.index >= s.order.length) return fail("already_answered", 409);
    const choice = b.choice;
    if (typeof choice !== "number" || !Number.isInteger(choice) || choice < 0 || choice > 3) return fail("bad_choice");
    const q = QUESTIONS.find((x) => x.id === s!.order[s!.index])!;
    const right = choice === q.answer;
    s.pending = { chosen: choice, right };
    if (right) s.correct += 1;
    if (s.correct >= PASS_CORRECT && !s.passed) {
      s.passed = true;
      await db.awardStamp(p.id, GAME);
    }
  } else if (b.action === "next") {
    if (!s.pending) return fail("not_answered", 409);
    s.pending = null;
    s.index += 1;
  } else {
    return fail("bad_action");
  }

  await db.saveProgress(p.id, GAME, s);
  const stamps = await db.listStamps(p.id);
  return ok(view(s, locale, stamps.some((x) => x.gameId === GAME)));
}
