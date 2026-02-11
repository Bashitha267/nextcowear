import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DressCo | Premium Cloths",
  description: "Exquisite Cloths for the modern individual.",
};

import ConditionalLayout from "@/components/ConditionalLayout";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased font-sans`}
      >
        <CartProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  );
}


