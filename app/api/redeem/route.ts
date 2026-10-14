import { db } from "@/lib/db";
import { STAMPS_REQUIRED } from "@/lib/games";
import { redeemToken, sha256 } from "@/lib/server/auth";
import { fail, needParticipant, ok } from "@/lib/server/http";

export async function POST() {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const stamps = await db.listStamps(p.id);
  if (stamps.length < STAMPS_REQUIRED) return fail("not_eligible", 403);
  const token = redeemToken(p.id);
  const r = await db.createRedemptionIfAbsent(p.id, sha256(token));
  return ok({ token, status: r.status });
}
