"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";

export function CollectionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
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
          {CATEGORIES.map((cat) => (
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
                  {SORT_OPTIONS.map((option) => (
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
