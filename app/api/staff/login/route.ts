import { setStaff, staffPasscodeOk } from "@/lib/server/auth";
import { body, fail, ok } from "@/lib/server/http";

export async function POST(req: Request) {
  const b = await body(req);
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 30) : "";
  const pass = typeof b.passcode === "string" ? b.passcode : "";
  if (!name) return fail("name_required");
  if (!staffPasscodeOk(pass)) return fail("bad_passcode", 401);
  await setStaff(name);
  return ok({ name });
}
