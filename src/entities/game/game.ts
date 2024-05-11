import { HTTPService } from "@/shared/http/httpService";
import { gameCardsSchema, GameCardType } from "./schemas/gameCard";

export abstract class GameService {
	public static async getGameCards() {
		return await HTTPService.get<GameCardType[]>(
			"/games/cards",
			gameCardsSchema
		);
	}
}
