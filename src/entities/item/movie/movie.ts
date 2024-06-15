import { HTTPService } from "@/shared/utils/http";
import { movieCardsSchema } from "./schemas/movieCard";
import { MovieCreateType, movieSchema, MovieType } from "./schemas/movie";
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
export abstract class MovieService {
  public static async GetCards() {
    return await HTTPService.get("/movies/cards", movieCardsSchema);
  }
  public static async Get(id: number) {
    return await HTTPService.get(`/movies/${id}`, movieSchema);
  }
  public static async Add(info: MovieCreateType) {
    return await HTTPService.post(`/movies`, movieSchema, info);
  }
  public static async Change(id: number, info: MovieCreateType) {
    return await HTTPService.put(`/movies/${id}`, movieSchema, info);
  }

  public static GetEmpty(): MovieCreateType {
    return {
      title: "",
      torrent_file: "",
      type: TypesOfItems.movie,
    };
  }

  public static propertiesDescription: ItemPropertiesDescriptionType<MovieType> =
    [
      [
        { name: "Возраст", key: "age" },
        { name: "Язык", key: "language" },
        { name: "Субтитры", key: "subtitles" },
        {
          name: "Год выхода",
          key: "release_date",
        },
      ],
      [
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
        { name: "Режисёр", key: "director" },
        { name: "Продолжительность", key: "duration" },
        { name: "Страна", key: "country" },
        { name: "Объём загрузки", key: "download_size" },
      ],
    ];
}
