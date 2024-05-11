import { z } from "zod";

export const gameCardSchema = z.object({
	id: z.number(),
	title: z.string().min(3),
	cover: z
		.string()
		.optional()
		.transform((u) => {
			if (!!u) return process.env.NEXT_PUBLIC_COVER_FULL_URL + "/" + u;
		}),
	description: z.string().optional(),
	release_date: z
		.string()
		.min(1)
		.transform((d) => new Date(d)),
});
export type GameCardType = z.infer<typeof gameCardSchema>;

export const isGameCard = (a: any): a is GameCardType => {
	return gameCardSchema.safeParse(a).success;
};

export const gameCardsSchema = z.array(z.any()).transform((a) => {
	const cards: GameCardType[] = [];
	a.forEach((e) => {
		if (isGameCard(e)) cards.push(gameCardSchema.parse(e));
		else console.error("GameCard parse error - ", e);
	});
	return cards;
});
