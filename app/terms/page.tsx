import type { Metadata } from "next";

import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "이용약관",
  description: "SEESAW 서비스 이용약관. 주문, 결제, 배송 및 반품에 관한 정책을 확인하세요.",
  openGraph: {
    title: "이용약관 | SEESAW",
    description: "SEESAW 서비스 이용약관",
  },
};

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <CartSidebar />
      <main className="pt-24">
        <div className="px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-extralight tracking-tight mb-4">
              Terms & Conditions
            </h1>
            <p className="text-sm font-light text-muted-foreground mb-16">
              Last updated: January 2025
            </p>
            <div className="space-y-12">
              <section>
                <h2 className="text-lg font-light mb-4">1. Agreement to Terms</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    By accessing or using the SEESAW website, you agree to be bound by these Terms
                    and Conditions and our Privacy Policy. If you do not agree with any part of
                    these terms, you may not access the website.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">2. Products and Pricing</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    All products are subject to availability. We reserve the right to discontinue
                    any product at any time. Prices are subject to change without notice. We make
                    every effort to display accurate pricing, but errors may occur.
                  </p>
                  <p>
                    In the event of a pricing error, we reserve the right to cancel any orders
                    placed at the incorrect price and will provide a full refund.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">3. Orders and Payment</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    By placing an order, you warrant that you are legally capable of entering into
                    binding contracts and that the information you provide is accurate and complete.
                    We reserve the right to refuse or cancel any order for any reason.
                  </p>
                  <p>
                    Payment is required at the time of order placement. We accept major credit
                    cards, PayPal, and other payment methods as displayed at checkout.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">4. Shipping and Delivery</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    Shipping times are estimates and not guaranteed. SEESAW is not responsible for
                    delays caused by shipping carriers or customs processing for international
                    orders. Risk of loss passes to you upon delivery to the carrier.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">5. Returns and Refunds</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    Returns are accepted within 30 days of delivery. Items must be unworn, unwashed,
                    and in original packaging with all tags attached. Final sale items are not
                    eligible for return. Please refer to our Shipping & Returns page for detailed
                    instructions.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">6. Intellectual Property</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    All content on this website, including text, graphics, logos, images, and
                    software, is the property of SEESAW or its content suppliers and is protected by
                    international copyright laws. Unauthorized use may violate copyright, trademark,
                    and other laws.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">7. Limitation of Liability</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    SEESAW shall not be liable for any indirect, incidental, special, consequential,
                    or punitive damages arising out of your access to or use of the website or
                    products purchased through the website.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">8. Governing Law</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of
                    the State of New York, without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-lg font-light mb-4">9. Contact Information</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>For questions about these Terms, please contact us at:</p>
                  <p>
                    Email: legal@seesaw.com
                    <br />
                    Address: 123 Fashion Street, New York, NY 10001
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
