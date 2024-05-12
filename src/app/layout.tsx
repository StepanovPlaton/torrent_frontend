import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/widgets/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: ".Torrent",
  description:
    ".Torrent - сервис обмена .torrent файлами видеоигр, фильмов и аудиокниг",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning for theme support
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider enableSystem={false} defaultTheme="light">
          <Header />
          <div className="w-full h-full max-w-[var(--app-width)] m-auto">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
