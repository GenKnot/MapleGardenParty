import { db } from "@/lib/db";
import { STAMPS_REQUIRED } from "@/lib/games";
import { isLocale } from "@/lib/locales";
import { body, fail, needParticipant, ok } from "@/lib/server/http";

export async function GET() {
  const p = await needParticipant();
  if (!p) return ok({ participant: null });
  const [stamps, redemption] = await Promise.all([db.listStamps(p.id), db.getRedemption(p.id)]);
  return ok({
    participant: { nickname: p.nickname, locale: p.locale, kiosk: p.kiosk, shortCode: p.shortCode },
    stamps: stamps.map((s) => s.gameId),
    eligible: stamps.length >= STAMPS_REQUIRED,
    redeemStatus: redemption?.status ?? null,
  });
}

export async function PATCH(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  if (!isLocale(b.locale)) return fail("bad_locale");
  await db.updateParticipant(p.id, { locale: b.locale });
  return ok();
}
