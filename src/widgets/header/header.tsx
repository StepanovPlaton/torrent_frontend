"use client";

import { SchemeSwitch } from "@/features/colorSchemeSwitch";
import { PersonIcon, SearchIcon } from "@/shared/assets/icons";
import { MobileMenu } from "./mobileMenu/mobileMenu";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

const sections = [
  { title: "Игры", href: "games" },
  { title: "Фильмы", href: "films" },
  { title: "Аудиокниги", href: "audiobooks" },
];

export const Header = () => {
  const currentPageName = useSelectedLayoutSegment();

  return (
    <header className="w-full h-20 bg-bg1 sticky top-0 shadow-xl">
      <div
        className="w-full h-full max-w-[var(--app-width)] m-auto px-5
              flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold flex items-center">
          <div className="lp:hidden">
            <MobileMenu sections={sections} />
          </div>
          <Link href="/">.Torrent</Link>
        </h1>
        <div className="hidden text-2xl dsk:block">
          {sections.map((section) => (
            <Link
              key={section.title}
              className={clsx(
                "px-5 cursor-pointer hover:underline underline-offset-2",
                currentPageName === section.href && "underline"
              )}
              href={section.href}
            >
              {section.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="flex items-center mb-1 ">
            <SchemeSwitch />
            <Link
              href="/login"
              className="group/login cursor-pointer flex items-center"
            >
              <PersonIcon className="mr-1 h-4 w-4" />
              <span className="group-hover/login:underline">Войти</span>
            </Link>
          </span>
          <label className="flex flex-col items-start relative w-36">
            <input
              className="peer/search w-full rounded-lg bg-bg4 px-2"
              placeholder=" "
            />
            <span
              className="peer-focus/search:opacity-0 
                  				peer-[:not(:placeholder-shown)]/search:opacity-0 
                  				transition-opacity h-0 flex items-center relative bottom-3"
            >
              <SearchIcon className="w-4 h-4 mx-2" />
              Поиск
            </span>
          </label>
        </div>
      </div>
    </header>
  );
};
