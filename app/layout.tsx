import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ToastProvider } from "@/lib/toast-context";
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context";
import { CustomCursor } from "@/components/custom-cursor";
import { BackToTop } from "@/components/back-to-top";
import { NewsletterPopup } from "@/components/newsletter-popup";

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
        <Analytics />
      </body>
    </html>
  );
}
