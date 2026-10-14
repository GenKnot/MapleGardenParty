import Image from "next/image";
import type { GameId } from "@/lib/games";

export function StampImg({
  id,
  earned,
  size = 96,
  alt,
}: {
  id: GameId;
  earned: boolean;
  size?: number;
  alt: string;
}) {
  return (
    <Image
      src={`/stamps/${id}-${earned ? "earned" : "locked"}.svg`}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      draggable={false}
    />
  );
}
