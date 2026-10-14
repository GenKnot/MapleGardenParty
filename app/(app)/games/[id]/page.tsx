import { notFound } from "next/navigation";
import { GameView } from "@/components/games/GameView";
import { isGameId } from "@/lib/games";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isGameId(id)) notFound();
  return <GameView id={id} />;
}
