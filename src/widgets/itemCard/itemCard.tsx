import {
  isAudiobook,
  isGame,
  isMovie,
  ItemCardType,
  ItemService,
} from "@/entities/item";
import { SectionService } from "@/features/sections";
import { Img } from "@/shared/ui";
import Link from "next/link";

export const ItemCard = ({ card }: { card: ItemCardType }) => {
  return (
    <Link
      className="group/itemcard cursor-pointer"
      href={
        "/" +
        SectionService.sectionsConfiguration[
          SectionService.itemTypeToSection[card.type]
        ].sectionUrl +
        "/" +
        card.id
      }
    >
      {!!card.cover && (
        <Img
          src={card.cover}
          preview={true}
          className="rounded-lg object-contain"
          width={1280}
          height={720}
        />
      )}
      <div className="flex items-center justify-between pr-2">
        <h2 className="text-3xl tb:text-xl py-1 group-hover/itemcard:underline underline-offset-1">
          {card.title}
        </h2>

        {isGame(card) && card.version && (
          <span className="text-xs max-w-[30%] text-right line-clamp-2 text-fg4">
            {card.version}
          </span>
        )}
        {isMovie(card) && card.age && (
          <span className="text-xs max-w-[30%] text-right line-clamp-2 text-fg4">
            {card.age}
          </span>
        )}
        {isAudiobook(card) && card.author && (
          <span className="text-xs max-w-[40%] text-right line-clamp-2 text-fg4">
            {card.author}
          </span>
        )}
      </div>
      <p className="text-lg tb:text-sm pr-2 text-justify line-clamp-5 text-fg4">
        {card.description}
      </p>
    </Link>
  );
};
