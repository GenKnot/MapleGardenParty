export type GameId =
  | "culture-quiz"
  | "music"
  | "poetry"
  | "calligraphy"
  | "zodiac"
  | "greetings"
  | "puzzle"
  | "wishes"
  | "riddles"
  | "pitch-pot"
  | "handcraft";

export type GameMeta = {
  id: GameId;
  kind: "online" | "onsite";
  live: boolean;
};

export const STAMPS_REQUIRED = 3;

export const GAMES: GameMeta[] = [
  { id: "culture-quiz", kind: "online", live: true },
  { id: "zodiac", kind: "online", live: true },
  { id: "wishes", kind: "online", live: true },
  { id: "pitch-pot", kind: "onsite", live: true },
  { id: "handcraft", kind: "onsite", live: true },
  { id: "poetry", kind: "online", live: true },
  { id: "calligraphy", kind: "online", live: true },
  { id: "greetings", kind: "online", live: true },
  { id: "music", kind: "online", live: false },
  { id: "puzzle", kind: "online", live: false },
  { id: "riddles", kind: "online", live: false },
];

export const GAME_IDS = GAMES.map((g) => g.id);
export const LIVE_GAME_IDS = GAMES.filter((g) => g.live).map((g) => g.id);
export const ONSITE_GAME_IDS = GAMES.filter((g) => g.kind === "onsite").map((g) => g.id);

export function isGameId(v: unknown): v is GameId {
  return typeof v === "string" && (GAME_IDS as string[]).includes(v);
}
