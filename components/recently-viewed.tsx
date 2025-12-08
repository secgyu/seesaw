"use client";

import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import { ProductCard } from "./product-card";
import { motion } from "framer-motion";

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { recentlyViewed } = useRecentlyViewed();
  const productsToShow = recentlyViewed.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (productsToShow.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 px-8 lg:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl font-light tracking-wide mb-12"
        >
          Recently Viewed
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {productsToShow.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
