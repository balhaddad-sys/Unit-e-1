import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, Reem_Kufi } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const reem = Reem_Kufi({ subsets: ["arabic"], variable: "--font-reem", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Wasta Kuwait — وَسطة",
  description: "A Kuwaiti life-sim. Choices have permanent consequences.",
  manifest: "/manifest.json",
  applicationName: "Wasta Kuwait",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Wasta" },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} ${reem.variable}`}>
        {children}
      </body>
    </html>
  );
}
