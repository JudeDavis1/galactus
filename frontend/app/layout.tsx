import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { useTheme } from "next-themes";

import { SiteHeader } from "./site-header";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme-mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={cn("min-h-screen bg-background font-sans p-4")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            {/* SITE HEADER */}
            <SiteHeader />
            <div className="flex-1">{children}</div>
            {/* SITE FOOTER */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
