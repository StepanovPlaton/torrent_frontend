"use client";

import { UserService } from "@/entities/user";
import { PersonIcon } from "@/shared/assets/icons";
import Link from "next/link";
import useSWR from "swr";

export const UserActivities = () => {
	const { data: me } = useSWR("user", () => UserService.IdentifyYourself());

	return (
		<>
			<PersonIcon className="mr-1 h-4 w-4" />
			{me && (
				<span className="group/login cursor-pointer flex items-center">
					<span className="group-hover/login:underline">{me.name}</span>
				</span>
			)}
			{!me && (
				<Link
					href="/login"
					className="group/login cursor-pointer flex items-center"
				>
					<span className="group-hover/login:underline">Войти</span>
				</Link>
			)}
		</>
	);
};
