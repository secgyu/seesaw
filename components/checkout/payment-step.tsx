"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CheckoutFormData } from "@/lib/types";

interface PaymentStepProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PaymentStep({ formData, onChange }: PaymentStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-light">Payment</h2>
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={onChange}
        placeholder="Card Number"
        required
      />
      <Input
        type="text"
        name="cardName"
        value={formData.cardName}
        onChange={onChange}
        placeholder="Name on Card"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          name="cardExpiry"
          value={formData.cardExpiry}
          onChange={onChange}
          placeholder="MM/YY"
          required
        />
        <Input type="text" name="cardCvc" value={formData.cardCvc} onChange={onChange} placeholder="CVC" required />
      </div>
    </motion.div>
  );
}
