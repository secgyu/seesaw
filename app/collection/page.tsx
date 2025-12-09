import { Suspense } from "react";

import { CartSidebar } from "@/components/cart-sidebar";
import { CollectionFilters } from "@/components/collection/collection-filters";
import { CollectionGrid } from "@/components/collection/collection-grid";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Collection | SEESAW",
  description:
    "Explore the complete SEESAW collection. Minimalist luxury fashion defined by balance and duality.",
};

export default function CollectionPage() {
  return (
    <main>
      <Navigation />
      <CartSidebar />

      <section className="pt-32 pb-24 lg:pb-32 px-8 lg:px-12">
        <h1 className="text-center text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase mb-16 lg:mb-24">
          Collection
        </h1>

        <Suspense fallback={<div className="h-16" />}>
          <CollectionFilters />
        </Suspense>

        <Suspense fallback={<CollectionGridSkeleton />}>
          <CollectionGrid />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}

function CollectionGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
