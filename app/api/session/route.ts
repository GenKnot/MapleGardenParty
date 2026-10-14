import { db } from "@/lib/db";
import { clearSession, newId, newShortCode, setSession } from "@/lib/server/auth";
import { body, fail, localeOf, ok } from "@/lib/server/http";

export async function POST(req: Request) {
  const b = await body(req);
  const nickname = typeof b.nickname === "string" ? b.nickname.trim().slice(0, 40) : "";
  if (!nickname) return fail("nickname_required");
  const p = await db.createParticipant({
    id: newId(),
    nickname,
    locale: localeOf(b.locale),
    kiosk: b.kiosk === true,
    shortCode: newShortCode(),
  });
  await setSession(p.id);
  return ok({ id: p.id });
}

export async function DELETE() {
  await clearSession();
  return ok();
}
