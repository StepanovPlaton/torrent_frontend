import { z } from "zod";

export const movieActorBaseSchema = z.object({
  actor: z.string().min(3),
});

export const movieActorCreateSchema = movieActorBaseSchema.merge(z.object({}));
export type MovieActorCreateType = z.infer<typeof movieActorCreateSchema>;

export const movieActorSchema = movieActorBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type MovieActorType = z.infer<typeof movieActorSchema>;

export const isMovieActorStrict = (a: any): a is MovieActorType => {
  return movieActorSchema.safeParse(a).success;
};

export const movieActorsSchema = z.array(z.any()).transform((a) => {
  const cards: MovieActorType[] = [];
  a.forEach((e) => {
    if (isMovieActorStrict(e)) cards.push(movieActorSchema.parse(e));
    else console.error("MovieActor parse error - ", e);
  });
  return cards;
});
