"use client";

import Link from "next/link";

export type CheckoutStep = "information" | "shipping" | "payment";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps: { key: CheckoutStep; label: string }[] = [
  { key: "information", label: "Information" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2 text-sm mb-8">
      <Link href="/collection" className="text-muted-foreground hover:text-foreground transition-colors">
        Cart
      </Link>
      {steps.map((step, index) => (
        <span key={step.key} className="flex items-center gap-2">
          <span className="text-muted-foreground">/</span>
          <span className={currentIndex >= index ? "text-foreground" : "text-muted-foreground"}>{step.label}</span>
        </span>
      ))}
    </div>
  );
}
