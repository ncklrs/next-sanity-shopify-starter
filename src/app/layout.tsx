import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// Cormorant Garamond - Editorial serif for headlines
// Elegant, high-contrast letterforms inspired by Garamond
// Used by luxury fashion houses for editorial typography
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Manrope - Geometric sans-serif for body text
// Clean, modern, excellent readability at all sizes
// Pairs beautifully with editorial serifs
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MAISON - Curated Luxury",
  description: "Discover exceptional pieces curated for the discerning eye. Timeless design meets uncompromising quality.",
  openGraph: {
    title: "MAISON - Curated Luxury",
    description: "Discover exceptional pieces curated for the discerning eye. Timeless design meets uncompromising quality.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
