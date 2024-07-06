import { z } from "zod";

export const audiobookGenreBaseSchema = z.object({
  genre: z.string().min(3),
});

export const audiobookGenreCreateSchema = audiobookGenreBaseSchema.merge(
  z.object({})
);
export type AudiobookGenreCreateType = z.infer<
  typeof audiobookGenreCreateSchema
>;

export const audiobookGenreSchema = audiobookGenreBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type AudiobookGenreType = z.infer<typeof audiobookGenreSchema>;

export const isAudiobookGenreStrict = (a: any): a is AudiobookGenreType => {
  return audiobookGenreSchema.safeParse(a).success;
};

export const audiobookGenresSchema = z.array(z.any()).transform((a) => {
  const cards: AudiobookGenreType[] = [];
  a.forEach((e) => {
    if (isAudiobookGenreStrict(e)) cards.push(audiobookGenreSchema.parse(e));
    else console.error("AudiobookGenre parse error - ", e);
  });
  return cards;
});
