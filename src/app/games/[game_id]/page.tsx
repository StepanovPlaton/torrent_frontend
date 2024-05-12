import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { Section } from "@/widgets/section";
import Image from "next/image";

export default async function Games({
	params: { game_id },
}: {
	params: { game_id: number };
}) {
	const gameCards = await GameService.getGameCards();
	const game = await GameService.getGame(game_id);
	return (
		<>
			{game && (
				<div className="p-4 flex flex-col lp:flex-row">
					{game.cover && (
						<Image
							src={game.cover}
							className="rounded-lg w-[60%] aspect-video object-cover"
							alt=""
							width={1280}
							height={720}
						/>
					)}
					<div className="pt-2 max-w-[40%]">
						<h1 className="text-4xl">{game.title}</h1>
						<p className="text-md text-justify text-fg4 pt-2">
							{game.description}
						</p>
					</div>
				</div>
			)}

			{gameCards && (
				<Section
					name="Другие популярные игры"
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
