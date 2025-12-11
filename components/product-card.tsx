"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";

import { useToast } from "@/contexts/toast-context";
import { useWishlist } from "@/contexts/wishlist-context";

import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  size?: "normal" | "large";
  index?: number;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  size = "normal",
  index = 0,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleItem } = useWishlist();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const aspectRatio = size === "large" ? "aspect-[3/4]" : "aspect-[4/5]";

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    showToast({
      type: "wishlist",
      message: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${product.slug}`}>
        <div
          className="group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-cursor="View"
        >
          <div className={`relative ${aspectRatio} bg-muted overflow-hidden`}>
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${isHovered ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src={product.images[1] || product.images[0]}
              alt={`${product.name} alternate view`}
              fill
              className={`object-cover transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
            />

            <div
              className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}
            >
              <button
                onClick={handleWishlistClick}
                className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-4 h-4 stroke-[1.5] transition-colors ${
                    inWishlist ? "fill-black stroke-black" : "fill-transparent stroke-black"
                  }`}
                />
              </button>

              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                  aria-label="Quick view"
                >
                  <Eye className="w-4 h-4 stroke-[1.5]" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-light">{product.name}</h3>
            <p className="text-sm font-light text-muted-foreground">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
