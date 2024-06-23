import { TypesOfItems } from "@/entities/item";

export type SectionType = (typeof SectionService.sections)[number];

export abstract class SectionService {
  static get itemTypeToSection(): { [k in TypesOfItems]: SectionType } {
    return {
      [TypesOfItems.game]: "games",
      [TypesOfItems.movie]: "movies",
      [TypesOfItems.audiobook]: "audiobooks",
    };
  }

  static get sectionsConfiguration(): {
    [k in SectionType]: {
      sectionName: string;
      sectionUrl: string;
      itemType: TypesOfItems;
      popularSubsectionName: string;
      sectionInviteText: string;
      addItemText: string;
      sectionDescription: string;
    };
  } {
    return {
      games: {
        sectionName: "Игры",
        sectionUrl: "games",
        itemType: TypesOfItems.game,
        popularSubsectionName: "Популярные игры",
        sectionInviteText: 'Перейти в раздел "Игры"',
        addItemText: "Добавить игру",
        sectionDescription:
          "каталог .torrent файлов для обмена актуальными версиями популярных игр",
      },
      movies: {
        sectionName: "Фильмы",
        sectionUrl: "movies",
        itemType: TypesOfItems.movie,
        popularSubsectionName: "Популярные фильмы",
        sectionInviteText: 'Перейти в раздел "Фильмы"',
        addItemText: "Добавить фильм",
        sectionDescription:
          "каталог .torrent файлов для обмена популярными фильмами в лучшем качестве",
      },
      audiobooks: {
        sectionName: "Аудиокниги",
        sectionUrl: "audiobooks",
        itemType: TypesOfItems.audiobook,
        popularSubsectionName: "Популярные аудиокниги",
        sectionInviteText: 'Перейти в раздел "Аудиокниги"',
        addItemText: "Добавить аудиокнигу",
        sectionDescription:
          "каталог .torrent файлов для обмена популярными аудиокнигами любимых авторов",
      },
    };
  }

  static sections = ["games", "movies", "audiobooks"] as const;

  static isSection = (a: string): a is SectionType => {
    return this.sections.includes(a as SectionType);
  };
}
