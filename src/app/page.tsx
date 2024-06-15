import {
  isSection,
  ItemCardType,
  ItemSections,
  ItemSectionsType,
  ItemService,
} from "@/entities/item";
import { ItemCard } from "@/features/itemCard";
import { Section } from "@/widgets/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: ".Torrent",
  description:
    ".Torrent - сервис обмена .torrent файлами видеоигр, фильмов и аудиокниг",
};

export default async function Home() {
  const cards: { [k in ItemSectionsType]?: ItemCardType[] | null } = {};
  await Promise.all(
    ItemSections.map(async (section) => {
      cards[section] = await ItemService.itemSections[
        section
      ].service.GetCards();
    })
  );

  return (
    <>
      {ItemSections.map((section) => (
        <section key={section}>
          {cards[section] && cards[section].length > 0 && (
            <Section
              name={ItemService.itemSections[section].popularSubsectionName}
              link={isSection(section) ? `/${section}` : undefined}
              invite_text={ItemService.itemSections[section].sectionInviteText}
            >
              {cards[section].map((card) => (
                <ItemCard key={card.id} card={card} />
              ))}
            </Section>
          )}
        </section>
      ))}
    </>
  );
}
