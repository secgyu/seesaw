import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse bg-muted rounded", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-muted" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
      <div className="lg:col-span-3">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="aspect-[3/4] col-span-2" />
          <Skeleton className="aspect-[3/4]" />
          <Skeleton className="aspect-[3/4]" />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <div className="space-y-2 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="pt-6 space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-12" />
            ))}
          </div>
        </div>
        <Skeleton className="h-14 w-full mt-8" />
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="border border-border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="border-t border-border pt-4 mt-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="flex gap-4 p-4 animate-pulse">
      <Skeleton className="w-16 h-20 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-border animate-pulse">
      <Skeleton className="w-20 h-24 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
