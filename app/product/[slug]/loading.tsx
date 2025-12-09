import { Navigation } from "@/components/navigation";
import { ProductDetailSkeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main>
      <Navigation />
      <section className="pt-28 pb-24 lg:pb-32 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
          <ProductDetailSkeleton />
        </div>
      </section>
    </main>
  );
}
