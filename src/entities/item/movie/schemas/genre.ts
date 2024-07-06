import { z } from "zod";

export const movieGenreBaseSchema = z.object({
  genre: z.string().min(3),
});

export const movieGenreCreateSchema = movieGenreBaseSchema.merge(z.object({}));
export type MovieGenreCreateType = z.infer<typeof movieGenreCreateSchema>;

export const movieGenreSchema = movieGenreBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type MovieGenreType = z.infer<typeof movieGenreSchema>;

export const isMovieGenreStrict = (a: any): a is MovieGenreType => {
  return movieGenreSchema.safeParse(a).success;
};

export const movieGenresSchema = z.array(z.any()).transform((a) => {
  const cards: MovieGenreType[] = [];
  a.forEach((e) => {
    if (isMovieGenreStrict(e)) cards.push(movieGenreSchema.parse(e));
    else console.error("MovieGenre parse error - ", e);
  });
  return cards;
});
