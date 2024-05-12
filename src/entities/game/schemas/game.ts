import { z } from "zod";
import { gameCardSchema } from "./gameCard";

export const gameSchema = gameCardSchema.and(
	z.object({
		torrent_file: z.string().min(1),
		language: z.string().optional(),
		version: z.string().optional(),
		download_size: z.string().optional(),
		system: z.string().optional(),
		processor: z.string().optional(),
		memory: z.string().optional(),
		graphics: z.string().optional(),
		storage: z.string().optional(),
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
