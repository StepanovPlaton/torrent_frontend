import { GameService } from "@/entities/game";
import { GameCard } from "@/features/gameCard";
import { getYouTubeID } from "@/shared/utils";
import { Section } from "@/widgets/section";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

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
				<div className="p-4 flex flex-col lp:block">
					{game.cover && (
						<div className="lp:w-[60%] lp:px-4 lp:pl-0 py-2 float-left">
							<Image
								src={game.cover}
								className="rounded-lg w-full object-contain"
								alt=""
								width={1280}
								height={720}
							/>
						</div>
					)}
					<span className="lp:max-w-[40%]">
						<h1 className="text-4xl">{game.title}</h1>
						{game.description && (
							<p className="text-md text-justify text-fg4 pt-2">
								{game.description}
							</p>
						)}
					</span>
					<div className="w-full flex justify-between pt-4">
						{[
							[
								{ name: "Система", value: game.system },
								{ name: "Процессор", value: game.processor },
								{ name: "Оперативная память", value: game.memory },
								{ name: "Видеокарта", value: game.graphics },
								{ name: "Место на диске", value: game.storage },
							],
							[
								{
									name: "Версия игры",
									value: `${
										game.version
									} (обновлена ${game.update_date.toLocaleDateString(
										"ru-ru"
									)})`,
								},
								{ name: "Язык", value: game.language },
								{ name: "Разработчик", value: game.developer },
								{
									name: "Год выхода",
									value: game.release_date.toLocaleDateString("en-us", {
										year: "numeric",
									}),
								},
								{ name: "Объём загрузки", value: game.download_size },
							],
						].map((section, i) => (
							<ul key={i} className="w-[48%] bg-bg1 rounded-lg py-1 px-4">
								{section.map((req) => (
									<li
										key={req.name}
										className="font-bold text-sm lp:text-md py-1"
									>
										{req.name + ": "}
										<span
											className={clsx(
												"font-normal",
												req.value === undefined && "text-fg4"
											)}
										>
											{req.value ?? "Не известно"}
										</span>
									</li>
								))}
							</ul>
						))}
					</div>
					{game.trailer && getYouTubeID(game.trailer) && (
						<iframe
							src={"https://youtube.com/embed/" + getYouTubeID(game.trailer)}
							className="w-full aspect-video rounded-lg mt-4"
							allowFullScreen
						/>
					)}
					<div className="relative w-full flex items-center justify-around pt-4">
						<Link
							href={
								process.env.NEXT_PUBLIC_CONTENT_URL + "/" + game.torrent_file
							}
							className="p-4 bg-ac0 text-fg1 text-2xl rounded-lg"
						>
							Скачать {game.title}
						</Link>
					</div>
					<div className="w-full flex justify-end">
						<Link
							className="text-right text-sm relative top-4 lp:-top-4"
							href="/how_to_download"
						>
							Как скачать игру
							<br /> с помощью .torrent файла?
						</Link>
					</div>
				</div>
			)}

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
