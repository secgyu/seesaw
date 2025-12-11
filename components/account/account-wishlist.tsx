"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronRight, Heart } from "lucide-react";

import type { Product } from "@/lib/products";

interface AccountWishlistProps {
  products: Product[];
}

export function AccountWishlist({ products }: AccountWishlistProps) {
  const validProducts = products;

  return (
    <div>
      <h2 className="text-xl font-extralight tracking-wide mb-6">My Wishlist</h2>
      {validProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {validProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group border border-border p-4 flex gap-4"
            >
              <div className="w-24 h-32 bg-neutral-100 dark:bg-neutral-800 shrink-0 relative">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-light group-hover:underline">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-1">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-border">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground font-light mb-4">Your wishlist is empty</p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs font-light tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline"
          >
            Explore Collection <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
