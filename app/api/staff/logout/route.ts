import { clearStaff } from "@/lib/server/auth";
import { ok } from "@/lib/server/http";

export async function POST() {
  await clearStaff();
  return ok();
}
