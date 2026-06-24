// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cinderella Shoe Store",
    template: "%s | Cinderella Shoe Store",
  },
  description: "Elegant shoes for every occasion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}