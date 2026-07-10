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
  title: {
    template: "%s | Damar Retreats",
    default: "Damar Retreats — Luxury Glamping & A-Frame",
  },
  description: "An exclusive sanctuary where modern luxury meets the untamed beauty of nature. Discover our premium A-Frame cabins and luxury tents.",
  keywords: ["glamping", "a-frame", "luxury resort", "nature retreat", "damar", "staycation"],
  openGraph: {
    title: "Damar Retreats",
    description: "An exclusive sanctuary where modern luxury meets the untamed beauty of nature.",
    url: "https://damarglamping.com",
    siteName: "Damar Retreats",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col bg-parchment-50 text-obsidian-900 antialiased">
        {children}
      </body>
    </html>
  );
}
