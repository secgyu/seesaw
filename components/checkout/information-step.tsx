"use client";

import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CheckoutFormData } from "@/types";

interface InformationStepProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function InformationStep({ formData, onChange }: InformationStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <h2 className="text-xl font-light mb-6">Contact Information</h2>
      <Input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />

      <h2 className="text-xl font-light pt-6 mb-6">Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="First Name"
          required
        />
        <Input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          placeholder="Last Name"
          required
        />
      </div>
      <Input type="text" name="address" value={formData.address} onChange={onChange} placeholder="Address" required />
      <div className="grid grid-cols-2 gap-4">
        <Input type="text" name="city" value={formData.city} onChange={onChange} placeholder="City" required />
        <Input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={onChange}
          placeholder="Postal Code"
          required
        />
      </div>
      <Select name="country" value={formData.country} onChange={onChange} required>
        <option value="">Select Country</option>
        {COUNTRIES.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </Select>
      <Input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Phone (optional)" />
    </motion.div>
  );
}
