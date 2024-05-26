"use client";

import {
	gameCreateSchema,
	GameCreateType,
	GameService,
	GameType,
} from "@/entities/game";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { getYouTubeID } from "@/shared/utils";
import { UserService } from "@/entities/user";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const GameInfo = ({ game }: { game: GameType }) => {
	const { data: me } = useSWR("user", () => UserService.IdentifyYourself());
	const [editable, setEditable] = useState<boolean>(false);

	useEffect(() => setEditable(me?.id === game.owner_id), [me, game]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<GameCreateType>({
		resolver: zodResolver(gameCreateSchema),
	});

	useEffect(() => {
		register("torrent_file", { value: game.torrent_file });
		register("cover", { value: game.cover });
	}, []);

	useEffect(() => {
		console.log(errors);
	}, [errors]);

	const onSubmit = (formData: GameCreateType) => {
		const updatedGame = GameService.changeGame(game.id, formData);
		console.log(updatedGame);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="p-4 flex flex-col lp:block"
		>
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
				<h1
					className={clsx(
						"text-4xl outline-none",
						!editable && "cursor-default"
					)}
					suppressContentEditableWarning={true}
					contentEditable={editable}
					{...register("title", { value: game.title })}
					onInput={(e) => {
						setValue("title", e.currentTarget.innerText, {
							shouldValidate: true,
						});
						console.log();
					}}
				>
					{game.title}
				</h1>
				{game.description && (
					<div
						contentEditable={editable}
						suppressContentEditableWarning={true}
						className={clsx(
							"text-md text-justify",
							"text-fg4 pt-2 outline-none",
							!editable && "cursor-default"
						)}
						{...register("description", { value: game.description })}
						onInput={(e) => {
							setValue("description", e.currentTarget.innerText, {
								shouldValidate: true,
							});
						}}
					>
						{game.description}
					</div>
				)}
			</span>
			<div
				className={clsx(
					"w-full flex justify-between pt-4",
					!editable && "cursor-default"
				)}
			>
				{[
					[
						{ name: "Система", key: "system" },
						{ name: "Процессор", key: "processor" },
						{ name: "Оперативная память", key: "memory" },
						{ name: "Видеокарта", key: "graphics" },
						{ name: "Место на диске", key: "storage" },
					],
					[
						{ name: "Версия игры", key: "version" },
						{
							name: "Дата обновления раздачи",
							key: "update_date",
							value: game.update_date.toLocaleDateString("ru-ru"),
						},
						{ name: "Язык", key: "language" },
						{ name: "Разработчик", key: "developer" },
						{
							name: "Год выхода",
							key: "release_date",
							value: game.release_date.toLocaleDateString("en-us", {
								year: "numeric",
							}),
						},
						{ name: "Объём загрузки", key: "download_size" },
					],
				].map((section, i) => (
					<ul key={i} className="w-[48%] bg-bg1 rounded-lg py-1 px-4">
						{section.map((req) => (
							<li key={req.name} className="font-bold text-sm lp:text-md py-1">
								{req.name + ": "}
								<input
									readOnly={!editable}
									className={clsx(
										"font-normal outline-none bg-bg1",
										req.value === undefined && "text-fg4"
									)}
									{...register(req.key as keyof GameCreateType)}
									defaultValue={
										req.value ??
										(game[req.key as keyof GameType] as string) ??
										"Не известно"
									}
								></input>
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
					href={process.env.NEXT_PUBLIC_CONTENT_URL + "/" + game.torrent_file}
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
			<input type="submit" className=" m-2 p-2 bg-ac0" />
		</form>
	);
};
