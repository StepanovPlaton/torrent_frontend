import { z } from "zod";
import { TypesOfItems } from "../../types";

export const gameCardBaseSchema = z.object({
  title: z.string().min(3, "Слишком короткое название"),
  cover: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  version: z.string().optional().nullable(),

  // Добавляем к каждой игре поле, которое
  // показывает, что item является игрой
  type: z
    .any()
    .optional()
    .transform(() => TypesOfItems.game),
});

export const gameCardSchema = gameCardBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type GameCardType = z.infer<typeof gameCardSchema>;

export const isGameCardStrict = (a: any): a is GameCardType => {
  return gameCardSchema.safeParse(a).success;
};

export const gameCardsSchema = z.array(z.any()).transform((a) => {
  const cards: GameCardType[] = [];
  a.forEach((e) => {
    if (isGameCardStrict(e)) cards.push(gameCardSchema.parse(e));
    else console.error("GameCard parse error - ", e);
  });
  return cards;
});

export const isGame = (a: any): a is GameCardType => {
  return (a as GameCardType).type === TypesOfItems.game;
};
