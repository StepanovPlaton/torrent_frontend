import { GameCardType } from "@/entities/game";
import Image from "next/image";
import Link from "next/link";

export const GameCard = ({ card }: { card: GameCardType }) => {
  return (
    <Link className="group/gamecard cursor-pointer" href={"/games/" + card.id}>
      {!!card.cover_preview && (
        <Image
          src={card.cover_preview}
          className="rounded-lg"
          alt=""
          width={700}
          height={400}
        />
      )}
      <div className="flex items-center justify-between pr-2">
        <h2 className="text-2xl py-1 group-hover/gamecard:underline underline-offset-4">
          {card.title}
        </h2>
        {card.version && (
          <span className="text-xs max-w-[30%] line-clamp-2 text-fg4">
            {card.version}
          </span>
        )}
      </div>
      <p className="text-lg tb:text-sm pr-2 text-justify line-clamp-5 text-fg4">
        {card.description}
      </p>
    </Link>
  );
};
