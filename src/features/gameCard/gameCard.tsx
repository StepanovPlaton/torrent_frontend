import { GameCardType } from "@/entities/game";
import Image from "next/image";

export const GameCard = ({ card }: { card: GameCardType }) => {
	return (
		<div className="group/gamecard cursor-pointer">
			{!!card.cover && (
				<Image
					src={card.cover}
					className="rounded-lg"
					alt=""
					width={700}
					height={400}
				/>
			)}
			<div className="flex items-center justify-between pr-2">
				<h2 className="text-2xl py-1 group-hover/gamecard:underline underline-offset-4">
					{card.title}
				</h2>
				<span className="text-sm text-fg4">
					{card.release_date.toLocaleDateString("ru-ru", {
						year: "numeric",
					})}
				</span>
			</div>
			<p className="text-lg tb:text-sm pr-2 text-justify line-clamp-5 text-fg4">
				{card.description}
			</p>
		</div>
	);
};
