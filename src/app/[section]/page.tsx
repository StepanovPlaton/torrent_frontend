import { ItemService } from "@/entities/item";
import { ItemCard } from "@/widgets/itemCard";
import { Section } from "@/widgets/section";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SectionService } from "@/features/sections";

export async function generateMetadata({
  params: { section },
}: {
  params: { section: string };
}): Promise<Metadata> {
  if (!SectionService.isSection(section)) {
    redirect("/");
  }
  return {
    title: `.Torrent: ${SectionService.sectionsConfiguration[section].sectionName}`,
    description:
      `.Torrent: ` +
      `${SectionService.sectionsConfiguration[section].sectionName} - ` +
      `${SectionService.sectionsConfiguration[section].sectionDescription}`,
  };
}

export default async function SectionPage({
  params: { section },
}: {
  params: { section: string };
}) {
  const cards = SectionService.isSection(section)
    ? await ItemService.itemsConfiguration[
        SectionService.sectionsConfiguration[section].itemType
      ].service.GetCards()
    : redirect("/");

  return (
    <>
      {cards && cards.length > 0 && (
        <Section>
          {cards.map((card) => (
            <ItemCard key={card.id} card={card} />
          ))}
        </Section>
      )}
    </>
  );
}
