import Link from "next/link";

import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid md:grid-cols-2">
        <div className="bg-black flex items-center justify-center p-12 min-h-[50vh] md:min-h-screen">
          <div className="text-center">
            <span className="text-white/20 text-[120px] md:text-[200px] font-light leading-none">
              4
            </span>
          </div>
        </div>
        <div className="bg-white flex items-center justify-center p-12 min-h-[50vh] md:min-h-screen">
          <div className="text-center">
            <span className="text-black/10 text-[120px] md:text-[200px] font-light leading-none">
              4
            </span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center pointer-events-auto px-8">
          <h1 className="text-4xl md:text-6xl font-light mb-4 mix-blend-difference text-white">
            Page Not Found
          </h1>
          <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/collection"
              className="flex items-center gap-2 px-8 py-4 border border-black text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
            >
              View Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <Link
          href="/"
          className="text-sm font-light tracking-[0.3em] uppercase mix-blend-difference text-white"
        >
          SEESAW
        </Link>
      </div>
    </div>
  );
}
