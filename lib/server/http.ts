import "server-only";
import { currentParticipant, currentStaff } from "./auth";
import { isLocale, type Locale } from "@/lib/locales";

export const ok = (data: unknown = { ok: true }, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export const fail = (code: string, status = 400) => ok({ error: code }, status);

export async function body(req: Request): Promise<Record<string, unknown>> {
  try {
    const v = await req.json();
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function needParticipant() {
  const p = await currentParticipant();
  return p ?? null;
}

export async function needStaff() {
  return currentStaff();
}

export function localeOf(v: unknown, fallback: Locale = "zh-CN"): Locale {
  return isLocale(v) ? v : fallback;
}
