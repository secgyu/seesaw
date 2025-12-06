"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "./products";
import { getProductById } from "./products";

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 8;

function getInitialRecentlyViewed(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("seesaw-recently-viewed");
  if (stored) {
    const ids = JSON.parse(stored) as string[];
    return ids.map((id) => getProductById(id)).filter((p): p is Product => p !== undefined);
  }
  return [];
}

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(getInitialRecentlyViewed);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== productId);
      const product = getProductById(productId);
      if (!product) return prev;

      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      const ids = updated.map((p) => p.id);
      localStorage.setItem("seesaw-recently-viewed", JSON.stringify(ids));
      return updated;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
