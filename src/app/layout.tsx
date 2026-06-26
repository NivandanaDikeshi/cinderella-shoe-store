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


export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (

    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >

      <body className="min-h-screen bg-white text-gray-900">

        <AuthProvider>

          <LayoutClient>
            {children}
          </LayoutClient>

        </AuthProvider>

      </body>

    </html>

  );

}