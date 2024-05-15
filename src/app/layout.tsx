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
          <div className="w-full h-full max-w-[var(--app-width)] m-auto">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
