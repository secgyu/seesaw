"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";
import { ShareButtons } from "@/components/share-buttons";
import type { Product } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";

interface ProductInfoProps {
  product: Product;
}

const colorHexMap: Record<string, string> = {
  Black: "#1a1a1a",
  White: "#ffffff",
  Navy: "#1a2a4a",
  Beige: "#e8e0d5",
  Yellow: "#f0e500",
};

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  useEffect(() => {
    addToRecentlyViewed(product.id);
  }, [product.id, addToRecentlyViewed]);

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
      color: selectedColor,
      quantity,
      image: product.images[0],
    });

    showToast({
      type: "cart",
      message: "Added to bag",
      description: `${product.name} - Size ${selectedSize}`,
    });
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const sizeGuide = [
    { size: "XS", chest: "82-86", waist: "62-66", hips: "88-92" },
    { size: "S", chest: "86-90", waist: "66-70", hips: "92-96" },
    { size: "M", chest: "90-94", waist: "70-74", hips: "96-100" },
    { size: "L", chest: "94-98", waist: "74-78", hips: "100-104" },
    { size: "XL", chest: "98-102", waist: "78-82", hips: "104-108" },
  ];

  return (
    <div className="lg:sticky lg:top-32">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-light">{product.name}</h1>
            <p className="text-xl font-light text-muted-foreground mt-2">${product.price.toLocaleString()}</p>
          </div>
          <ShareButtons url={`/product/${product.id}`} title={`${product.name} | SEESAW`} />
        </div>

        <p className="text-sm font-light leading-relaxed text-muted-foreground">{product.description}</p>

        {product.colors.length > 1 && (
          <div>
            <p className="text-[11px] font-light tracking-[0.1em] uppercase mb-3">Color: {selectedColor}</p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 border transition-all ${
                    selectedColor === color ? "ring-2 ring-black ring-offset-2" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: colorHexMap[color] || color }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] font-light tracking-[0.1em] uppercase mb-3">
            Size {selectedSize && `- ${selectedSize}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 text-sm font-light border transition-colors ${
                  selectedSize === size ? "border-black bg-black text-white" : "border-black/10 hover:border-black/30"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-light tracking-[0.1em] uppercase mb-3">Quantity</p>
          <div className="inline-flex items-center border border-black/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-6 text-sm font-light">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-3" aria-label="Increase quantity">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          data-cursor="Add"
          className={`w-full py-4 text-[11px] font-light tracking-[0.2em] uppercase transition-colors ${
            selectedSize ? "bg-black text-white hover:bg-black/90" : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {selectedSize ? "Add to Cart" : "Select a Size"}
        </button>
      </div>
      <div className="mt-12 border-t border-black/10">
        <div className="border-b border-black/10">
          <button
            onClick={() => toggleAccordion("details")}
            className="w-full py-5 flex items-center justify-between text-[11px] font-light tracking-[0.1em] uppercase"
          >
            Details
            <ChevronDown
              className={`w-4 h-4 transition-transform ${openAccordion === "details" ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === "details" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-sm font-light leading-relaxed text-muted-foreground">{product.details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="border-b border-black/10">
          <button
            onClick={() => toggleAccordion("materials")}
            className="w-full py-5 flex items-center justify-between text-[11px] font-light tracking-[0.1em] uppercase"
          >
            Materials
            <ChevronDown
              className={`w-4 h-4 transition-transform ${openAccordion === "materials" ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === "materials" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-sm font-light leading-relaxed text-muted-foreground">{product.materials}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="border-b border-black/10">
          <button
            onClick={() => toggleAccordion("sizeguide")}
            className="w-full py-5 flex items-center justify-between text-[11px] font-light tracking-[0.1em] uppercase"
          >
            Size Guide
            <ChevronDown
              className={`w-4 h-4 transition-transform ${openAccordion === "sizeguide" ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === "sizeguide" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-5">
                  <table className="w-full text-sm font-light">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="py-2 text-left font-light text-muted-foreground">Size</th>
                        <th className="py-2 text-left font-light text-muted-foreground">Chest (cm)</th>
                        <th className="py-2 text-left font-light text-muted-foreground">Waist (cm)</th>
                        <th className="py-2 text-left font-light text-muted-foreground">Hips (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuide.map((row) => (
                        <tr key={row.size} className="border-b border-black/5">
                          <td className="py-2">{row.size}</td>
                          <td className="py-2 text-muted-foreground">{row.chest}</td>
                          <td className="py-2 text-muted-foreground">{row.waist}</td>
                          <td className="py-2 text-muted-foreground">{row.hips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Link
                    href="/size-guide"
                    className="inline-block mt-4 text-[11px] font-light tracking-[0.1em] uppercase border-b border-black pb-1 hover:opacity-70 transition-opacity"
                  >
                    View Full Size Guide
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
