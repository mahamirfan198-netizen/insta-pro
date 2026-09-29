import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "INSTA PRO — Capture. Connect. Create.",
  description: "A premium social experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="relative">
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}