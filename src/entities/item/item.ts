import { ZodSchema } from "zod";
import { gameCreateSchema, gameSchema } from "./game/schemas/game";
import { movieCreateSchema, movieSchema } from "./movie/schemas/movie";
import { MovieService } from "./movie/movie";
import { HTTPService } from "@/shared/utils/http";
import { GameService } from "./game/game";
import {
  audiobookCreateSchema,
  audiobookSchema,
} from "./audiobook/schemas/audiobook";
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

export abstract class ItemService {
  private static get itemsConfiguration(): {
    [k in TypesOfItems]: {
      sectionUrl: ItemSectionsType;
      formResolver: ZodSchema;
      propertiesDescription: ItemPropertiesDescriptionType<UnionItemType>;
      AddItem: (itemInfo: ItemCreateType) => Promise<ItemType | null>;
      ChangeItem: (
        id: number,
        itemInfo: ItemCreateType
      ) => Promise<ItemType | null>;
    };
  } {
    return {
      [TypesOfItems.game]: {
        sectionUrl: "games",
        formResolver: gameCreateSchema,
        propertiesDescription: GameService.propertiesDescription,
        AddItem: async (itemInfo) =>
          await HTTPService.post(`/games`, gameSchema, itemInfo),
        ChangeItem: async (id: number, itemInfo) =>
          await HTTPService.put(`/games/${id}`, gameSchema, itemInfo),
      },
      [TypesOfItems.movie]: {
        sectionUrl: "movies",
        formResolver: movieCreateSchema,
        propertiesDescription: MovieService.propertiesDescription,
        AddItem: async (itemInfo) =>
          await HTTPService.post(`/movies`, movieSchema, itemInfo),
        ChangeItem: async (id: number, itemInfo) =>
          await HTTPService.put(`/movies/${id}`, movieSchema, itemInfo),
      },
      [TypesOfItems.audiobook]: {
        sectionUrl: "audiobooks",
        formResolver: audiobookCreateSchema,
        propertiesDescription: AudiobookService.propertiesDescription,
        AddItem: async (itemInfo) =>
          await HTTPService.post(`/audiobooks`, audiobookSchema, itemInfo),
        ChangeItem: async (id: number, itemInfo) =>
          await HTTPService.put(`/audiobooks/${id}`, audiobookSchema, itemInfo),
      },
    };
  }

  static get itemSections(): {
    [k in ItemSectionsType]: {
      itemType: TypesOfItems;
      popularSubsectionName: string;
      sectionInviteText: string;
      service: IItemService;
    };
  } {
    return {
      games: {
        itemType: TypesOfItems.game,
        popularSubsectionName: "Популярные игры",
        sectionInviteText: 'Перейти в раздел "Игры"',
        service: GameService,
      },
      movies: {
        itemType: TypesOfItems.movie,
        popularSubsectionName: "Популярные фильмы",
        sectionInviteText: 'Перейти в раздел "Фильмы"',
        service: MovieService,
      },
      audiobooks: {
        itemType: TypesOfItems.audiobook,
        popularSubsectionName: "Популярные аудиокниги",
        sectionInviteText: 'Перейти в раздел "Аудиокниги"',
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
    return await this.itemsConfiguration[itemInfo.type].AddItem(itemInfo);
  }
  public static async ChangeItem(id: number, itemInfo: ItemCreateType) {
    return await this.itemsConfiguration[itemInfo.type].ChangeItem(
      id,
      itemInfo
    );
  }
}
