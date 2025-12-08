"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCart } from "@/contexts/cart-context";
import { SHIPPING_OPTIONS } from "@/lib/constants";
import type { CheckoutFormData } from "@/types";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { InformationStep } from "@/components/checkout/information-step";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { OrderSummary } from "@/components/checkout/order-summary";

type CheckoutStep = "information" | "shipping";

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
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const { state, subtotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingOption = SHIPPING_OPTIONS.find((opt) => opt.value === formData.shippingMethod);
  const shippingCost = shippingOption?.price ?? 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (currentStep === "information") setCurrentStep("shipping");
  };

  const handleBack = () => {
    if (currentStep === "shipping") setCurrentStep("information");
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items,
          shippingCost,
          formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
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
          {canceled && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
              Payment was canceled. You can try again when you&apos;re ready.
            </div>
          )}

          {error && <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <CheckoutSteps currentStep={currentStep} />

              <div>
                {currentStep === "information" && <InformationStep formData={formData} onChange={handleInputChange} />}

                {currentStep === "shipping" && (
                  <ShippingStep shippingMethod={formData.shippingMethod} onChange={handleInputChange} />
                )}

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

                  {currentStep === "shipping" ? (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="px-8 py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
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
              </div>
            </motion.div>

            <OrderSummary items={state.items} subtotal={subtotal} shippingCost={shippingCost} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
