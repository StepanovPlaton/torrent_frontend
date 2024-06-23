import { ItemService } from "@/entities/item";
import { SectionService } from "@/features/sections";
import { ItemCard } from "@/widgets/itemCard";
import { ItemInfo } from "@/widgets/itemInfo";
import { Section } from "@/widgets/section";
import { redirect } from "next/navigation";

export default async function Item({
  params: { section, item_id },
}: {
  params: { section: string; item_id: number };
}) {
  const game = SectionService.isSection(section)
    ? await ItemService.itemsConfiguration[
        SectionService.sectionsConfiguration[section].itemType
      ].service.Get(item_id)
    : redirect("/");

  const cards =
    SectionService.isSection(section) &&
    (await ItemService.itemsConfiguration[
      SectionService.sectionsConfiguration[section].itemType
    ].service.GetCards());

  return (
    <>
      {game && <ItemInfo item={game} />}

      {cards && (
        <Section
          name={
            SectionService.isSection(section)
              ? SectionService.sectionsConfiguration[section]
                  .popularSubsectionName
              : undefined
          }
          link={SectionService.isSection(section) ? `/${section}` : undefined}
          invite_text={
            SectionService.isSection(section)
              ? SectionService.sectionsConfiguration[section].sectionInviteText
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
