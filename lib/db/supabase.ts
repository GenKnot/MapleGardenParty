import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { GameId } from "@/lib/games";
import type { Participant, Redemption, Stamp, Stats, Store } from "./types";

function client() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

type PRow = {
  id: string;
  nickname: string;
  locale: Participant["locale"];
  kiosk_mode: boolean;
  short_code: string;
  created_at: string;
  last_active_at: string;
};

const toParticipant = (r: PRow): Participant => ({
  id: r.id,
  nickname: r.nickname,
  locale: r.locale,
  kiosk: r.kiosk_mode,
  shortCode: r.short_code,
  createdAt: r.created_at,
  lastActiveAt: r.last_active_at,
});

type RRow = {
  participant_id: string;
  token_hash: string;
  status: Redemption["status"];
  issued_at: string;
  redeemed_at: string | null;
  staff_id: string | null;
};

const toRedemption = (r: RRow): Redemption => ({
  participantId: r.participant_id,
  tokenHash: r.token_hash,
  status: r.status,
  issuedAt: r.issued_at,
  redeemedAt: r.redeemed_at,
  staffId: r.staff_id,
});

function must<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export const supabaseStore: Store = {
  async createParticipant(p) {
    const row = must(
      await client()
        .from("participants")
        .insert({ id: p.id, nickname: p.nickname, locale: p.locale, kiosk_mode: p.kiosk, short_code: p.shortCode })
        .select()
        .single(),
    );
    return toParticipant(row as PRow);
  },
  async getParticipant(id) {
    const row = must(await client().from("participants").select().eq("id", id).maybeSingle());
    return row ? toParticipant(row as PRow) : null;
  },
  async getParticipantByShortCode(code) {
    const row = must(await client().from("participants").select().eq("short_code", code).maybeSingle());
    return row ? toParticipant(row as PRow) : null;
  },
  async updateParticipant(id, patch) {
    must(
      await client()
        .from("participants")
        .update({ ...patch, last_active_at: new Date().toISOString() })
        .eq("id", id),
    );
  },
  async getProgress<T>(pid: string, gameId: GameId) {
    const row = must(
      await client().from("game_progress").select("state").eq("participant_id", pid).eq("game_id", gameId).maybeSingle(),
    );
    return (row?.state as T) ?? null;
  },
  async saveProgress(pid, gameId, state) {
    must(
      await client()
        .from("game_progress")
        .upsert(
          { participant_id: pid, game_id: gameId, state, updated_at: new Date().toISOString() },
          { onConflict: "participant_id,game_id" },
        ),
    );
  },
  async awardStamp(pid, gameId, confirmedBy) {
    const rows = must(
      await client()
        .from("stamp_awards")
        .upsert(
          { participant_id: pid, game_id: gameId, confirmed_by: confirmedBy ?? null },
          { onConflict: "participant_id,game_id", ignoreDuplicates: true },
        )
        .select(),
    );
    return (rows?.length ?? 0) > 0;
  },
  async listStamps(pid) {
    const rows = must(await client().from("stamp_awards").select().eq("participant_id", pid));
    return (rows ?? []).map(
      (r): Stamp => ({ gameId: r.game_id as GameId, awardedAt: r.awarded_at, confirmedBy: r.confirmed_by }),
    );
  },
  async getRedemption(pid) {
    const row = must(await client().from("redemptions").select().eq("participant_id", pid).maybeSingle());
    return row ? toRedemption(row as RRow) : null;
  },
  async createRedemptionIfAbsent(pid, tokenHash) {
    const c = client();
    must(
      await c
        .from("redemptions")
        .upsert({ participant_id: pid, token_hash: tokenHash }, { onConflict: "participant_id", ignoreDuplicates: true }),
    );
    const row = must(await c.from("redemptions").select().eq("participant_id", pid).single());
    return toRedemption(row as RRow);
  },
  async redeem(tokenHash, staffId) {
    const c = client();
    // Single UPDATE ... WHERE status='issued' makes the transition atomic.
    const updated = must(
      await c
        .from("redemptions")
        .update({ status: "redeemed", redeemed_at: new Date().toISOString(), staff_id: staffId })
        .eq("token_hash", tokenHash)
        .eq("status", "issued")
        .select(),
    );
    if (updated && updated.length > 0) {
      const pid = (updated[0] as RRow).participant_id;
      const p = must(await c.from("participants").select().eq("id", pid).single());
      const stamps = must(await c.from("stamp_awards").select("game_id").eq("participant_id", pid));
      return { ok: true, participant: toParticipant(p as PRow), stamps: (stamps ?? []).map((s) => s.game_id as GameId) };
    }
    const existing = must(await c.from("redemptions").select().eq("token_hash", tokenHash).maybeSingle());
    if (!existing) return { ok: false, reason: "not_found" };
    return { ok: false, reason: "already_redeemed", redeemedAt: (existing as RRow).redeemed_at ?? undefined };
  },
  async addWish(w) {
    must(
      await client()
        .from("wishes")
        .insert({ participant_id: w.participantId, categories: w.categories, message: w.message, is_public: w.isPublic }),
    );
  },
  async stats(): Promise<Stats> {
    const c = client();
    const pCount = (await c.from("participants").select("id", { count: "exact", head: true })).count ?? 0;
    const stamps = must(await c.from("stamp_awards").select("participant_id, game_id")) ?? [];
    const redeemed =
      (await c.from("redemptions").select("participant_id", { count: "exact", head: true }).eq("status", "redeemed"))
        .count ?? 0;
    const wishes = must(await c.from("wishes").select("categories")) ?? [];
    const stampsByGame: Record<string, number> = {};
    const perPerson: Record<string, number> = {};
    for (const s of stamps) {
      stampsByGame[s.game_id] = (stampsByGame[s.game_id] ?? 0) + 1;
      perPerson[s.participant_id] = (perPerson[s.participant_id] ?? 0) + 1;
    }
    const wishCategories: Record<string, number> = {};
    for (const w of wishes) for (const cat of (w.categories as string[]) ?? []) wishCategories[cat] = (wishCategories[cat] ?? 0) + 1;
    return {
      participants: pCount,
      stampsByGame,
      reachedThree: Object.values(perPerson).filter((n) => n >= 3).length,
      redeemed,
      wishes: wishes.length,
      wishCategories,
    };
  },
};
