import { RIDDLES, RIDDLES_GOAL } from "@/content/riddles";
import { makeRound } from "@/lib/server/rounds";

const round = makeRound({ game: "riddles", questions: RIDDLES, goal: RIDDLES_GOAL });
export const GET = round.GET;
export const POST = round.POST;
