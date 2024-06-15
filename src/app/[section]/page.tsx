import { isSection, ItemService, MovieService } from "@/entities/item";
import { ItemCard } from "@/features/itemCard";
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
    title: `.Torrent: ${ItemService.itemSections[section].sectionName}`,
    description: `.Torrent: ${ItemService.itemSections[section].sectionName} - ${ItemService.itemSections[section].sectionName}`,
  };
}

export default async function SectionPage({
  params: { section },
}: {
  params: { section: string };
}) {
  const cards = isSection(section)
    ? await ItemService.itemSections[section].service.GetCards()
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
