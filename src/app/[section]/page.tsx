import { isSection, ItemService, MovieService } from "@/entities/item";
import { ItemCard } from "@/features/itemCard";
import { Section } from "@/widgets/section";
import { redirect } from "next/navigation";

//export const metadata: Metadata = {
//  title: ".Torrent: Фильмы",
//  description: ".Torrent: Фильмы - каталог .torrent файлов для обмена фильмами",
//};

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
