import { HTTPService, RequestCacheOptions } from "@/shared/utils/http";
import { audiobookCardsSchema } from "./schemas/audiobookCard";
import {
  AudiobookCreateType,
  audiobookSchema,
  AudiobookType,
} from "./schemas/audiobook";
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
  AudiobookGenreCreateType,
  audiobookGenreSchema,
  audiobookGenresSchema,
} from "./schemas/genre";
import { RequiredFrom } from "@/shared/utils/types";

@staticImplements<IItemService>()
export abstract class AudiobookService {
  public static cacheTag = "all_audiobooks";
  public static urlPrefix = "audiobooks";
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
      audiobookCardsSchema,
      this.cacheOptions(`/${this.urlPrefix}/cards`)
    );
  }
  public static async Get(id: number) {
    return await HTTPService.get(
      `/${this.urlPrefix}/${id}`,
      audiobookSchema,
      this.cacheOptions(`/${this.urlPrefix}/${id}`)
    );
  }
  public static async Add(info: AudiobookCreateType) {
    return await HTTPService.post(`/${this.urlPrefix}`, audiobookSchema, {
      body: info,
    });
  }
  public static async Change(id: number, info: AudiobookCreateType) {
    return await HTTPService.put(`/${this.urlPrefix}/${id}`, audiobookSchema, {
      body: info,
    });
  }

  public static GetEmpty(): RequiredFrom<AudiobookCreateType> {
    return {
      title: "",
      torrent_file: "",
      type: TypesOfItems.audiobook,
    };
  }

  public static async GetGenres() {
    return await HTTPService.get(
      `/genres/${this.urlPrefix}`,
      audiobookGenresSchema
    );
  }

  public static async CreateGenre(info: AudiobookGenreCreateType) {
    return await HTTPService.post(
      `/genres/${this.urlPrefix}`,
      audiobookGenreSchema,
      {
        body: info,
      }
    );
  }

  static propertiesDescription: ItemPropertiesDescriptionType<AudiobookType> = [
    [
      { name: "Автор", key: "author" },
      { name: "Язык", key: "language" },
      { name: "Читает", key: "reader" },
      { name: "Продолжительность", key: "duration" },
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
      {
        name: "Год выхода",
        key: "release_date",
      },
      { name: "Объём загрузки", key: "download_size" },
    ],
  ];
}
