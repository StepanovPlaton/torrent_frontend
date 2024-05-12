import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { Section } from "@/widgets/section";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: ".Torrent: Игры",
	description:
		".Torrent: Игры - каталог .torrent файлов для обмена видеоиграми",
};

export default async function Home() {
	const gameCards = await GameService.getGameCards();
	return (
		<div className="w-full h-full max-w-[var(--app-width)] m-auto overflow-y-auto">
			{gameCards && (
				<Section>
					{gameCards.map((card) => (
						<GameCard key={card.id} card={card} />
					))}
				</Section>
			)}
		</div>
	);
}