import { ZodSchema } from "zod";
import { gameCreateSchema } from "./game/schemas/game";
import { movieCreateSchema } from "./movie/schemas/movie";
import { MovieService } from "./movie/movie";
import { GameService } from "./game/game";
import { audiobookCreateSchema } from "./audiobook/schemas/audiobook";
import { AudiobookService } from "./audiobook/audiobook";
import {
  IItemService,
  ItemCardType,
  ItemCreateType,
  ItemPropertiesDescriptionType,
  ItemSectionsType,
  ItemType,
  TypesOfItems,
  UnionItemType,
} from "./types";
import { EraseCacheByTag } from "@/shared/utils/http";

export abstract class ItemService {
  private static get itemsConfiguration(): {
    [k in TypesOfItems]: {
      sectionUrl: ItemSectionsType;
      formResolver: ZodSchema;
      propertiesDescription: ItemPropertiesDescriptionType<UnionItemType>;
      service: IItemService;
    };
  } {
    return {
      [TypesOfItems.game]: {
        sectionUrl: "games",
        formResolver: gameCreateSchema,
        propertiesDescription: GameService.propertiesDescription,
        service: GameService,
      },
      [TypesOfItems.movie]: {
        sectionUrl: "movies",
        formResolver: movieCreateSchema,
        propertiesDescription: MovieService.propertiesDescription,
        service: MovieService,
      },
      [TypesOfItems.audiobook]: {
        sectionUrl: "audiobooks",
        formResolver: audiobookCreateSchema,
        propertiesDescription: AudiobookService.propertiesDescription,
        service: AudiobookService,
      },
    };
  }

  static get itemSections(): {
    [k in ItemSectionsType]: {
      sectionName: string;
      itemType: TypesOfItems;
      popularSubsectionName: string;
      sectionInviteText: string;
      addItemText: string;
      sectionDescription: string;
      service: IItemService;
    };
  } {
    return {
      games: {
        sectionName: "Игры",
        itemType: TypesOfItems.game,
        popularSubsectionName: "Популярные игры",
        sectionInviteText: 'Перейти в раздел "Игры"',
        addItemText: "Добавить игру",
        sectionDescription:
          "каталог .torrent файлов для обмена актуальными версиями популярных игр",
        service: GameService,
      },
      movies: {
        sectionName: "Фильмы",
        itemType: TypesOfItems.movie,
        popularSubsectionName: "Популярные фильмы",
        sectionInviteText: 'Перейти в раздел "Фильмы"',
        addItemText: "Добавить фильм",
        sectionDescription:
          "каталог .torrent файлов для обмена популярными фильмами в лучшем качестве",
        service: MovieService,
      },
      audiobooks: {
        sectionName: "Аудиокниги",
        itemType: TypesOfItems.audiobook,
        popularSubsectionName: "Популярные аудиокниги",
        sectionInviteText: 'Перейти в раздел "Аудиокниги"',
        addItemText: "Добавить аудиокнигу",
        sectionDescription:
          "каталог .torrent файлов для обмена популярными аудиокнигами любимых авторов",
        service: AudiobookService,
      },
    };
  }

  public static isExistingItem(
    item: ItemCreateType | ItemType
  ): item is ItemType {
    return (item as ItemType).id !== undefined;
  }

  public static GetFormResolver(
    item: ItemCardType | ItemCreateType | ItemType
  ) {
    return this.itemsConfiguration[item.type].formResolver;
  }

  public static GetSectionUrlByItemType(
    item: ItemCardType | ItemCreateType | ItemType
  ) {
    return this.itemsConfiguration[item.type].sectionUrl;
  }

  public static GetPropertiesDescriptionForItem<
    T extends ItemType | ItemCreateType
  >(item: T) {
    return this.itemsConfiguration[item.type]
      .propertiesDescription as ItemPropertiesDescriptionType<T>;
  }

  public static async AddItem(itemInfo: ItemCreateType) {
    const item = await this.itemsConfiguration[itemInfo.type].service.Add(
      itemInfo
    );

    if (item)
      EraseCacheByTag(
        `/${this.itemsConfiguration[itemInfo.type].service.urlPrefix}/${
          item.id
        }`
      );
    return item;
  }
  public static async ChangeItem(id: number, itemInfo: ItemCreateType) {
    const item = await this.itemsConfiguration[itemInfo.type].service.Change(
      id,
      itemInfo
    );
    if (item)
      EraseCacheByTag(
        `/${this.itemsConfiguration[itemInfo.type].service.urlPrefix}/${
          item.id
        }`
      );
    return item;
  }
}
