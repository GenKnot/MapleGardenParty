import { db } from "@/lib/db";
import { ZODIAC_MAX_YEAR, ZODIAC_MIN_YEAR, zodiacIndex } from "@/content/zodiac";
import { body, fail, needParticipant, ok } from "@/lib/server/http";

export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  const year = b.year;
  if (typeof year !== "number" || !Number.isInteger(year) || year < ZODIAC_MIN_YEAR || year > ZODIAC_MAX_YEAR) {
    return fail("bad_year");
  }
  const awarded = await db.awardStamp(p.id, "zodiac");
  return ok({ index: zodiacIndex(year), awarded });
}
