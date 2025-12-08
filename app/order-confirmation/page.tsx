"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { Check, Package, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/cart-context";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderNumber = searchParams.get("order");
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const processOrder = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/order/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          clearCart();
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    hasProcessed.current = true;
    processOrder();
  }, [sessionId, clearCart]);

  if (status === "loading") {
    return (
      <>
        <Navigation />
        <CartSidebar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-sm font-light text-muted-foreground">Processing your order...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Navigation />
        <CartSidebar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-8">
            <h1 className="text-2xl font-light mb-4">Something went wrong</h1>
            <p className="text-sm font-light text-muted-foreground mb-8">
              We couldn&apos;t confirm your order. Please contact support if you were charged.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-sm font-light underline underline-offset-4"
            >
              Return to Shop
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
      <main className="pt-24 min-h-screen">
        <div className="px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-8"
            >
              <Check className="w-10 h-10 stroke-[1.5]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl lg:text-4xl font-extralight tracking-tight mb-4">Thank You for Your Order</h1>
              <p className="text-sm font-light text-muted-foreground mb-8">
                Your order has been confirmed and will be shipped soon.
              </p>

              <div className="bg-secondary/30 p-8 mb-12">
                <p className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Order Number
                </p>
                <p className="text-2xl font-light tracking-wider">{orderNumber || "N/A"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 bg-black/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-light mb-1">Confirmation Email</h3>
                    <p className="text-sm font-light text-muted-foreground">
                      We&apos;ve sent a confirmation email with your order details and tracking information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 bg-black/5 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-light mb-1">Shipping Updates</h3>
                    <p className="text-sm font-light text-muted-foreground">
                      You&apos;ll receive shipping updates via email once your order has been dispatched.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/collection"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-black text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
                >
                  View My Orders
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
