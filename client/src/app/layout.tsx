import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { WebsiteLoader } from "@/components/WebsiteLoader";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Redline",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  description:
    "Real-time sales analytics dashboard featuring sales performance, order heatmaps, top products, country breakdowns, and AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${manrope.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#0e1013] text-white antialiased selection:bg-[#ff5530]/30 selection:text-white min-h-screen"
      >
        <WebsiteLoader />
        {children}
      </body>
    </html>
  );
}



