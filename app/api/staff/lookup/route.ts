import { db } from "@/lib/db";
import { fail, needStaff, ok } from "@/lib/server/http";

export async function GET(req: Request) {
  const s = await needStaff();
  if (!s) return fail("unauthorized", 401);
  const code = (new URL(req.url).searchParams.get("code") ?? "").trim().toUpperCase();
  const p = code ? await db.getParticipantByShortCode(code) : null;
  if (!p) return fail("not_found", 404);
  const stamps = await db.listStamps(p.id);
  return ok({ nickname: p.nickname, shortCode: p.shortCode, stamps: stamps.map((x) => x.gameId) });
}
