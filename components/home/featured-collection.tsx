import { ProductCard } from "@/components/product-card";

import { getLatestProducts } from "@/data/products";

export function FeaturedCollection() {
  const products = getLatestProducts();

  return (
    <section className="py-24 lg:py-32 px-8 lg:px-12">
      <h2 className="text-center text-2xl font-light tracking-[0.2em] uppercase mb-16 lg:mb-24">
        Latest Collection
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
