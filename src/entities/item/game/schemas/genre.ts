import { z } from "zod";

export const gameGenreBaseSchema = z.object({
  genre: z.string().min(3),
});

export const gameGenreCreateSchema = gameGenreBaseSchema.merge(z.object({}));
export type GameGenreCreateType = z.infer<typeof gameGenreCreateSchema>;

export const gameGenreSchema = gameGenreBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type GameGenreType = z.infer<typeof gameGenreSchema>;

export const isGameGenreStrict = (a: any): a is GameGenreType => {
  return gameGenreSchema.safeParse(a).success;
};

export const gameGenresSchema = z.array(z.any()).transform((a) => {
  const cards: GameGenreType[] = [];
  a.forEach((e) => {
    if (isGameGenreStrict(e)) cards.push(gameGenreSchema.parse(e));
    else console.error("GameGenre parse error - ", e);
  });
  return cards;
});
