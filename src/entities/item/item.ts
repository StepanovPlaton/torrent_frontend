import { ZodSchema } from "zod";
import { gameCreateSchema } from "./game/schemas/game";
import { movieCreateSchema } from "./movie/schemas/movie";
import { MovieService } from "./movie/movie";
import { GameService } from "./game/game";
import { audiobookCreateSchema } from "./audiobook/schemas/audiobook";
import { AudiobookService } from "./audiobook/audiobook";
import {
  IItemService,
  ItemCreateType,
  ItemPropertiesDescriptionType,
  ItemType,
  TypesOfItems,
  UnionItemType,
} from "./types";
import { EraseCacheByTags } from "@/shared/utils/http";

export abstract class ItemService {
  static get itemsConfiguration(): {
    [k in TypesOfItems]: {
      formResolver: ZodSchema;
      propertiesDescription: ItemPropertiesDescriptionType<UnionItemType>;
      service: IItemService;
    };
  } {
    return {
      [TypesOfItems.game]: {
        formResolver: gameCreateSchema,
        propertiesDescription: GameService.propertiesDescription,
        service: GameService,
      },
      [TypesOfItems.movie]: {
        formResolver: movieCreateSchema,
        propertiesDescription: MovieService.propertiesDescription,
        service: MovieService,
      },
      [TypesOfItems.audiobook]: {
        formResolver: audiobookCreateSchema,
        propertiesDescription: AudiobookService.propertiesDescription,
        service: AudiobookService,
      },
    };
  }

  public static isExistingItem(
    item: ItemCreateType | ItemType
  ): item is ItemType {
    return (item as ItemType).id !== undefined;
  }

  public static async AddItem(itemInfo: ItemCreateType) {
    const item = await this.itemsConfiguration[itemInfo.type].service.Add(
      itemInfo
    );
    this.UpdateCachedData(item);
    return item;
  }
  public static async ChangeItem(id: number, itemInfo: ItemCreateType) {
    const item = await this.itemsConfiguration[itemInfo.type].service.Change(
      id,
      itemInfo
    );
    this.UpdateCachedData(item);
    return item;
  }

  private static UpdateCachedData(item: ItemType | null) {
    if (item) {
      const tagPrefix = this.itemsConfiguration[item.type].service.urlPrefix;
      EraseCacheByTags([`/${tagPrefix}/${item.id}`, `/${tagPrefix}/cards`]);
    }
  }
}
