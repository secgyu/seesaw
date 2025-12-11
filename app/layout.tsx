import type React from "react";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import { BackToTop } from "@/components/back-to-top";
import { CustomCursor } from "@/components/custom-cursor";
import { NewsletterPopup } from "@/components/newsletter-popup";

import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import { ToastProvider } from "@/contexts/toast-context";
import { WishlistProvider } from "@/contexts/wishlist-context";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SEESAW | Different is Balance",
  description:
    "Luxury fashion brand inspired by balance and duality. Minimalist designs with asymmetric color blocking.",
  keywords: ["luxury fashion", "minimalist", "designer clothing", "SEESAW"],
  openGraph: {
    title: "SEESAW | Different is Balance",
    description: "Luxury fashion brand inspired by balance and duality.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <RecentlyViewedProvider>
                  <CustomCursor />
                  {children}
                  <BackToTop />
                  <NewsletterPopup />
                </RecentlyViewedProvider>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
