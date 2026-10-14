import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { GameId } from "@/lib/games";
import type { Participant, Redemption, Stamp, Stats, Store } from "./types";

type Wish = { participantId: string; categories: string[]; message: string; isPublic: boolean; createdAt: string };
type Data = {
  participants: Record<string, Participant>;
  progress: Record<string, unknown>;
  stamps: Record<string, Stamp[]>;
  redemptions: Record<string, Redemption>;
  wishes: Wish[];
};

const FILE = path.join(process.cwd(), ".data", "db.json");
const g = globalThis as unknown as { __fhLock?: Promise<unknown> };

function empty(): Data {
  return { participants: {}, progress: {}, stamps: {}, redemptions: {}, wishes: [] };
}

async function read(): Promise<Data> {
  try {
    return { ...empty(), ...JSON.parse(await fs.readFile(FILE, "utf8")) };
  } catch {
    return empty();
  }
}

async function write(d: Data) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(d, null, 2));
  await fs.rename(tmp, FILE);
}

// Serialises read-modify-write cycles so concurrent requests cannot interleave.
function tx<T>(fn: (d: Data) => T | Promise<T>): Promise<T> {
  const run = (g.__fhLock ?? Promise.resolve()).then(async () => {
    const d = await read();
    const out = await fn(d);
    await write(d);
    return out;
  });
  g.__fhLock = run.catch(() => undefined);
  return run;
}

const now = () => new Date().toISOString();

export const fileStore: Store = {
  createParticipant: (p) =>
    tx((d) => {
      const full: Participant = { ...p, createdAt: now(), lastActiveAt: now() };
      d.participants[p.id] = full;
      return full;
    }),
  getParticipant: async (id) => (await read()).participants[id] ?? null,
  getParticipantByShortCode: async (code) =>
    Object.values((await read()).participants).find((p) => p.shortCode === code) ?? null,
  updateParticipant: (id, patch) =>
    tx((d) => {
      const p = d.participants[id];
      if (p) d.participants[id] = { ...p, ...patch, lastActiveAt: now() };
    }),
  getProgress: async <T>(pid: string, gameId: GameId) => ((await read()).progress[`${pid}:${gameId}`] as T) ?? null,
  saveProgress: (pid, gameId, state) =>
    tx((d) => {
      d.progress[`${pid}:${gameId}`] = state;
    }),
  awardStamp: (pid, gameId, confirmedBy) =>
    tx((d) => {
      const list = (d.stamps[pid] ??= []);
      if (list.some((s) => s.gameId === gameId)) return false;
      list.push({ gameId, awardedAt: now(), confirmedBy: confirmedBy ?? null });
      return true;
    }),
  listStamps: async (pid) => (await read()).stamps[pid] ?? [],
  getRedemption: async (pid) => (await read()).redemptions[pid] ?? null,
  createRedemptionIfAbsent: (pid, tokenHash) =>
    tx((d) => {
      d.redemptions[pid] ??= {
        participantId: pid,
        tokenHash,
        status: "issued",
        issuedAt: now(),
        redeemedAt: null,
        staffId: null,
      };
      return d.redemptions[pid];
    }),
  redeem: (tokenHash, staffId) =>
    tx((d) => {
      const r = Object.values(d.redemptions).find((x) => x.tokenHash === tokenHash);
      if (!r) return { ok: false as const, reason: "not_found" as const };
      if (r.status === "redeemed") {
        return { ok: false as const, reason: "already_redeemed" as const, redeemedAt: r.redeemedAt ?? undefined };
      }
      r.status = "redeemed";
      r.redeemedAt = now();
      r.staffId = staffId;
      return {
        ok: true as const,
        participant: d.participants[r.participantId],
        stamps: (d.stamps[r.participantId] ?? []).map((s) => s.gameId),
      };
    }),
  addWish: (w) =>
    tx((d) => {
      d.wishes.push({ ...w, createdAt: now() });
    }),
  stats: async (): Promise<Stats> => {
    const d = await read();
    const stampsByGame: Record<string, number> = {};
    let reachedThree = 0;
    for (const list of Object.values(d.stamps)) {
      for (const s of list) stampsByGame[s.gameId] = (stampsByGame[s.gameId] ?? 0) + 1;
      if (list.length >= 3) reachedThree++;
    }
    const wishCategories: Record<string, number> = {};
    for (const w of d.wishes) for (const c of w.categories) wishCategories[c] = (wishCategories[c] ?? 0) + 1;
    return {
      participants: Object.keys(d.participants).length,
      stampsByGame,
      reachedThree,
      redeemed: Object.values(d.redemptions).filter((r) => r.status === "redeemed").length,
      wishes: d.wishes.length,
      wishCategories,
    };
  },
};
