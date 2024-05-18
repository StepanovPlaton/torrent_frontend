import { HTTPService } from "@/shared/utils/http";
import { gameCardsSchema, GameCardType } from "./schemas/gameCard";
import { gameSchema, GameType } from "./schemas/game";

export abstract class GameService {
	public static async getGameCards() {
		return await HTTPService.get<GameCardType[]>(
			"/games/cards",
			gameCardsSchema
		);
	}
	public static async getGame(id: number) {
		return await HTTPService.get<GameType>(`/games/${id}`, gameSchema);
	}
}
