"use client";

import { useEffect } from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center bg-red-50 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-light tracking-wide mb-4">Something went wrong</h1>

        <p className="text-muted-foreground font-light mb-8 leading-relaxed">
          We apologize for the inconvenience. An unexpected error has occurred. Please try again or
          return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-light tracking-wide hover:bg-foreground/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border border-border text-sm font-light tracking-wide hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-muted-foreground/60">Error ID: {error.digest}</p>
        )}
      </motion.div>
    </main>
  );
}
