"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => setLoaded(true), []);

  return (
    <section className="w-full h-fit p-2 mb-20 pt-8">
      {name && (
        <h2
          className="text-4xl pb-2 cursor-pointer w-fit"
          onClick={() => link && router.push(link)}
        >
          {name}
        </h2>
      )}
      <ResponsiveMasonry
        className={clsx(
          "transition-opacity duration-300 opacity-0",
          loaded && "opacity-100"
        )}
        columnsCountBreakPoints={{ 0: 1, 640: 2, 1024: 3 }}
      >
        <Masonry gutter="1rem">{children}</Masonry>
      </ResponsiveMasonry>
      {link && invite_text && (
        <div className="w-full flex justify-end pt-5">
          <Link
            href={link}
            className="text-lg hover:underline underline-offset-4"
          >
            {invite_text}
          </Link>
        </div>
      )}
    </section>
  );
};
