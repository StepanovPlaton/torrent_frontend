import { HTTPService } from "@/shared/utils/http";
import { gameCardsSchema } from "./schemas/gameCard";
import { GameCreateType, gameSchema } from "./schemas/game";

export abstract class GameService {
  public static async GetGameCards() {
    return await HTTPService.get("/games/cards", gameCardsSchema);
  }
  public static async GetGame(id: number) {
    return await HTTPService.get(`/games/${id}`, gameSchema);
  }
  public static async ChangeGame(id: number, gameInfo: GameCreateType) {
    return await HTTPService.put(`/games/${id}`, gameSchema, gameInfo);
  }
  public static async AddGame(gameInfo: GameCreateType) {
    return await HTTPService.post(`/games`, gameSchema, gameInfo);
  }

  public static GetEmptyGame(): GameCreateType {
    return {
      title: "",
      torrent_file: "",
    };
  }
}
