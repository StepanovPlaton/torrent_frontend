import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { Section } from "@/widgets/section";

export default async function Home() {
	const gameCards = await GameService.getGameCards();
	return (
		<div className="w-full max-w-[var(--app-width)] m-auto">
			{gameCards && (
				<Section name="Игры">
					{gameCards.map((card) => (
						<GameCard key={card.id} card={card} />
					))}
				</Section>
			)}
		</div>
	);
}
