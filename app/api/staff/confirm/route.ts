import { db } from "@/lib/db";
import { ONSITE_GAME_IDS, isGameId } from "@/lib/games";
import { body, fail, needStaff, ok } from "@/lib/server/http";

export async function POST(req: Request) {
  const s = await needStaff();
  if (!s) return fail("unauthorized", 401);
  const b = await body(req);
  const code = typeof b.code === "string" ? b.code.trim().toUpperCase() : "";
  if (!isGameId(b.gameId) || !ONSITE_GAME_IDS.includes(b.gameId)) return fail("not_onsite_game");
  const p = code ? await db.getParticipantByShortCode(code) : null;
  if (!p) return fail("not_found", 404);
  const awarded = await db.awardStamp(p.id, b.gameId, s.name);
  return ok({ awarded, nickname: p.nickname });
}
