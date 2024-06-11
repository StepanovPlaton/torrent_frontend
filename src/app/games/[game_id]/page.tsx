import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { GameInfo } from "@/widgets/gameInfo";
import { Section } from "@/widgets/section";

export default async function Games({
  params: { game_id },
}: {
  params: { game_id: number };
}) {
  const gameCards = await GameService.GetGameCards();
  const game = await GameService.GetGame(game_id);
  return (
    <>
      {game && <GameInfo game={game} />}

      {gameCards && (
        <Section
          name="Популярные игры"
          link="/games"
          invite_text={'Перейти в раздел "Игры"'}
        >
          {gameCards.map((card) => (
            <GameCard key={card.id} card={card} />
          ))}
        </Section>
      )}
    </>
  );
}
