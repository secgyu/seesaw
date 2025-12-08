"use client";

import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

interface InformationStepProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const inputClassName =
  "w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors";

export function InformationStep({ formData, onChange }: InformationStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <h2 className="text-xl font-light mb-6">Contact Information</h2>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email"
        required
        className={inputClassName}
      />

      <h2 className="text-xl font-light pt-6 mb-6">Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="First Name"
          required
          className={inputClassName}
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          placeholder="Last Name"
          required
          className={inputClassName}
        />
      </div>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        required
        className={inputClassName}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="City"
          required
          className={inputClassName}
        />
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={onChange}
          placeholder="Postal Code"
          required
          className={inputClassName}
        />
      </div>
      <select
        name="country"
        value={formData.country}
        onChange={onChange}
        required
        className={`${inputClassName} bg-white`}
      >
        <option value="">Select Country</option>
        {COUNTRIES.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        placeholder="Phone (optional)"
        className={inputClassName}
      />
    </motion.div>
  );
}

