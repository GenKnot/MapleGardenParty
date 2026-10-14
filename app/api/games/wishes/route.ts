import { db } from "@/lib/db";
import { WISH_CATEGORIES } from "@/lib/wishes";
import { body, fail, needParticipant, ok } from "@/lib/server/http";

export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  const cats = Array.isArray(b.categories)
    ? [...new Set(b.categories.filter((c): c is string => (WISH_CATEGORIES as readonly string[]).includes(c as string)))]
    : [];
  if (cats.length === 0) return fail("category_required");
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 280) : "";
  await db.addWish({ participantId: p.id, categories: cats, message, isPublic: b.isPublic === true });
  const awarded = await db.awardStamp(p.id, "wishes");
  return ok({ awarded });
}
