import { HTTPService } from "@/shared/utils/http";
import { gameCardsSchema, GameCardType } from "./schemas/gameCard";
import { GameCreateType, gameSchema } from "./schemas/game";
import { z } from "zod";

export abstract class GameService {
	public static async getGameCards() {
		return await HTTPService.get("/games/cards", gameCardsSchema);
	}
	public static async getGame(id: number) {
		return await HTTPService.get(`/games/${id}`, gameSchema);
	}
	public static async changeGame(id: number, gameInfo: GameCreateType) {
		return await HTTPService.put(`/games/${id}`, gameSchema, gameInfo);
	}
}
