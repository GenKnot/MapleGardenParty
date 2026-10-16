import { MUSIC, MUSIC_GOAL } from "@/content/music";
import { MUSIC_READY } from "@/lib/games";
import { makeRound } from "@/lib/server/rounds";

const round = makeRound({ game: "music", questions: MUSIC, goal: MUSIC_GOAL, enabled: MUSIC_READY });
export const GET = round.GET;
export const POST = round.POST;
