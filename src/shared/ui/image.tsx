import Image from "next/image";

export const Img = ({
  src,
  preview = false,
  width,
  height,
  alt,
  className,
}: {
  src: string | null | undefined;
  preview?: boolean;
  width?: number;
  height?: number;
  alt?: string;
  className: string;
}) => {
  return (
    <>
      {src && (
        <Image
          className={className}
          src={
            "" +
            process.env.NEXT_PUBLIC_BASE_URL +
            process.env.NEXT_PUBLIC_API_PATTERN +
            (preview
              ? process.env.NEXT_PUBLIC_COVER_PREVIEW_URL
              : process.env.NEXT_PUBLIC_COVER_FULL_URL) +
            "/" +
            src
          }
          width={width}
          height={height}
          alt={alt ?? ""}
        />
      )}
    </>
  );
};
