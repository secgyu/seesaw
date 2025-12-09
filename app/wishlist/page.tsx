"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";

import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ProductCard } from "@/components/product-card";

import { useWishlist } from "@/contexts/wishlist-context";

import { products } from "@/data/products";

export default function WishlistPage() {
  const { state } = useWishlist();
  const wishlistProducts = products.filter((p) => state.items.includes(p.id));

  return (
    <>
      <Navigation />
      <CartSidebar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Wishlist</h1>
            <p className="text-muted-foreground font-light">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? "s" : ""} saved
            </p>
          </motion.div>
          <div className="max-w-7xl mx-auto">
            {wishlistProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center py-20"
              >
                <Heart className="w-12 h-12 stroke-[1] mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-xl font-light mb-4">Your wishlist is empty</h2>
                <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">
                  Save your favorite pieces to revisit later. Click the heart icon on any product to
                  add it here.
                </p>
                <Link
                  href="/collection"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {wishlistProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
