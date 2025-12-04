"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  { value: "all", label: "All" },
  { value: "outerwear", label: "Outerwear" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "accessories", label: "Accessories" },
];

const colors = [
  { value: "Black", hex: "#1a1a1a" },
  { value: "White", hex: "#ffffff" },
  { value: "Navy", hex: "#1a2a4a" },
  { value: "Beige", hex: "#e8e0d5" },
  { value: "Yellow", hex: "#f0e500" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name" },
];

export function CollectionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
  const currentColor = searchParams.get("color") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md py-4 -mx-8 lg:-mx-12 px-8 lg:px-12 border-b border-black/5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParams("category", cat.value)}
              className={`px-4 py-2 text-[11px] font-light tracking-[0.15em] uppercase whitespace-nowrap border transition-colors ${
                currentCategory === cat.value
                  ? "border-black bg-black text-white"
                  : "border-black/10 hover:border-black/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateParams("color", currentColor === color.value ? "" : color.value)}
                className={`w-6 h-6 border transition-all ${
                  currentColor === color.value ? "ring-2 ring-black ring-offset-2" : "hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Filter by ${color.value}`}
              />
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-[11px] font-light tracking-[0.1em] uppercase"
            >
              Sort
              <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateParams("sort", option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-light hover:bg-muted transition-colors ${
                        currentSort === option.value ? "bg-muted" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
