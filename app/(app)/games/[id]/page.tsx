import { notFound } from "next/navigation";
import { GameView } from "@/components/games/GameView";
import { GAMES, isGameId } from "@/lib/games";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isGameId(id) || GAMES.find((g) => g.id === id)?.hidden) notFound();
  return <GameView id={id} />;
}
