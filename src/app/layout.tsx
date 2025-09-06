import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ThemeProviderWrapper from '@/components/theme-provider'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Groceries Manager",
  description: "Manage grocery items, shopping lists, templates, and purchase history. A simple, fast catalog for everyday shopping.",
  keywords: ["groceries", "shopping", "catalog", "shopping list", "purchase history", "templates"],
  authors: [{ name: "GroceriesApp" }],
  openGraph: {
    title: "Groceries Manager",
    description: "Manage grocery items, shopping lists, templates, and purchase history.",
    url: "https://localhost:3000",
    siteName: "Groceries Manager",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groceries Manager",
    description: "Manage grocery items, shopping lists, templates, and purchase history.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>
            <div className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground min-h-screen relative`}>
              {children}
              <Toaster />
            </div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
