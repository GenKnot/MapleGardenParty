import { db } from "@/lib/db";
import { PUZZLES, TILES } from "@/content/puzzle";
import { body, fail, localeOf, needParticipant, ok } from "@/lib/server/http";

// perm[position] = tile id currently sitting at that position; solved when perm[i] === i.
type State = { img: number; perm: number[]; startedAt: number };
const GAME = "puzzle" as const;

function randomInt(n: number) {
  return crypto.getRandomValues(new Uint32Array(1))[0] % n;
}

function fresh(): State {
  let perm: number[];
  do {
    perm = Array.from({ length: TILES }, (_, i) => i);
    for (let i = TILES - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    // Reject boards that are already solved or almost solved.
  } while (perm.filter((t, i) => t === i).length > 2);
  return { img: randomInt(PUZZLES.length), perm, startedAt: Date.now() };
}

async function view(pid: string, s: State) {
  const stamps = await db.listStamps(pid);
  const pz = PUZZLES[s.img];
  return {
    file: pz.file,
    aspect: pz.aspect,
    perm: s.perm,
    hasStamp: stamps.some((x) => x.gameId === GAME),
  };
}

export async function GET() {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  let s = await db.getProgress<State>(p.id, GAME);
  if (!s) {
    s = fresh();
    await db.saveProgress(p.id, GAME, s);
  }
  return ok(await view(p.id, s));
}

export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  const locale = localeOf(b.locale, p.locale);

  if (b.action === "restart") {
    const s = fresh();
    await db.saveProgress(p.id, GAME, s);
    return ok(await view(p.id, s));
  }

  if (b.action !== "complete") return fail("bad_action");
  const s = await db.getProgress<State>(p.id, GAME);
  if (!s) return fail("not_started", 409);

  // Replay the visitor's swaps on the board the server dealt; only a truly solved board earns the stamp.
  const swaps = b.swaps;
  if (!Array.isArray(swaps) || swaps.length < 1 || swaps.length > 300) return fail("bad_swaps");
  const board = [...s.perm];
  for (const sw of swaps) {
    if (!Array.isArray(sw) || sw.length !== 2) return fail("bad_swaps");
    const [a, c] = sw as [unknown, unknown];
    if (!Number.isInteger(a) || !Number.isInteger(c)) return fail("bad_swaps");
    const x = a as number;
    const y = c as number;
    if (x < 0 || x >= TILES || y < 0 || y >= TILES || x === y) return fail("bad_swaps");
    [board[x], board[y]] = [board[y], board[x]];
  }
  if (!board.every((t, i) => t === i)) return ok({ solved: false });
  if (Date.now() - s.startedAt < 3000) return fail("too_fast", 422);

  const awarded = await db.awardStamp(p.id, GAME);
  const pz = PUZZLES[s.img];
  return ok({ solved: true, awarded, title: pz.t[locale].title, note: pz.t[locale].note });
}
