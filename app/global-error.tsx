"use client";

import { Inter } from "next/font/google";

import { AlertTriangle, RefreshCw } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <main className="min-h-screen flex items-center justify-center px-8 bg-white">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center bg-red-50 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-light tracking-wide mb-4 text-black">Critical Error</h1>

            <p className="text-gray-500 font-light mb-8 leading-relaxed">
              A critical error has occurred. Please refresh the page or try again later.
            </p>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-light tracking-wide hover:bg-black/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>

            {error.digest && <p className="mt-8 text-xs text-gray-400">Error ID: {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  );
}
