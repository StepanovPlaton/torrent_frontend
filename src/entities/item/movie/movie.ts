import { HTTPService, RequestCacheOptions } from "@/shared/utils/http";
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
import {
  MovieGenreCreateType,
  movieGenreSchema,
  movieGenresSchema,
} from "./schemas/genre";
import {
  MovieActorCreateType,
  movieActorSchema,
  movieActorsSchema,
} from "./schemas/actors";
import { RequiredFrom } from "@/shared/utils/types";

@staticImplements<IItemService>()
export abstract class MovieService {
  public static cacheTag = "all_movies";
  public static urlPrefix = "movies";
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
      movieCardsSchema,
      this.cacheOptions(`/${this.urlPrefix}/cards`)
    );
  }
  public static async Get(id: number) {
    return await HTTPService.get(
      `/${this.urlPrefix}/${id}`,
      movieSchema,
      this.cacheOptions(`/${this.urlPrefix}/${id}`)
    );
  }
  public static async Add(info: MovieCreateType) {
    return await HTTPService.post(`/${this.urlPrefix}`, movieSchema, {
      body: info,
    });
  }
  public static async Change(id: number, info: MovieCreateType) {
    return await HTTPService.put(`/${this.urlPrefix}/${id}`, movieSchema, {
      body: info,
    });
  }

  public static GetEmpty(): RequiredFrom<MovieCreateType> {
    return {
      title: "",
      torrent_file: "",
      type: TypesOfItems.movie,
    };
  }

  public static async GetGenres() {
    return await HTTPService.get(
      `/genres/${this.urlPrefix}`,
      movieGenresSchema
    );
  }

  public static async CreateGenre(info: MovieGenreCreateType) {
    return await HTTPService.post(
      `/genres/${this.urlPrefix}`,
      movieGenreSchema,
      {
        body: info,
      }
    );
  }

  public static async GetActors() {
    return await HTTPService.get(`/actors`, movieActorsSchema);
  }

  public static async CreateActor(info: MovieActorCreateType) {
    return await HTTPService.post(`/actors`, movieActorSchema, {
      body: info,
    });
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
