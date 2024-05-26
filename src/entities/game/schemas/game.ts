import { z } from "zod";
import { gameCardBaseSchema } from "./gameCard";

export const gameBaseSchema = gameCardBaseSchema.merge(
  z.object({
    torrent_file: z.string().min(1),
    trailer: z.string().optional(),

    system: z.string().optional(),
    processor: z.string().optional(),
    memory: z.string().optional(),
    graphics: z.string().optional(),
    storage: z.string().optional(),

    developer: z.string().optional(),
    language: z.string().optional(),
    download_size: z.string().optional(),

    release_date: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
  })
);

export const gameCreateSchema = gameBaseSchema.merge(z.object({}));
export type GameCreateType = z.infer<typeof gameCreateSchema>;

export const gameSchema = gameBaseSchema.merge(
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
export type GameType = z.infer<typeof gameSchema>;

export const isGame = (a: any): a is GameType => {
  return gameSchema.safeParse(a).success;
};

export const gamesSchema = z.array(z.any()).transform((a) => {
  const games: GameType[] = [];
  a.forEach((e) => {
    if (isGame(e)) games.push(gameSchema.parse(e));
    else console.error("Game parse error - ", e);
  });
  return games;
});
