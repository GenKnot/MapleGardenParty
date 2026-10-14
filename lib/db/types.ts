import type { GameId } from "@/lib/games";
import type { Locale } from "@/lib/locales";

export type Participant = {
  id: string;
  nickname: string;
  locale: Locale;
  kiosk: boolean;
  shortCode: string;
  createdAt: string;
  lastActiveAt: string;
};

export type Stamp = { gameId: GameId; awardedAt: string; confirmedBy: string | null };

export type RedeemStatus = "issued" | "redeemed";
export type Redemption = {
  participantId: string;
  tokenHash: string;
  status: RedeemStatus;
  issuedAt: string;
  redeemedAt: string | null;
  staffId: string | null;
};

export type RedeemResult =
  | { ok: true; participant: Participant; stamps: GameId[] }
  | { ok: false; reason: "not_found" | "already_redeemed"; redeemedAt?: string };

export type Stats = {
  participants: number;
  stampsByGame: Record<string, number>;
  reachedThree: number;
  redeemed: number;
  wishes: number;
  wishCategories: Record<string, number>;
};

export interface Store {
  createParticipant(p: Omit<Participant, "createdAt" | "lastActiveAt">): Promise<Participant>;
  getParticipant(id: string): Promise<Participant | null>;
  getParticipantByShortCode(code: string): Promise<Participant | null>;
  updateParticipant(id: string, patch: Partial<Pick<Participant, "locale" | "nickname">>): Promise<void>;
  getProgress<T>(pid: string, gameId: GameId): Promise<T | null>;
  saveProgress(pid: string, gameId: GameId, state: unknown): Promise<void>;
  /** Returns true only if the stamp was newly created. */
  awardStamp(pid: string, gameId: GameId, confirmedBy?: string): Promise<boolean>;
  listStamps(pid: string): Promise<Stamp[]>;
  getRedemption(pid: string): Promise<Redemption | null>;
  createRedemptionIfAbsent(pid: string, tokenHash: string): Promise<Redemption>;
  /** Atomic issued -> redeemed. */
  redeem(tokenHash: string, staffId: string): Promise<RedeemResult>;
  addWish(w: { participantId: string; categories: string[]; message: string; isPublic: boolean }): Promise<void>;
  stats(): Promise<Stats>;
}
