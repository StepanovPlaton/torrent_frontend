"use client";

import { SunIcon } from "@/shared/assets/icons";
import { useTheme } from "next-themes";

export const SchemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SunIcon
        className="mr-5 h-8 w-8 cursor-pointer"
        onClick={() => setTheme(theme == "light" ? "dark" : "light")}
      />
    </>
  );
};
