"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { Check, Loader2, Tag, X } from "lucide-react";

import type { CartItem } from "@/contexts/cart-context";

export interface AppliedCoupon {
  id: string;
  code: string;
  description: string | null;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  appliedCoupon: AppliedCoupon | null;
  onApplyCoupon: (coupon: AppliedCoupon) => void;
  onRemoveCoupon: () => void;
}

export function OrderSummary({
  items,
  subtotal,
  shippingCost,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsValidating(true);
    setCouponError(null);

    try {
      const response = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error || "Invalid coupon");
        return;
      }

      onApplyCoupon({
        id: data.coupon.id,
        code: data.coupon.code,
        description: data.coupon.description,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        discountAmount: data.discountAmount,
      });
      setCouponCode("");
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponError(null);
  };

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
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
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

      <div className="mt-8 pt-6 border-t border-black/10">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-light">Discount Code</span>
        </div>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
              <span className="text-xs text-green-600">
                (
                {appliedCoupon.discountType === "percentage"
                  ? `${appliedCoupon.discountValue}% off`
                  : `$${appliedCoupon.discountValue} off`}
                )
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="p-1 hover:bg-green-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponError(null);
              }}
              placeholder="Enter code"
              className="flex-1 px-4 py-3 border border-black/20 text-sm font-light focus:outline-none focus:border-black transition-colors uppercase"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponCode.trim()}
              className="px-6 py-3 bg-black text-white text-xs font-light tracking-wider uppercase hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
            </button>
          </div>
        )}

        {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
      </div>

      <div className="mt-6 pt-6 border-t border-black/10 space-y-3">
        <div className="flex justify-between text-sm font-light">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm font-light">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toLocaleString()}`}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm font-light text-green-600">
            <span>Discount</span>
            <span>-${discountAmount.toLocaleString()}</span>
          </div>
        )}
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
