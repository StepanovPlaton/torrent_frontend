import { z } from "zod";

export const gameCardBaseSchema = z
	.object({
		title: z.string().min(3),
		cover: z.string().optional(),
		description: z.string().optional(),
		version: z.string().optional(),
	})
	.transform((card) => {
		return {
			...card,
			cover: card.cover
				? process.env.NEXT_PUBLIC_COVER_FULL_URL + "/" + card.cover
				: undefined,
			cover_preview: card.cover
				? process.env.NEXT_PUBLIC_COVER_PREVIEW_URL + "/" + card.cover
				: undefined,
		};
	});

export const gameCardSchema = gameCardBaseSchema.and(
	z.object({
		id: z.number().positive(),
	})
);
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
