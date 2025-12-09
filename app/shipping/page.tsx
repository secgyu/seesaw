import { Clock, Globe, Package, RotateCcw, Shield, Truck } from "lucide-react";

import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export const metadata = {
  title: "Shipping & Returns | SEESAW",
  description: "Learn about our shipping methods, delivery times, and return policy.",
};

export default function ShippingPage() {
  return (
    <main>
      <Navigation />
      <CartSidebar />
      <section className="pt-32 pb-16 px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Shipping & Returns
          </h1>
          <p className="text-lg font-light text-muted-foreground leading-relaxed">
            We believe in providing exceptional service from the moment you place your order until
            the moment you wear your piece.
          </p>
        </div>
      </section>
      <section className="py-16 px-8 lg:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-black">
                <Truck className="w-7 h-7 stroke-[1]" />
              </div>
              <h3 className="text-sm font-light tracking-[0.1em] uppercase mb-3">Free Shipping</h3>
              <p className="text-sm font-light text-muted-foreground">
                Complimentary shipping on all orders over $500
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-black">
                <RotateCcw className="w-7 h-7 stroke-[1]" />
              </div>
              <h3 className="text-sm font-light tracking-[0.1em] uppercase mb-3">Easy Returns</h3>
              <p className="text-sm font-light text-muted-foreground">
                30-day return policy for unworn items
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-black">
                <Package className="w-7 h-7 stroke-[1]" />
              </div>
              <h3 className="text-sm font-light tracking-[0.1em] uppercase mb-3">
                Luxury Packaging
              </h3>
              <p className="text-sm font-light text-muted-foreground">
                Each piece arrives in our signature packaging
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-8 lg:px-12 bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light mb-12 text-center">Shipping Information</h2>
          <div className="space-y-8">
            <div className="bg-background p-8">
              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 stroke-[1.5] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium tracking-wide uppercase mb-3">
                    Domestic Shipping (Korea)
                  </h3>
                  <div className="space-y-2 text-sm font-light text-muted-foreground">
                    <p>Standard Delivery: 2-3 business days — Free for orders over ₩500,000</p>
                    <p>Express Delivery: 1-2 business days — ₩15,000</p>
                    <p>
                      Same-Day Delivery (Seoul only): Available for orders placed before 12 PM —
                      ₩25,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background p-8">
              <div className="flex items-start gap-4">
                <Truck className="w-5 h-5 stroke-[1.5] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium tracking-wide uppercase mb-3">
                    International Shipping
                  </h3>
                  <div className="space-y-2 text-sm font-light text-muted-foreground">
                    <p>Asia Pacific: 3-5 business days — $30 (Free over $500)</p>
                    <p>United States & Canada: 5-7 business days — $50 (Free over $700)</p>
                    <p>Europe: 5-7 business days — $50 (Free over $700)</p>
                    <p>Rest of World: 7-14 business days — $70 (Free over $1,000)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background p-8">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 stroke-[1.5] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium tracking-wide uppercase mb-3">
                    Processing Time
                  </h3>
                  <div className="space-y-2 text-sm font-light text-muted-foreground">
                    <p>
                      Orders are processed within 1-2 business days. You will receive a confirmation
                      email with tracking information once your order has shipped.
                    </p>
                    <p>
                      Please note that orders placed on weekends or holidays will be processed on
                      the next business day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light mb-12 text-center">Returns & Exchanges</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-medium tracking-wide uppercase mb-4">Return Policy</h3>
              <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                <p>
                  We want you to love your SEESAW pieces. If you&apos;re not completely satisfied,
                  you may return unworn items within 30 days of delivery for a full refund.
                </p>
                <p>
                  Items must be in their original condition with all tags attached and in original
                  packaging. Sale items and personalized pieces are final sale.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-wide uppercase mb-4">How to Return</h3>
              <ol className="space-y-3 text-sm font-light text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-medium text-foreground">1.</span>
                  Contact our customer service to initiate a return
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-foreground">2.</span>
                  Receive your prepaid shipping label via email
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-foreground">3.</span>
                  Pack items securely in original packaging
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-foreground">4.</span>
                  Drop off at your nearest shipping location
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-foreground">5.</span>
                  Refund processed within 5-7 business days
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-8 lg:px-12 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 stroke-[1] mx-auto mb-6" />
          <h2 className="text-2xl font-light mb-4">Size Exchange Guarantee</h2>
          <p className="text-sm font-light text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Not sure about your size? We offer complimentary exchanges for a different size within
            14 days of delivery. Simply contact us and we&apos;ll arrange the exchange at no
            additional cost.
          </p>
          <a
            href="/contact"
            className="inline-block border border-white px-8 py-3 text-[11px] font-light tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
      <section className="py-16 px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I track my order?",
                a: "Yes, once your order ships, you will receive an email with tracking information. You can also track your order by logging into your account.",
              },
              {
                q: "Do you ship to P.O. boxes?",
                a: "For security purposes, we do not ship to P.O. boxes. Please provide a physical address for delivery.",
              },
              {
                q: "What if my item arrives damaged?",
                a: "If your item arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund.",
              },
              {
                q: "Can I change my shipping address after ordering?",
                a: "If your order hasn't shipped yet, please contact us immediately and we will do our best to update the shipping address.",
              },
              {
                q: "Are duties and taxes included?",
                a: "For international orders, duties and taxes are not included in the purchase price and are the responsibility of the customer. These charges will be collected upon delivery.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="text-sm font-medium mb-2">{faq.q}</h3>
                <p className="text-sm font-light text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
