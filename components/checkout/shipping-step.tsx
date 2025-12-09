"use client";

import { motion } from "framer-motion";

import { SHIPPING_OPTIONS } from "@/lib/constants";

interface ShippingStepProps {
  shippingMethod: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ShippingStep({ shippingMethod, onChange }: ShippingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-light mb-6">Shipping Method</h2>
      {SHIPPING_OPTIONS.map((option) => (
        <label
          key={option.value}
          className="flex items-center justify-between p-4 border border-black/20 cursor-pointer hover:border-black transition-colors"
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="shippingMethod"
              value={option.value}
              checked={shippingMethod === option.value}
              onChange={onChange}
              className="w-4 h-4"
            />
            <div>
              <p className="font-light">{option.label}</p>
              <p className="text-sm text-muted-foreground font-light">{option.description}</p>
            </div>
          </div>
          <span className="font-light">
            {option.price === 0 ? "Free" : `$${option.price.toFixed(2)}`}
          </span>
        </label>
      ))}
    </motion.div>
  );
}
