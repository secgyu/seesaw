"use client";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";

import { useCart } from "@/contexts/cart-context";

export function CartSidebar() {
  const { state, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-black/10">
              <span className="text-[11px] font-light tracking-[0.2em] uppercase">
                Cart ({state.items.length})
              </span>
              <button onClick={closeCart} className="p-2 -m-2" aria-label="Close cart">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {state.items.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm font-light text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6">
                      <div className="relative w-24 h-32 bg-muted flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-light">{item.name}</h3>
                          <p className="text-xs font-light text-muted-foreground mt-1">
                            {item.color} / {item.size}
                          </p>
                          <p className="text-sm font-light mt-2">${item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-black/10">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.size, item.color, item.quantity - 1);
                                }
                              }}
                              className="p-2"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 text-sm font-light">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                              }
                              className="p-2"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.size, item.color)}
                            className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {state.items.length > 0 && (
              <div className="px-8 py-6 border-t border-black/10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-light">Subtotal</span>
                  <span className="text-sm font-light">${subtotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors text-center"
                >
                  Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full py-4 text-[11px] font-light tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
