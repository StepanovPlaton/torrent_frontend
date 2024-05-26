import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/widgets/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	auth,
	children,
}: Readonly<{
	auth: React.ReactNode;
	children: React.ReactNode;
}>) {
	return (
		// suppressHydrationWarning for theme support
		<html lang="ru" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider enableSystem={false} defaultTheme="light">
					{auth}
					<Header />
					<div
						className="w-full h-[calc(100%_-_5rem)] \
						 max-w-[var(--app-width)] m-auto overflow-y-auto"
					>
						{children}
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
