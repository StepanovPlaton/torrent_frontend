import { GameService, isSection, ItemService } from "@/entities/item";
import { ItemCard } from "@/features/itemCard";
import { ItemInfo } from "@/widgets/itemInfo";
import { Section } from "@/widgets/section";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params: { section },
}: {
  params: { section: string };
}): Promise<Metadata> {
  if (!isSection(section)) {
    redirect("/");
    return {};
  }
  return {
    title: `.Torrent: ${ItemService.itemSections[section].addItemText}`,
  };
}

export default async function AddItem({
  params: { section },
}: {
  params: { section: string };
}) {
  const emptyItem = isSection(section)
    ? await ItemService.itemSections[section].service.GetEmpty()
    : redirect("/");

  const cards =
    isSection(section) &&
    (await ItemService.itemSections[section].service.GetCards());

  return (
    <>
      <ItemInfo item={emptyItem} />

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
