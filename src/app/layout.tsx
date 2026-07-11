import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

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
    template: "%s | Rosa Glamping & Pool Ciparay",
    default: "Rosa Glamping & Pool — Staycation Syariah Ciparay, Bandung",
  },
  description: "Nikmati pengalaman glamping dan kolam renang yang nyaman, asri, dan terjangkau di Ciparay, Bandung. Cocok untuk keluarga, pasangan halal, dan rombongan. Properti syariah.",
  keywords: ["glamping ciparay", "kolam renang ciparay", "staycation bandung", "penginapan syariah ciparay", "rosa glamping", "rosa swimming pool"],
  openGraph: {
    title: "Rosa Glamping & Pool Ciparay",
    description: "Staycation nyaman di tengah alam Ciparay, Bandung. Ada kolam renang, kamar ber-AC, kafe, dan suasana yang sejuk dan asri.",
    url: "https://rosaglamping.com",
    siteName: "Rosa Glamping & Pool",
    images: [
      {
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/798760522.jpg?k=e6b10381b25574e277b2204741b734f853eb40b9f13345586482665778a90630&o=&hp=1",
        width: 1024,
        height: 768,
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
      lang="id"
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-parchment-50 text-obsidian-900 antialiased">
        {children}
      </body>
    </html>
  );
}
