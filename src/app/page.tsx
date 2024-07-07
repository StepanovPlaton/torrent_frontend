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
  const requests = SectionService.sections.map((section) =>
    ItemService.itemsConfiguration[
      SectionService.sectionsConfiguration[section].itemType
    ].service.GetCards()
  );
  const data = await Promise.all(requests);

  const cards = await SectionService.sections.reduce(
    (cards, section, i) => ({
      ...cards,
      [section]: data[i],
    }),
    {} as { [k in SectionType]: ItemCardType[] | null }
  );

  return (
    <>
      {cards &&
        SectionService.sections.map((section, i) => (
          <section key={section}>
            {cards[section] && (
              <Section
                name={
                  SectionService.sectionsConfiguration[section]
                    .popularSubsectionName
                }
                link={
                  SectionService.isSection(section) ? `/${section}` : undefined
                }
                invite_text={
                  SectionService.sectionsConfiguration[section]
                    .sectionInviteText
                }
              >
                {cards[section]?.map((card) => (
                  <ItemCard key={card.id} card={card} />
                ))}
              </Section>
            )}
          </section>
        ))}
    </>
  );
}
