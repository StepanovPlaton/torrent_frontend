import { GameCreateType, GameType } from "./game/schemas/game";
import { GameCardType } from "./game/schemas/gameCard";
import { MovieCreateType, MovieType } from "./movie/schemas/movie";
import { MovieCardType } from "./movie/schemas/movieCard";
import {
  AudiobookCreateType,
  AudiobookType,
} from "./audiobook/schemas/audiobook";
import { AudiobookCardType } from "./audiobook/schemas/audiobookCard";
import { GameGenreCreateType, GameGenreType } from "./game/schemas/genre";
import { MovieGenreCreateType, MovieGenreType } from "./movie/schemas/genre";
import {
  AudiobookGenreCreateType,
  AudiobookGenreType,
} from "./audiobook/schemas/genre";
import { MovieActorType } from "./movie/schemas/actors";

export type ItemType = GameType | MovieType | AudiobookType;
export type ItemCardType = GameCardType | MovieCardType | AudiobookCardType;
export type ItemCreateType =
  | GameCreateType
  | MovieCreateType
  | AudiobookCreateType;
export type UnionItemType = GameType & MovieType & AudiobookType;

export type GenreType = GameGenreType | MovieGenreType | AudiobookGenreType;
export type CreateGenreType =
  | GameGenreCreateType
  | MovieGenreCreateType
  | AudiobookGenreCreateType;

export type ItemListPropertyType = GenreType | MovieActorType;

export const isGenre = (g: any): g is GenreType => {
  return (g as GenreType).genre !== undefined;
};

export enum TypesOfItems {
  game,
  movie,
  audiobook,
}
export type ItemPropertiesDescriptionType<T extends ItemType | ItemCreateType> =
  {
    name: string;
    key: keyof T;
    value?: (item: T) => string;
    editable?: boolean;
  }[][];

export interface IItemService {
  cacheTag: string;
  urlPrefix: string;
  GetCards(): Promise<ItemCardType[] | null>;
  Get(id: number): Promise<ItemType | null>;
  Add(info: ItemCreateType): Promise<ItemType | null>;
  Change(id: number, info: ItemCreateType): Promise<ItemType | null>;
  GetEmpty(): ItemCreateType;
  propertiesDescription: ItemPropertiesDescriptionType<UnionItemType>;
  CreateGenre(info: CreateGenreType): Promise<GenreType | null>;
  GetGenres(): Promise<GenreType[] | null>;
}
export const staticImplements =
  <T>() =>
  <U extends T>(constructor: U) =>
    constructor;
