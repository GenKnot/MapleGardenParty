import { db } from "@/lib/db";
import { CALLI, CALLI_CHARS, CALLI_GOAL, isCalliChar } from "@/content/calligraphy";
import type { Locale } from "@/lib/locales";
import { body, fail, localeOf, needParticipant, ok } from "@/lib/server/http";

type State = { done: string[] };
const GAME = "calligraphy" as const;

async function view(pid: string, s: State, locale: Locale) {
  const stamps = await db.listStamps(pid);
  return {
    goal: CALLI_GOAL,
    chars: CALLI_CHARS,
    done: s.done,
    hasStamp: stamps.some((x) => x.gameId === GAME),
    alt: Object.fromEntries(CALLI_CHARS.map((c) => [c, CALLI[c].t[locale]])),
  };
}

export async function GET(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const locale = localeOf(new URL(req.url).searchParams.get("locale"), p.locale);
  const s = (await db.getProgress<State>(p.id, GAME)) ?? { done: [] };
  return ok(await view(p.id, s, locale));
}

type Point = [number, number];

// The glyph match is judged on the device (fonts differ), so the server only rejects
// submissions that cannot be real handwriting: too little ink, too small, or too fast.
function plausibleStrokes(raw: unknown, ms: unknown): boolean {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 60) return false;
  if (typeof ms !== "number" || ms < 2000) return false;
  let total = 0;
  let count = 0;
  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  for (const stroke of raw) {
    if (!Array.isArray(stroke) || stroke.length < 2) return false;
    let prev: Point | null = null;
    for (const pt of stroke) {
      if (!Array.isArray(pt) || pt.length !== 2) return false;
      const [x, y] = pt as Point;
      if (typeof x !== "number" || typeof y !== "number" || !(x >= 0 && x <= 1 && y >= 0 && y <= 1)) return false;
      if (++count > 6000) return false;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      if (prev) total += Math.hypot(x - prev[0], y - prev[1]);
      prev = [x, y];
    }
  }
  return total >= 1.2 && maxX - minX >= 0.4 && maxY - minY >= 0.4;
}

export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  if (!isCalliChar(b.char)) return fail("bad_char");

  const s = (await db.getProgress<State>(p.id, GAME)) ?? { done: [] };
  let correct = false;

  if (typeof b.altChoice === "number") {
    correct = b.altChoice === CALLI[b.char].answer;
    if (!correct) return ok({ correct: false, doneCount: s.done.length, complete: false, awarded: false });
  } else {
    if (!plausibleStrokes(b.strokes, b.ms)) return fail("implausible_strokes", 422);
    correct = true;
  }

  if (!s.done.includes(b.char)) s.done.push(b.char);
  let awarded = false;
  if (s.done.length >= CALLI_GOAL) awarded = await db.awardStamp(p.id, GAME);
  await db.saveProgress(p.id, GAME, s);
  return ok({ correct, doneCount: s.done.length, complete: s.done.length >= CALLI_GOAL, awarded, done: s.done });
}
