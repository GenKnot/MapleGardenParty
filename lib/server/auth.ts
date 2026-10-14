import "server-only";
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { Participant } from "@/lib/db/types";

const SESSION_COOKIE = "fh_sid";
const STAFF_COOKIE = "fh_staff";
const COOKIE_BASE = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET (16+ chars) is required in production.");
  return "dev-only-secret-change-me";
}

const hmac = (msg: string) => createHmac("sha256", secret()).update(msg).digest("hex");
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/I/L

export function randomCode(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** Deterministic per-participant redeem token: unguessable, not derived from any personal data. */
export function redeemToken(participantId: string): string {
  const raw = Buffer.from(hmac("redeem:" + participantId), "hex");
  let out = "";
  for (let i = 0; i < 10; i++) out += ALPHABET[raw[i] % ALPHABET.length];
  return out;
}

export async function setSession(participantId: string) {
  (await cookies()).set(SESSION_COOKIE, `${participantId}.${hmac("sid:" + participantId).slice(0, 24)}`, {
    ...COOKIE_BASE,
    maxAge: 60 * 60 * 24,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

function safeEq(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function currentParticipant(): Promise<Participant | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [id, sig] = raw.split(".");
  if (!id || !sig || !safeEq(sig, hmac("sid:" + id).slice(0, 24))) return null;
  return db.getParticipant(id);
}

export type StaffSession = { name: string };

export async function setStaff(name: string) {
  const payload = Buffer.from(JSON.stringify({ n: name, t: Date.now() })).toString("base64url");
  (await cookies()).set(STAFF_COOKIE, `${payload}.${hmac("staff:" + payload)}`, {
    ...COOKIE_BASE,
    maxAge: 60 * 60 * 12,
  });
}

export async function clearStaff() {
  (await cookies()).delete(STAFF_COOKIE);
}

export async function currentStaff(): Promise<StaffSession | null> {
  const raw = (await cookies()).get(STAFF_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeEq(sig, hmac("staff:" + payload))) return null;
  try {
    const { n } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof n === "string" ? { name: n } : null;
  } catch {
    return null;
  }
}

export function staffPasscodeOk(input: string): boolean {
  const expected = process.env.STAFF_PASSCODE ?? (process.env.NODE_ENV === "production" ? "" : "fenghua-dev");
  return expected.length >= 6 && safeEq(sha256(input), sha256(expected));
}

export function newId() {
  return crypto.randomUUID();
}

export function newShortCode() {
  return randomCode(6);
}
