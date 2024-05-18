"use client";

import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const Modal = ({ children }: { children: React.ReactNode }) => {
	const [closing, setClosing] = useState(false);
	const router = useRouter();
	return (
		<div
			className={clsx(
				!closing && "animate-fadeIn",
				closing && "animate-fadeOut opacity-0",
				"flex items-center justify-around",
				"absolute z-20 left-0 w-full h-full bg-[#000000c5]"
			)}
			onClick={() => {
				setClosing(true);
				setTimeout(() => router.back(), 500);
			}}
		>
			<div
				className="rounded-lg bg-bg1 w-fit h-fit p-6"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{children}
			</div>
		</div>
	);
};
