"use client";

import { SectionService } from "@/features/sections";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export const MobileMenu = () => {
  const [open, changeMenuOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        className="w-16 h-16 *:w-12 *:h-1 *:bg-fg1 *:my-3 
						*:transition-all *:duration-300 *:relative"
        onClick={(e) => {
          changeMenuOpen(!open);
          e.stopPropagation();
        }}
        onBlur={() => changeMenuOpen(false)}
      >
        <div
          className={clsx(open && "rotate-45 top-4", !open && "top-0")}
        ></div>
        <div className={clsx(open && "opacity-0")}></div>
        <div
          className={clsx(open && "-rotate-45 bottom-4", !open && "bottom-0")}
        ></div>
      </button>
      <div
        className={clsx(
          "h-0 absolute transition-all duration-300 overflow-hidden\
					bg-bg4 rounded-lg px-4 flex flex-col shadow-xl",
          open && "h-32"
        )}
        onClick={() => changeMenuOpen(false)}
      >
        {SectionService.sections.map((section) => (
          <Link
            key={section}
            className="text-xl py-2 cursor-pointer hover:underline"
            href={"/" + section}
          >
            {SectionService.sectionsConfiguration[section].sectionName}
          </Link>
        ))}
      </div>
    </div>
  );
};
