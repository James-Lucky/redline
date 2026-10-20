import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metric Flow — Sales Analytics Dashboard",
  description:
    "Real-time sales analytics dashboard featuring sales performance, order heatmaps, top products, country breakdowns, and AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0e1013] text-white antialiased selection:bg-[#ff5530]/30 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
