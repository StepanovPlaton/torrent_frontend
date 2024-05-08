import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        bg0: "var(--color-bg0)",
        bg1: "var(--color-bg1)",
        bg4: "var(--color-bg4)",
        fg0: "var(--color-fg0)",
        fg1: "var(--color-fg1)",
        fg4: "var(--color-fg4)",
      },
    },
  },
  plugins: [],
};
export default config;
