import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, Reem_Kufi } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const reem = Reem_Kufi({
  subsets: ["arabic"],
  variable: "--font-reem",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wasta Kuwait — A Life of Influence",
  description:
    "Choices have permanent consequences. The character you become unlocks and locks content as you go.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wasta Kuwait",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${newsreader.variable} ${reem.variable} font-sans bg-cream text-ink min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
