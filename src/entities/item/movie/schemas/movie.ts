import { z } from "zod";
import { movieCardBaseSchema } from "./movieCard";
import { movieGenresSchema } from "./genre";
import { movieActorsSchema } from "./actors";
import { ownerSchema } from "../../schemas/owner";
import { TypesOfItems } from "../../types";

export const movieBaseSchema = movieCardBaseSchema.merge(
  z.object({
    torrent_file: z.string().min(3, "У раздачи должен быть .torrent файл"),
    trailer: z.string().optional().nullable(),

    language: z.string().optional().nullable(),
    subtitles: z.string().optional().nullable(),
    download_size: z.string().optional().nullable(),
    director: z.string().optional().nullable(),
    duration: z.string().optional().nullable(),
    country: z.string().optional().nullable(),

    release_date: z
      .string()
      .optional()
      .nullable()
      .transform((d) =>
        d
          ? new Date(d).toLocaleDateString("en-us", {
              year: "numeric",
            })
          : undefined
      ),

    actors: movieActorsSchema.optional().nullable(),
    genres: movieGenresSchema.optional().nullable(),
  })
);

export const movieCreateSchema = movieBaseSchema.merge(z.object({}));
export type MovieCreateType = z.infer<typeof movieCreateSchema>;

export const movieSchema = movieBaseSchema.merge(
  z.object({
    id: z.number().positive(),
    owner: ownerSchema,
    update_date: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
  })
);
export type MovieType = z.infer<typeof movieSchema>;

export const isMovieStrict = (a: any): a is MovieType => {
  return movieSchema.safeParse(a).success;
};

export const moviesSchema = z.array(z.any()).transform((a) => {
  const games: MovieType[] = [];
  a.forEach((e) => {
    if (isMovieStrict(e)) games.push(movieSchema.parse(e));
    else console.error("Movie parse error - ", e);
  });
  return games;
});

export const isMovie = (a: any): a is MovieType => {
  return (a as MovieType).type === TypesOfItems.movie;
};
