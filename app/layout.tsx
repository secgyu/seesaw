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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seesaw.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SEESAW | Different is Balance",
    template: "%s | SEESAW",
  },
  description:
    "균형과 이중성에서 영감받은 프리미엄 패션 브랜드. 비대칭 컬러 블로킹의 미니멀리스트 디자인.",
  keywords: [
    "SEESAW",
    "시소",
    "프리미엄 패션",
    "럭셔리 패션",
    "미니멀 패션",
    "디자이너 브랜드",
    "명품",
    "luxury fashion",
    "minimalist",
    "designer clothing",
  ],
  authors: [{ name: "SEESAW" }],
  creator: "SEESAW",
  publisher: "SEESAW",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "SEESAW",
    title: "SEESAW | Different is Balance",
    description: "균형과 이중성에서 영감받은 프리미엄 패션 브랜드",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 526,
        alt: "SEESAW - Different is Balance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEESAW | Different is Balance",
    description: "균형과 이중성에서 영감받은 프리미엄 패션 브랜드",
    images: ["/images/og.png"],
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
  verification: {
    // google: "your-google-verification-code",
    // naver: "your-naver-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
