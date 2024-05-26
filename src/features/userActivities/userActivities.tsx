"use client";

import { UserService } from "@/entities/user";
import { PersonIcon } from "@/shared/assets/icons";
import Link from "next/link";
import useSWR from "swr";
import clsx from "clsx";
import { useState } from "react";

export const UserActivities = () => {
	const { data: me } = useSWR("user", () => UserService.IdentifyYourself());
	const [open, changeMenuOpen] = useState<boolean>(false);

	return (
		<>
			<span className="group/login cursor-pointer flex items-center">
				<PersonIcon className="mr-1 h-4 w-4" />
				{me && (
					<div className="relative">
						<button
							className="group-hover/login:underline"
							onClick={() => changeMenuOpen(!open)}
							onBlur={() => changeMenuOpen(false)}
						>
							{me.name}
						</button>
						<li
							className={clsx(
								"h-0 absolute transition-all duration-300",
								"overflow-hidden bg-bg4 rounded-lg pl-2",
								"flex flex-col z-10 shadow-3xl w-60",
								"right-0 top-8",
								open && "h-40 py-2"
							)}
							onClick={() => changeMenuOpen(false)}
						>
							{[
								{
									group: "Добавить:",
									items: [
										{ name: "Добавить игру", link: "/games/add" },
										{ name: "Добавить фильм", link: "/films/add" },
										{ name: "Добавить аудиокнигу", link: "/audiobooks/add" },
									],
								},
								{ name: "Выйти", link: "/logout" },
							].map((item) => (
								<ul key={item.group ?? item.name}>
									{item.group && (
										<>
											<div className="text-xl font-bold">{item.group}</div>
											<li className="pl-4 pb-0">
												{item.items.map((item) => (
													<ul key={item.name}>
														<Link
															key={item.name}
															className="text-lg py-2 cursor-pointer hover:underline"
															href={item.link}
														>
															{item.name}
														</Link>
													</ul>
												))}
											</li>
										</>
									)}
									{!item.group && item.link && (
										<Link
											key={item.name}
											className="text-xl font-bold py-2 cursor-pointer hover:underline"
											href={item.link}
										>
											{item.name}
										</Link>
									)}
								</ul>
							))}
						</li>
					</div>
				)}
				{!me && (
					<Link href="/login" className="cursor-pointer flex items-center">
						<span className="group-hover/login:underline">Войти</span>
					</Link>
				)}
			</span>
		</>
	);
};
