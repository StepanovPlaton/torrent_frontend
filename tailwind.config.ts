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
				ac0: "var(--color-ac0)",
				ac1: "var(--color-ac1)",
				ac2: "var(--color-ac2)",
				err: "var(--color-err)",
			},
			animation: {
				fadeIn: "fadeIn 0.25s ease-in-out",
				fadeOut: "fadeOut 0.25s ease-in-out",
			},
			keyframes: () => ({
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				fadeOut: {
					"0%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			}),
		},
		screens: {
			tb: "640px",
			lp: "1024px",
			dsk: "1280px",
		},
	},
	plugins: [],
};
export default config;
