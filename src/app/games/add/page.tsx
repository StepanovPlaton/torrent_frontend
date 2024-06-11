import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { GameInfo } from "@/widgets/gameInfo";
import { Section } from "@/widgets/section";

export default async function AddGame() {
  const gameCards = await GameService.GetGameCards();

  return (
    <>
      <GameInfo game={GameService.GetEmptyGame()} />

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
