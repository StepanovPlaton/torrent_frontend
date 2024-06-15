import { GameCreateType, GameType } from "./game/schemas/game";
import { GameCardType } from "./game/schemas/gameCard";
import { MovieCreateType, MovieType } from "./movie/schemas/movie";
import { MovieCardType } from "./movie/schemas/movieCard";
import {
  AudiobookCreateType,
  AudiobookType,
} from "./audiobook/schemas/audiobook";
import { AudiobookCardType } from "./audiobook/schemas/audiobookCard";

export type ItemType = GameType | MovieType | AudiobookType;
export type ItemCardType = GameCardType | MovieCardType | AudiobookCardType;
export type ItemCreateType =
  | GameCreateType
  | MovieCreateType
  | AudiobookCreateType;

export type UnionItemType = GameType & MovieType & AudiobookType;
export type UnionItemCardType = GameCardType &
  MovieCardType &
  AudiobookCardType;
export type UnionItemCreateType = GameCreateType &
  MovieCreateType &
  AudiobookCreateType;

export enum TypesOfItems {
  game,
  movie,
  audiobook,
}

export type ItemSectionsType = "games" | "movies" | "audiobooks";
export const ItemSections = [
  "games",
  "movies",
  "audiobooks",
] as ItemSectionsType[];

export const isSection = (a: string): a is ItemSectionsType => {
  return (ItemSections as string[]).includes(a);
};

export type ItemPropertiesDescriptionType<T extends ItemType | ItemCreateType> =
  {
    name: string;
    key: keyof T;
    value?: (item: T) => string;
    editable?: boolean;
  }[][];

export interface IItemService {
  GetCards(): Promise<ItemCardType[] | null>;
  Get(id: number): Promise<ItemType | null>;
  Add(info: ItemCreateType): Promise<ItemType | null>;
  Change(id: number, info: ItemCreateType): Promise<ItemType | null>;
  GetEmpty(): ItemCreateType;
  propertiesDescription: ItemPropertiesDescriptionType<UnionItemType>;
}
export const staticImplements =
  <T>() =>
  <U extends T>(constructor: U) =>
    constructor;
