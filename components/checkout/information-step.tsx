"use client";

import type { CheckoutFormData } from "@/types";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { COUNTRIES } from "@/lib/constants";

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface InformationStepProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: FormErrors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export function InformationStep({ formData, onChange, errors = {} }: InformationStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-light mb-6">Contact Information</h2>
      <div>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          className={errors.email ? "border-red-500" : ""}
        />
        <FieldError message={errors.email} />
      </div>

      <h2 className="text-xl font-light pt-6 mb-6">Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            placeholder="First Name"
            className={errors.firstName ? "border-red-500" : ""}
          />
          <FieldError message={errors.firstName} />
        </div>
        <div>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            placeholder="Last Name"
            className={errors.lastName ? "border-red-500" : ""}
          />
          <FieldError message={errors.lastName} />
        </div>
      </div>
      <div>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Address"
          className={errors.address ? "border-red-500" : ""}
        />
        <FieldError message={errors.address} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="City"
            className={errors.city ? "border-red-500" : ""}
          />
          <FieldError message={errors.city} />
        </div>
        <div>
          <Input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={onChange}
            placeholder="Postal Code"
            className={errors.postalCode ? "border-red-500" : ""}
          />
          <FieldError message={errors.postalCode} />
        </div>
      </div>
      <div>
        <Select
          name="country"
          value={formData.country}
          onChange={onChange}
          className={errors.country ? "border-red-500" : ""}
        >
          <option value="">Select Country</option>
          {COUNTRIES.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </Select>
        <FieldError message={errors.country} />
      </div>
      <Input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        placeholder="Phone (optional)"
      />
    </motion.div>
  );
}
