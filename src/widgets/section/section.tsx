export const Section = ({
	name,
	children,
}: {
	name: string;
	children: React.ReactNode;
}) => {
	return (
		// open section onClick
		<section className="w-full p-5 pt-8">
			<h2 className="text-4xl pb-2 cursor-pointer w-fit">{name}</h2>
			<div className="grid grid-cols-1 tb:grid-cols-2 lp:grid-cols-3 gap-y-10 gap-x-3">
				{children}
			</div>
		</section>
	);
};
