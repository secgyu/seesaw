"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import type { CartItem } from "@/contexts/cart-context";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
}

export function OrderSummary({ items, subtotal, shippingCost }: OrderSummaryProps) {
  const total = subtotal + shippingCost;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="lg:pl-16 lg:border-l border-black/10"
    >
      <h2 className="text-xl font-light mb-8">Order Summary</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
            <div className="relative w-20 h-24 bg-muted flex-shrink-0">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-black/70 text-white text-[10px] flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light">{item.name}</h3>
              <p className="text-xs text-muted-foreground font-light mt-1">
                {item.size} / {item.color}
              </p>
              <p className="text-sm font-light mt-2">${item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-black/10 space-y-3">
        <div className="flex justify-between text-sm font-light">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm font-light">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toLocaleString()}`}</span>
        </div>
        <div className="flex justify-between text-base font-light pt-3 border-t border-black/10">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <Check className="w-4 h-4 mt-0.5 text-green-600" />
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Free returns within 14 days. All items are shipped with complimentary gift packaging.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
