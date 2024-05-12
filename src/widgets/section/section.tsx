"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export const Section = ({
	name,
	invite_text,
	link,
	children,
}: {
	name?: string;
	invite_text?: string;
	link?: string;
	children: React.ReactNode;
}) => {
	const router = useRouter();

	return (
		<section className="w-full h-fit p-5 mb-20 pt-8">
			{name && (
				<h2
					className="text-4xl pb-2 cursor-pointer w-fit"
					onClick={() => link && router.push(link)}
				>
					{name}
				</h2>
			)}
			<div className="grid grid-cols-1 tb:grid-cols-2 lp:grid-cols-3 gap-y-10 gap-x-3">
				{children}
			</div>
			{link && invite_text && (
				<div className="w-full flex justify-end pt-5">
					<Link href={link} className="text-lg">
						{invite_text}
					</Link>
				</div>
			)}
		</section>
	);
};
