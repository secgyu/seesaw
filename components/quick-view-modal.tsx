"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/contexts/toast-context";
import type { Product } from "@/data/products";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { showToast } = useToast();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast({ type: "error", message: "Please select a size" });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor || product.colors[0],
      quantity: 1,
      image: product.images[0],
    });
    showToast({
      type: "cart",
      message: "Added to bag",
      description: `${product.name} - Size ${selectedSize}`,
    });
  };

  const handleWishlist = () => {
    toggleItem(product.id);
    showToast({
      type: "wishlist",
      message: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[900px] md:max-h-[85vh] bg-background z-[101] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row h-full">
              <div className="relative w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-full bg-muted">
                <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 transition-colors ${i === currentImageIndex ? "bg-black" : "bg-black/30"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">{product.category}</p>
                    <h2 className="text-2xl font-light">{product.name}</h2>
                    <p className="text-xl font-light mt-2">${product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-3">Color</p>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 text-xs border transition-colors ${
                            selectedColor === color
                              ? "border-black bg-black text-white"
                              : "border-border hover:border-black"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-3">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 text-sm border transition-colors ${
                            selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-border hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleAddToCart} className="flex-1 h-12" data-cursor="Add">
                      Add to Bag
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent" onClick={handleWishlist}>
                      <Heart className={`w-5 h-5 ${inWishlist ? "fill-black" : "fill-transparent"}`} />
                    </Button>
                  </div>
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="block text-center text-sm underline underline-offset-4 hover:no-underline"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
