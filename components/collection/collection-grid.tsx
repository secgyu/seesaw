"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { QuickViewModal } from "@/components/quick-view-modal";

export function CollectionGrid() {
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.reverse();
    }

    return result;
  }, [category, sort]);

  const getCardSize = (index: number): "normal" | "large" => {
    const pattern = index % 8;
    return pattern === 0 || pattern === 3 || pattern === 7 ? "large" : "normal";
  };

  return (
    <div className="mt-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-auto">
        {filteredProducts.map((product, index) => (
          <div key={product.id} className={getCardSize(index) === "large" ? "md:row-span-1" : ""}>
            <ProductCard product={product} size={getCardSize(index)} index={index} onQuickView={setQuickViewProduct} />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-sm font-light text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
