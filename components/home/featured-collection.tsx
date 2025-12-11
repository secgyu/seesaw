"use client";

import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

import { type Product, getFeaturedProducts } from "@/lib/products";

export function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getFeaturedProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 lg:py-32 px-8 lg:px-12">
      <h2 className="text-center text-2xl font-light tracking-[0.2em] uppercase mb-16 lg:mb-24">
        Latest Collection
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
      </div>
    </section>
  );
}
