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
  metadataBase: new URL('https://dresscowear.com'),
  title: "DressCo | Sri Lanka's Best Premium Fabric Cloths",
  description: "Experience Sri Lanka's finest premium fabric cloths. Shop online for exclusive women's fashion, men's fashion, kids' fashion, t-shirts, and more. Quality you can feel.",
  keywords: ["dressco", "sri lanka", "premium fabric", "cloths", "fashion", "online store", "women fashion", "men fashion", "kids fashion", "t-shirts", "buy clothes online"],
  authors: [{ name: "DressCo" }],
  openGraph: {
    title: "DressCo | Sri Lanka's Best Premium Fabric Cloths",
    description: "Discover premium quality fashion for men, women, and kids. Shop the best fabric cloths in Sri Lanka online.",
    url: "https://dresscowear.com",
    siteName: "DressCo",
    images: [
      {
        url: "/logo.png", // Assuming logo.png is a good OG image, or I could use a banner if available
        width: 800,
        height: 600,
        alt: "DressCo Premium Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import ConditionalLayout from "@/components/ConditionalLayout";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Toaster } from "react-hot-toast";

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
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster position="top-center" />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


