import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { Section } from "@/widgets/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: ".Torrent",
  description:
    ".Torrent - сервис обмена .torrent файлами видеоигр, фильмов и аудиокниг",
};

export default async function Home() {
  const gameCards = await GameService.GetGameCards();
  return (
    <>
      {gameCards && gameCards.length > 0 && (
        <Section
          name="Игры"
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
