import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { Section } from "@/widgets/section";

export default async function Home() {
	const gameCards = await GameService.getGameCards();
	return (
		<div className="w-full h-full max-w-[var(--app-width)] m-auto overflow-y-auto">
			{gameCards && (
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
		</div>
	);
}
