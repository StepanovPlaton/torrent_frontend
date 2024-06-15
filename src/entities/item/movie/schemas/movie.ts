import { z } from "zod";
import { movieCardBaseSchema } from "./movieCard";

export const movieBaseSchema = movieCardBaseSchema.merge(
  z.object({
    torrent_file: z.string().min(3, "У раздачи должен быть .torrent файл"),
    trailer: z.string().optional(),

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
  })
);

export const movieCreateSchema = movieBaseSchema.merge(z.object({}));
export type MovieCreateType = z.infer<typeof movieCreateSchema>;

export const movieSchema = movieBaseSchema.merge(
  z.object({
    id: z.number().positive(),
    owner_id: z.number().positive(),
    update_date: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
    upload_date: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
  })
);
export type MovieType = z.infer<typeof movieSchema>;

export const isMovie = (a: any): a is MovieType => {
  return movieSchema.safeParse(a).success;
};

export const moviesSchema = z.array(z.any()).transform((a) => {
  const games: MovieType[] = [];
  a.forEach((e) => {
    if (isMovie(e)) games.push(movieSchema.parse(e));
    else console.error("Movie parse error - ", e);
  });
  return games;
});
