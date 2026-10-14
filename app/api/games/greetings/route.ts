import { db } from "@/lib/db";
import { body, fail, needParticipant, ok } from "@/lib/server/http";

// The card is rendered on the device. The server only checks that a real blessing was written
// and never stores the text, so no personal content is retained.
export async function POST(req: Request) {
  const p = await needParticipant();
  if (!p) return fail("no_session", 401);
  const b = await body(req);
  const text = typeof b.text === "string" ? [...b.text.trim()].length : 0;
  if (text < 2 || text > 40) return fail("bad_text");
  const awarded = await db.awardStamp(p.id, "greetings");
  return ok({ awarded });
}
