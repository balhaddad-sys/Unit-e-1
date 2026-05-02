import type { Metadata, Viewport } from "next";
import { Inter, Reem_Kufi, Newsreader } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const reem = Reem_Kufi({
  subsets: ["arabic", "latin"],
  variable: "--font-reem",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wasta · واسطة",
  description: "كويتي يرجع البيت بعد سنين. ابن من؟ ابن أي اسم؟ القصة تبدا الحين.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${reem.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
