"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { type Product, getProductById } from "@/lib/products";

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 8;

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      const stored = localStorage.getItem("seesaw-recently-viewed");
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        const products: Product[] = [];
        for (const id of ids) {
          const product = await getProductById(id);
          if (product) products.push(product);
        }
        setRecentlyViewed(products);
      }
    };
    loadRecentlyViewed();
  }, []);

  const addToRecentlyViewed = useCallback(async (productId: string) => {
    const product = await getProductById(productId);
    if (!product) return;

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== productId);
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
