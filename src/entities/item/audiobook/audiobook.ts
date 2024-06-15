import { HTTPService } from "@/shared/utils/http";
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

@staticImplements<IItemService>()
export abstract class AudiobookService {
  public static async GetCards() {
    return await HTTPService.get("/audiobooks/cards", audiobookCardsSchema);
  }
  public static async Get(id: number) {
    return await HTTPService.get(`/audiobooks/${id}`, audiobookSchema);
  }
  public static async Add(info: AudiobookCreateType) {
    return await HTTPService.post(`/audiobooks`, audiobookSchema, info);
  }
  public static async Change(id: number, info: AudiobookCreateType) {
    return await HTTPService.put(`/audiobooks/${id}`, audiobookSchema, info);
  }

  public static GetEmpty(): AudiobookCreateType {
    return {
      title: "",
      torrent_file: "",
      type: TypesOfItems.audiobook,
    };
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
