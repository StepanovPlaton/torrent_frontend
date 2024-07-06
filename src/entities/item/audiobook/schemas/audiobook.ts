import { z } from "zod";
import { audiobookCardBaseSchema } from "./audiobookCard";
import { audiobookGenresSchema } from "./genre";
import { ownerSchema } from "../../schemas/owner";
import { TypesOfItems } from "../../types";

export const audiobookBaseSchema = audiobookCardBaseSchema.merge(
  z.object({
    torrent_file: z.string().min(3, "У раздачи должен быть .torrent файл"),
    fragment: z.string().optional().nullable(),

    language: z.string().optional().nullable(),
    download_size: z.string().optional().nullable(),
    duration: z.string().optional().nullable(),
    reader: z.string().optional().nullable(),

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

    genres: audiobookGenresSchema.optional().nullable(),
  })
);

export const audiobookCreateSchema = audiobookBaseSchema.merge(z.object({}));
export type AudiobookCreateType = z.infer<typeof audiobookCreateSchema>;

export const audiobookSchema = audiobookBaseSchema.merge(
  z.object({
    id: z.number().positive(),
    owner: ownerSchema,
    update_date: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
  })
);
export type AudiobookType = z.infer<typeof audiobookSchema>;

export const isAudiobookStrict = (a: any): a is AudiobookType => {
  return audiobookSchema.safeParse(a).success;
};

export const audiobooksSchema = z.array(z.any()).transform((a) => {
  const audiobooks: AudiobookType[] = [];
  a.forEach((e) => {
    if (isAudiobookStrict(e)) audiobooks.push(audiobookSchema.parse(e));
    else console.error("Audiobook parse error - ", e);
  });
  return audiobooks;
});

export const isAudiobook = (a: any): a is AudiobookType => {
  return (a as AudiobookType).type === TypesOfItems.audiobook;
};
