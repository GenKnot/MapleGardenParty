import { db, storeKind } from "@/lib/db";
import { fail, needStaff, ok } from "@/lib/server/http";

export async function GET() {
  const s = await needStaff();
  if (!s) return fail("unauthorized", 401);
  return ok({ staff: s.name, store: storeKind(), stats: await db.stats() });
}
