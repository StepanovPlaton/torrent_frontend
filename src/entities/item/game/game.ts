import { HTTPService } from "@/shared/utils/http";
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

@staticImplements<IItemService>()
export abstract class GameService {
  public static async GetCards() {
    return await HTTPService.get("/games/cards", gameCardsSchema);
  }
  public static async Get(id: number) {
    return await HTTPService.get(`/games/${id}`, gameSchema);
  }
  public static async Add(info: GameCreateType) {
    return await HTTPService.post(`/games`, gameSchema, info);
  }
  public static async Change(id: number, info: GameCreateType) {
    return await HTTPService.put(`/games/${id}`, gameSchema, info);
  }

  public static GetEmpty(): GameCreateType {
    return {
      title: "",
      torrent_file: "",
      type: TypesOfItems.game,
    };
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
