import { GameService, GameType, isSection, ItemService } from "@/entities/item";
import { ItemCard } from "@/features/itemCard";
import { ItemInfo } from "@/widgets/itemInfo";
import { Section } from "@/widgets/section";
import { redirect } from "next/navigation";

export default async function Item({
  params: { section, item_id },
}: {
  params: { section: string; item_id: number };
}) {
  const game = isSection(section)
    ? await ItemService.itemSections[section].service.Get(item_id)
    : redirect("/");

  const cards =
    isSection(section) &&
    (await ItemService.itemSections[section].service.GetCards());

  return (
    <>
      {game && <ItemInfo item={game} />}

      {cards && (
        <Section
          name={
            isSection(section)
              ? ItemService.itemSections[section].popularSubsectionName
              : undefined
          }
          link={isSection(section) ? `/${section}` : undefined}
          invite_text={
            isSection(section)
              ? ItemService.itemSections[section].sectionInviteText
              : undefined
          }
        >
          {cards.map((card) => (
            <ItemCard key={card.id} card={card} />
          ))}
        </Section>
      )}
    </>
  );
}
