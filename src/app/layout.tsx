import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Using Cormorant Garamond — the choice of Chanel, Louis Vuitton, Bottega Veneta
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Damar Retreats — Luxury Glamping & A-Frame",
  description: "An exclusive sanctuary where modern luxury meets the untamed beauty of nature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-950 antialiased">
        {children}
      </body>
    </html>
  );
}
