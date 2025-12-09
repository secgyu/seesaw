"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";

import { type Product, products } from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results: Product[] = useMemo(() => {
    if (query.length > 1) {
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.colors.some((color) => color.toLowerCase().includes(query.toLowerCase()))
      );
    }
    return [];
  }, [query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const popularSearches = ["Coat", "Blazer", "Cashmere", "Trousers", "Silk"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-black/10">
              <span className="text-sm font-light tracking-[0.3em] uppercase">Search</span>
              <button onClick={handleClose} className="p-2 -m-2" aria-label="Close search">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
            <div className="px-8 py-8 border-b border-black/10">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[1.5] text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-8 pr-4 py-3 text-lg font-light bg-transparent border-b border-black focus:border-black focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-4xl mx-auto">
                {query.length === 0 && (
                  <div>
                    <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground mb-6">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 border border-black/20 text-sm font-light hover:bg-black hover:text-white transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {query.length > 0 && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground font-light">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground font-light mt-2">
                      Try searching for a different term
                    </p>
                  </div>
                )}
                {results.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground">
                        {results.length} Result{results.length !== 1 ? "s" : ""}
                      </h3>
                      <Link
                        href={`/collection?search=${encodeURIComponent(query)}`}
                        onClick={handleClose}
                        className="flex items-center gap-2 text-[11px] font-light tracking-[0.2em] uppercase hover:underline"
                      >
                        View All <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {results.slice(0, 8).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={handleClose}
                          className="group"
                        >
                          <div className="aspect-[4/5] relative bg-muted overflow-hidden mb-3">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <h4 className="text-sm font-light">{product.name}</h4>
                          <p className="text-sm font-light text-muted-foreground">
                            ${product.price.toLocaleString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
