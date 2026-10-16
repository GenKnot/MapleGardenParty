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

// Set to false to hide the music game (for example if the clips in public/audio/ are not ready).
// While false the music card shows "coming soon" and its API refuses requests.
export const MUSIC_READY = true;

export const GAMES: GameMeta[] = [
  { id: "culture-quiz", kind: "online", live: true },
  { id: "zodiac", kind: "online", live: true },
  { id: "wishes", kind: "online", live: true },
  { id: "pitch-pot", kind: "onsite", live: true },
  { id: "handcraft", kind: "onsite", live: true },
  { id: "poetry", kind: "online", live: true },
  { id: "calligraphy", kind: "online", live: true },
  { id: "greetings", kind: "online", live: true },
  { id: "music", kind: "online", live: MUSIC_READY },
  { id: "puzzle", kind: "online", live: true },
  { id: "riddles", kind: "online", live: true },
];

export const GAME_IDS = GAMES.map((g) => g.id);
export const LIVE_GAME_IDS = GAMES.filter((g) => g.live).map((g) => g.id);
export const ONSITE_GAME_IDS = GAMES.filter((g) => g.kind === "onsite").map((g) => g.id);

export function isGameId(v: unknown): v is GameId {
  return typeof v === "string" && (GAME_IDS as string[]).includes(v);
}
