import { HTTPService, RequestCacheOptions } from "@/shared/utils/http";
import { gameCardsSchema } from "./schemas/gameCard";
import { GameCreateType, gameSchema, GameType } from "./schemas/game";
import {
  IItemService,
  ItemCreateType,
  ItemPropertiesDescriptionType,
  ItemType,
  staticImplements,
  TypesOfItems,
} from "../types";
import { ItemService } from "../item";
import {
  GameGenreCreateType,
  gameGenreSchema,
  gameGenresSchema,
} from "./schemas/genre";
import { RequiredFrom } from "@/shared/utils/types";

@staticImplements<IItemService>()
export abstract class GameService {
  public static cacheTag = "all_games";
  public static urlPrefix = "games";
  private static cacheOptions(custom_tag?: string): RequestCacheOptions {
    return {
      next: {
        tags: custom_tag ? [this.cacheTag, custom_tag] : [this.cacheTag],
        revalidate: 60 * 5,
      },
    };
  }

  public static async GetCards() {
    return await HTTPService.get(
      `/${this.urlPrefix}`,
      gameCardsSchema,
      this.cacheOptions(`/${this.urlPrefix}/cards`)
    );
  }
  public static async Get(id: number) {
    return await HTTPService.get(
      `/${this.urlPrefix}/${id}`,
      gameSchema,
      this.cacheOptions(`/${this.urlPrefix}/${id}`)
    );
  }
  public static async Add(info: GameCreateType) {
    return await HTTPService.post(`/${this.urlPrefix}`, gameSchema, {
      body: info,
    });
  }
  public static async Change(id: number, info: GameCreateType) {
    return await HTTPService.put(`/${this.urlPrefix}/${id}`, gameSchema, {
      body: info,
    });
  }

  public static GetEmpty(): RequiredFrom<GameCreateType> {
    return {
      title: "",
      torrent_file: "",
      type: TypesOfItems.game,
    };
  }

  public static async GetGenres() {
    return await HTTPService.get(`/genres/${this.urlPrefix}`, gameGenresSchema);
  }

  public static async CreateGenre(info: GameGenreCreateType) {
    return await HTTPService.post(
      `/genres/${this.urlPrefix}`,
      gameGenreSchema,
      {
        body: info,
      }
    );
  }

  static propertiesDescription: ItemPropertiesDescriptionType<GameType> = [
    [
      { name: "Система", key: "system" },
      { name: "Процессор", key: "processor" },
      { name: "Оперативная память", key: "memory" },
      { name: "Видеокарта", key: "graphics" },
      { name: "Место на диске", key: "storage" },
    ],
    [
      { name: "Версия игры", key: "version" },
      {
        name: "Дата обновления раздачи",
        key: "update_date",
        value: (item: ItemType | ItemCreateType) => {
          return ItemService.isExistingItem(item)
            ? item.update_date.toLocaleDateString("ru-ru")
            : new Date().toLocaleDateString("ru-ru");
        },
        editable: false,
      },
      { name: "Язык", key: "language" },
      { name: "Разработчик", key: "developer" },
      {
        name: "Год выхода",
        key: "release_date",
      },
      { name: "Объём загрузки", key: "download_size" },
    ],
  ];
}
