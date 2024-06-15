import { z } from "zod";
import { TypesOfItems } from "../../types";

export const audiobookCardBaseSchema = z.object({
  title: z.string().min(3, "Слишком короткое название"),
  cover: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  author: z.string().optional().nullable(),

  // Добавляем к каждой аудиокниге поле, которое
  // показывает, что item является аудиокнигой
  type: z
    .any()
    .optional()
    .transform(() => TypesOfItems.audiobook),
});

export const audiobookCardSchema = audiobookCardBaseSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);
export type AudiobookCardType = z.infer<typeof audiobookCardSchema>;

export const isAudiobookCardStrict = (a: any): a is AudiobookCardType => {
  return audiobookCardSchema.safeParse(a).success;
};

export const audiobookCardsSchema = z.array(z.any()).transform((a) => {
  const cards: AudiobookCardType[] = [];
  a.forEach((e) => {
    if (isAudiobookCardStrict(e)) cards.push(audiobookCardSchema.parse(e));
    else console.error("AudiobookCard parse error - ", e);
  });
  return cards;
});

export const isAudiobook = (a: any): a is AudiobookCardType => {
  return (
    audiobookCardBaseSchema.safeParse(a).success &&
    (a as AudiobookCardType).type === TypesOfItems.audiobook
  );
};
