import { db } from "@/lib/db";
import { MAX_ATTEMPTS, OPTION_ORDER, PAINTINGS, POETRY_GOAL, VERSES, verseText, type VerseId } from "@/content/poems";
import type { Locale } from "@/lib/locales";
import { body, fail, localeOf, needParticipant, ok } from "@/lib/server/http";

type State = { done: string[]; attempts: Record<string, number> };
const GAME = "poetry" as const;
const empty = (): State => ({ done: [], attempts: {} });

function options(paintingIndex: number, locale: Locale) {
  // Rotate so the right answer is not always in the same slot.
  const rot = paintingIndex % OPTION_ORDER.length;
  return [...OPTION_ORDER.slice(rot), ...OPTION_ORDER.slice(0, rot)].map((id) => verseText(id, locale));
}

async function view(pid: string, s: State, locale: Locale) {
  const stamps = await db.listStamps(pid);
  const next = PAINTINGS.findIndex((p) => !s.done.includes(p.id));
  const p = next >= 0 ? PAINTINGS[next] : null;
  return {
    total: POETRY_GOAL,
    doneCount: s.done.length,
    hasStamp: stamps.some((x) => x.gameId === GAME),
    current: p
      ? {
          id: p.id,
          file: p.file,
          title: p.t[locale].title,
          attempts: s.attempts[p.id] ?? 0,
          hint: (s.attempts[p.id] ?? 0) > 0 ? p.t[locale].hint : null,
          options: options(next, locale),
        }
      : null,
  };
}

export async function GET(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const locale = localeOf(new URL(req.url).searchParams.get("locale"), p.locale);
  const s = (await db.getProgress<State>(p.id, GAME)) ?? empty();
  return ok(await view(p.id, s, locale));
}

export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  const locale = localeOf(b.locale, p.locale);
  const painting = PAINTINGS.find((x) => x.id === b.paintingId);
  if (!painting || typeof b.choice !== "string" || !(b.choice in VERSES)) return fail("bad_request");

  const s = (await db.getProgress<State>(p.id, GAME)) ?? empty();
  if (s.done.includes(painting.id)) return fail("already_done", 409);

  const attempts = (s.attempts[painting.id] ?? 0) + 1;
  s.attempts[painting.id] = attempts;
  const right = (b.choice as VerseId) === painting.answer;
  const revealed = !right && attempts >= MAX_ATTEMPTS;
  const finished = right || revealed;
  if (finished) s.done.push(painting.id);

  let awarded = false;
  if (s.done.length >= POETRY_GOAL) awarded = await db.awardStamp(p.id, GAME);
  await db.saveProgress(p.id, GAME, s);

  return ok({
    right,
    finished,
    attempts,
    hint: !finished ? painting.t[locale].hint : null,
    reveal: finished ? { verse: verseText(painting.answer, locale), explain: painting.t[locale].explain } : null,
    doneCount: s.done.length,
    complete: s.done.length >= POETRY_GOAL,
    awarded,
  });
}
