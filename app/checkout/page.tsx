"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCart } from "@/lib/cart-context";

type CheckoutStep = "information" | "shipping" | "payment";

export default function CheckoutPage() {
  const { state, subtotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [formData, setFormData] = useState({
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
  });

  const shippingCost = formData.shippingMethod === "express" ? 25 : 0;
  const total = subtotal + shippingCost;

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "information", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

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
    alert("Order submitted successfully!");
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
              <div className="flex items-center gap-2 text-sm mb-8">
                <Link href="/collection" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
                {steps.map((step, index) => (
                  <span key={step.key} className="flex items-center gap-2">
                    <span className="text-muted-foreground">/</span>
                    <span
                      className={
                        currentStep === step.key
                          ? "text-foreground"
                          : steps.findIndex((s) => s.key === currentStep) > index
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {step.label}
                    </span>
                  </span>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {currentStep === "information" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-light mb-6">Contact Information</h2>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                    />

                    <h2 className="text-xl font-light pt-6 mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        required
                        className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        required
                        className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      required
                      className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                        className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                      />
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                        required
                        className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="JP">Japan</option>
                      <option value="KR">South Korea</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone (optional)"
                      className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                    />
                  </motion.div>
                )}

                {currentStep === "shipping" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-light mb-6">Shipping Method</h2>
                    <label className="flex items-center justify-between p-4 border border-black/20 cursor-pointer hover:border-black transition-colors">
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === "standard"}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-light">Standard Shipping</p>
                          <p className="text-sm text-muted-foreground font-light">5-7 business days</p>
                        </div>
                      </div>
                      <span className="font-light">Free</span>
                    </label>
                    <label className="flex items-center justify-between p-4 border border-black/20 cursor-pointer hover:border-black transition-colors">
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === "express"}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-light">Express Shipping</p>
                          <p className="text-sm text-muted-foreground font-light">2-3 business days</p>
                        </div>
                      </div>
                      <span className="font-light">$25.00</span>
                    </label>
                  </motion.div>
                )}

                {currentStep === "payment" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-xl font-light">Payment</h2>
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Card Number"
                      required
                      className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Name on Card"
                      required
                      className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                      />
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="CVC"
                        required
                        className="w-full px-4 py-3 border border-black/20 font-light focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </motion.div>
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

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:pl-16 lg:border-l border-black/10"
            >
              <h2 className="text-xl font-light mb-8">Order Summary</h2>
              <div className="space-y-6">
                {state.items.map((item) => (
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
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
