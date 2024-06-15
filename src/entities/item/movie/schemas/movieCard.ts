import { z } from "zod";
import { TypesOfItems } from "../../types";

export const movieCardBaseSchema = z.object({
  title: z.string().min(3, "Слишком короткое название"),
  cover: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  age: z.string().optional().nullable(),

  // Добавляем к каждому фильму поле, которое
  // показывает, что item является фильмом
  type: z
    .any()
    .optional()
    .transform(() => TypesOfItems.movie),
});

export const movieCardSchema = movieCardBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type MovieCardType = z.infer<typeof movieCardSchema>;

export const isMovieCardStrict = (a: any): a is MovieCardType => {
  return movieCardSchema.safeParse(a).success;
};

export const movieCardsSchema = z.array(z.any()).transform((a) => {
  const cards: MovieCardType[] = [];
  a.forEach((e) => {
    if (isMovieCardStrict(e)) cards.push(movieCardSchema.parse(e));
    else console.error("MovieCard parse error - ", e);
  });
  return cards;
});

export const isMovie = (a: any): a is MovieCardType => {
  return (a as MovieCardType).type === TypesOfItems.movie;
};
