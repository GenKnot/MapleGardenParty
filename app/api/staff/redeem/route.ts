import { db } from "@/lib/db";
import { sha256 } from "@/lib/server/auth";
import { body, fail, needStaff, ok } from "@/lib/server/http";

export async function POST(req: Request) {
  const s = await needStaff();
  if (!s) return fail("unauthorized", 401);
  const b = await body(req);
  const token = typeof b.token === "string" ? b.token.trim().toUpperCase() : "";
  if (token.length < 6) return fail("bad_token");
  const r = await db.redeem(sha256(token), s.name);
  if (!r.ok) return ok({ ok: false, reason: r.reason, redeemedAt: r.redeemedAt ?? null }, r.reason === "not_found" ? 404 : 409);
  return ok({ ok: true, nickname: r.participant.nickname, stamps: r.stamps });
}
