import Image from "next/image";

export const Cover = ({
	cover,
	type = "preview",
}: {
	cover: string;
	type?: "cover" | "preview";
}) => {
	return (
		<Image
			src={cover}
			className="rounded-lg aspect-video object-cover"
			alt=""
			width={type === "preview" ? 700 : 1280}
			height={type === "preview" ? 400 : 720}
		/>
	);
};
