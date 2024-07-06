import { z } from "zod";
import { gameCardBaseSchema } from "./gameCard";
import { gameGenresSchema } from "./genre";
import { ownerSchema } from "../../schemas/owner";
import { TypesOfItems } from "../../types";

export const gameBaseSchema = gameCardBaseSchema.merge(
  z.object({
    torrent_file: z.string().min(3, "У раздачи должен быть .torrent файл"),
    trailer: z.string().optional().nullable(),

    system: z.string().optional().nullable(),
    processor: z.string().optional().nullable(),
    memory: z.string().optional().nullable(),
    graphics: z.string().optional().nullable(),
    storage: z.string().optional().nullable(),

    developer: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    download_size: z.string().optional().nullable(),

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

    genres: gameGenresSchema.optional().nullable(),
  })
);

export const gameCreateSchema = gameBaseSchema.merge(z.object({}));
export type GameCreateType = z.infer<typeof gameCreateSchema>;

export const gameSchema = gameBaseSchema.merge(
  z.object({
    id: z.number().positive(),
    owner: ownerSchema,
    update_date: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
  })
);
export type GameType = z.infer<typeof gameSchema>;

export const isGameStrict = (a: any): a is GameType => {
  return gameSchema.safeParse(a).success;
};

export const gamesSchema = z.array(z.any()).transform((a) => {
  const games: GameType[] = [];
  a.forEach((e) => {
    if (isGameStrict(e)) games.push(gameSchema.parse(e));
    else console.error("Game parse error - ", e);
  });
  return games;
});

export const isGame = (a: any): a is GameType => {
  return (a as GameType).type === TypesOfItems.game;
};
