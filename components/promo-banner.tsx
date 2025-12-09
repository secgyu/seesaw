"use client";

import { useState } from "react";

import Link from "next/link";

import { X } from "lucide-react";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white">
      <div className="relative flex items-center justify-center px-8 py-3">
        <p className="text-[11px] font-light tracking-[0.15em] uppercase text-center">
          Free shipping on orders over $500 |
          <Link href="/collection" className="underline ml-1 hover:opacity-70 transition-opacity">
            Shop Now
          </Link>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close banner"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
}
