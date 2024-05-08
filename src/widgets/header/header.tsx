import { SchemeSwitch } from "@/features/schemeSwitch";
import { PersonIcon, SearchIcon } from "@/shared/assets/icons";

export const Header = () => {
  return (
    <header className="w-full h-20 flex justify-around bg-bg1">
      <div
        className="w-full h-full max-w-[var(--app-width)] 
              flex items-center justify-between"
      >
        <h1 className="text-5xl font-bold">.Torrent</h1>
        <div className="text-3xl">
          {["Игры", "Фильмы", "Аудиокниги"].map((section) => (
            <a key={section} className="px-2 cursor-pointer hover:underline">
              {section}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="flex items-center mb-1 ">
            <SchemeSwitch />
            <span className="cursor-pointer flex items-center">
              <PersonIcon className="mr-1 h-4 w-4" />
              Войти
            </span>
          </span>
          <label className="flex flex-col items-start relative w-36">
            <input
              className="peer/search w-full rounded-lg bg-bg4 px-2"
              placeholder=" "
            />
            <span
              className="peer-focus/search:opacity-0 
          peer-[:not(:placeholder-shown)]/search:opacity-0 
          transition-all h-0 flex items-center relative bottom-3"
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
