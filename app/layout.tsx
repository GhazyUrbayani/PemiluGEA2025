import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, Archivo_Black } from "next/font/google";
import { cn } from "@/lib/utils";
import BodyLayout from "./body-layout";

// 1. DEATH STAR REGULAR - Judul Utama (H1)
const deathStarFont = localFont({
  src: "./fonts/Big-Campus.ttf",
  variable: "--font-death-star",
  weight: "400",
});

// 2. HELVETICA BLACK ORIGINAL - Sub-Judul (H2)
const helveticaBlack = Archivo_Black({
  variable: "--font-helvetica-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// 3. Atures 900 - Heading Alternatif (H3)
const atures900 = Inter({
  variable: "--font-atures",
  weight: ["900"],
  subsets: ["latin"],
  display: "swap",
});

// 4. Trade Gothic Bold #2 - Body Text & Button
const tradeGothic = Inter({
  variable: "--font-trade-gothic",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Shared viewport config
export const viewport: Viewport = {
  themeColor: "#951518", // Sith Red - Star Wars Theme 2025
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "PEMILU GEA ITB 2025 - May the Force Be With You",
  description:
    'Selamat datang di Website Resmi Pemilu HMTG "GEA" ITB 2025! Berpartisipasilah dalam pemilihan Ketua Umum BPH dan Senator periode 2025 dengan tema Star Wars. May the force be with you!',
  generator: "Next.js",
  applicationName: "Pemilu GEA 2025 - Star Wars Edition",
  keywords: [
    "Pemilu GEA ITB 2025",
    "HMTG GEA",
    "Star Wars Theme",
    "Voting",
    "Demokrasi",
    "ITB",
    "BPH",
    "Senator",
    "May the Force",
  ],
  category: "democracy",
  metadataBase: new URL("https://pemilu-gea-2025.vercel.app/"),
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        deathStarFont.variable,
        helveticaBlack.variable,
        atures900.variable,
        tradeGothic.variable,
      )}
    >
      <BodyLayout>{children}</BodyLayout>
    </html>
  );
}
