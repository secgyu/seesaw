"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { Minus, Plus, Save, Search } from "lucide-react";

import type { DBProduct } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

interface InventoryItem {
  id: string;
  product_id: string;
  size: string;
  stock: number;
}

interface ProductWithInventory extends DBProduct {
  inventory: InventoryItem[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedStocks, setUpdatedStocks] = useState<Record<string, number>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(query));
  }, [products, searchQuery]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!isMounted) return;

      if (!productsData) {
        setIsLoading(false);
        return;
      }

      const productIds = productsData.map((p) => p.id);
      const { data: inventoryData } = await supabase
        .from("inventory")
        .select("*")
        .in("product_id", productIds);

      if (!isMounted) return;

      const productsWithInventory = productsData.map((product) => ({
        ...product,
        inventory: inventoryData?.filter((inv) => inv.product_id === product.id) || [],
      }));

      setProducts(productsWithInventory);
      setIsLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const getStockKey = (productId: string, size: string) => `${productId}-${size}`;

  const getCurrentStock = (productId: string, size: string, originalStock: number) => {
    const key = getStockKey(productId, size);
    return updatedStocks[key] ?? originalStock;
  };

  const updateStock = (productId: string, size: string, originalStock: number, delta: number) => {
    const key = getStockKey(productId, size);
    const current = getCurrentStock(productId, size, originalStock);
    const newStock = Math.max(0, current + delta);
    setUpdatedStocks((prev) => ({ ...prev, [key]: newStock }));
  };

  const setStock = (productId: string, size: string, value: number) => {
    const key = getStockKey(productId, size);
    setUpdatedStocks((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const hasChanges = (productId: string, size: string, originalStock: number) => {
    const key = getStockKey(productId, size);
    return updatedStocks[key] !== undefined && updatedStocks[key] !== originalStock;
  };

  const saveStock = async (inventoryId: string, productId: string, size: string) => {
    const key = getStockKey(productId, size);
    const newStock = updatedStocks[key];

    if (newStock === undefined) return;

    setSavingIds((prev) => new Set(prev).add(inventoryId));

    await supabase.from("inventory").update({ stock: newStock }).eq("id", inventoryId);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              inventory: p.inventory.map((inv) =>
                inv.id === inventoryId ? { ...inv, stock: newStock } : inv
              ),
            }
          : p
      )
    );

    setUpdatedStocks((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    setSavingIds((prev) => {
      const updated = new Set(prev);
      updated.delete(inventoryId);
      return updated;
    });
  };

  const getTotalStock = (product: ProductWithInventory) => {
    return product.inventory.reduce((sum, inv) => {
      const key = getStockKey(product.id, inv.size);
      return sum + (updatedStocks[key] ?? inv.stock);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-32" />
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="h-96 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-light">Inventory</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage stock levels</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4 border-b border-neutral-100">
              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                {product.images[0] && (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-neutral-500">{formatCurrency(product.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">Total Stock</p>
                <p className="text-lg font-medium">{getTotalStock(product)}</p>
              </div>
            </div>

            {product.inventory.length === 0 ? (
              <div className="p-4 text-sm text-neutral-500">
                No inventory data. Add sizes to this product first.
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {product.inventory.map((inv) => {
                    const currentStock = getCurrentStock(product.id, inv.size, inv.stock);
                    const changed = hasChanges(product.id, inv.size, inv.stock);
                    const isSaving = savingIds.has(inv.id);

                    return (
                      <div
                        key={inv.id}
                        className={`p-3 rounded-lg border ${
                          changed ? "border-blue-300 bg-blue-50" : "border-neutral-200"
                        }`}
                      >
                        <div className="text-center mb-2">
                          <span className="text-sm font-medium">{inv.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateStock(product.id, inv.size, inv.stock, -1)}
                            className="p-1.5 rounded hover:bg-neutral-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={currentStock}
                            onChange={(e) =>
                              setStock(product.id, inv.size, parseInt(e.target.value) || 0)
                            }
                            className="w-full text-center text-sm py-1 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            min="0"
                          />
                          <button
                            onClick={() => updateStock(product.id, inv.size, inv.stock, 1)}
                            className="p-1.5 rounded hover:bg-neutral-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {changed && (
                          <button
                            onClick={() => saveStock(inv.id, product.id, inv.size)}
                            disabled={isSaving}
                            className="w-full mt-2 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          {products.length === 0 ? "No products yet" : "No products match your search"}
        </div>
      )}
    </div>
  );
}
