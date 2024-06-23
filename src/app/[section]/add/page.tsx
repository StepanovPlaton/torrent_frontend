import { ItemCard } from "@/widgets/itemCard";
import { ItemInfo } from "@/widgets/itemInfo";
import { Section } from "@/widgets/section";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SectionService } from "@/features/sections";
import { ItemService } from "@/entities/item";

export async function generateMetadata({
  params: { section },
}: {
  params: { section: string };
}): Promise<Metadata> {
  if (!SectionService.isSection(section)) {
    redirect("/");
    return {};
  }
  return {
    title: `.Torrent: ${SectionService.sectionsConfiguration[section].addItemText}`,
  };
}

export default async function AddItem({
  params: { section },
}: {
  params: { section: string };
}) {
  const emptyItem = SectionService.isSection(section)
    ? await ItemService.itemsConfiguration[
        SectionService.sectionsConfiguration[section].itemType
      ].service.GetEmpty()
    : redirect("/");

  const cards =
    SectionService.isSection(section) &&
    (await ItemService.itemsConfiguration[
      SectionService.sectionsConfiguration[section].itemType
    ].service.GetCards());

  return (
    <>
      <ItemInfo item={emptyItem} />

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
