import { ItemCardType, ItemService } from "@/entities/item";
import { ItemCard } from "@/widgets/itemCard";
import { SectionService, SectionType } from "@/features/sections";
import { Section } from "@/widgets/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: ".Torrent",
  description:
    ".Torrent - сервис обмена .torrent файлами видеоигр, фильмов и аудиокниг",
};

export default async function Home() {
  const cards: { [k in SectionType]?: ItemCardType[] | null } = {};
  await Promise.all(
    SectionService.sections.map(async (section) => {
      cards[section] = await ItemService.itemsConfiguration[
        SectionService.sectionsConfiguration[section].itemType
      ].service.GetCards();
    })
  );

  return (
    <>
      {SectionService.sections.map((section) => (
        <section key={section}>
          {cards[section] && cards[section].length > 0 && (
            <Section
              name={
                SectionService.sectionsConfiguration[section]
                  .popularSubsectionName
              }
              link={
                SectionService.isSection(section) ? `/${section}` : undefined
              }
              invite_text={
                SectionService.sectionsConfiguration[section].sectionInviteText
              }
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
