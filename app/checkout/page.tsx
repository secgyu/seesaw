"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCart } from "@/lib/cart-context";
import { SHIPPING_OPTIONS } from "@/lib/constants";
import type { CheckoutStep, CheckoutFormData } from "@/lib/types";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { InformationStep } from "@/components/checkout/information-step";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { OrderSummary } from "@/components/checkout/order-summary";

const initialFormData: CheckoutFormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
  shippingMethod: "standard",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);

  const shippingOption = SHIPPING_OPTIONS.find((opt) => opt.value === formData.shippingMethod);
  const shippingCost = shippingOption?.price ?? 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (currentStep === "information") setCurrentStep("shipping");
    else if (currentStep === "shipping") setCurrentStep("payment");
  };

  const handleBack = () => {
    if (currentStep === "shipping") setCurrentStep("information");
    else if (currentStep === "payment") setCurrentStep("shipping");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/order-confirmation");
  };

  if (state.items.length === 0) {
    return (
      <>
        <Navigation />
        <CartSidebar />
        <main className="min-h-screen pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4">Your cart is empty</h1>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-sm font-light underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <CartSidebar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <CheckoutSteps currentStep={currentStep} />

              <form onSubmit={handleSubmit}>
                {currentStep === "information" && <InformationStep formData={formData} onChange={handleInputChange} />}

                {currentStep === "shipping" && (
                  <ShippingStep shippingMethod={formData.shippingMethod} onChange={handleInputChange} />
                )}

                {currentStep === "payment" && <PaymentStep formData={formData} onChange={handleInputChange} />}

                <div className="flex items-center justify-between mt-10 pt-6 border-t border-black/10">
                  {currentStep !== "information" ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <Link
                      href="/collection"
                      className="flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Return to Shop
                    </Link>
                  )}

                  {currentStep === "payment" ? (
                    <button
                      type="submit"
                      className="px-8 py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
                    >
                      Complete Order
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="px-8 py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            <OrderSummary items={state.items} subtotal={subtotal} shippingCost={shippingCost} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
