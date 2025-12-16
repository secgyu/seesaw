import type { Metadata } from "next";

import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "SEESAW 개인정보처리방침. 고객님의 개인정보를 어떻게 수집, 사용, 보호하는지 안내합니다.",
  openGraph: {
    title: "개인정보처리방침 | SEESAW",
    description: "SEESAW 개인정보처리방침",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <CartSidebar />
      <main className="pt-24">
        <div className="px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-extralight tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm font-light text-muted-foreground mb-16">
              Last updated: January 2025
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-lg font-light mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    We collect information you provide directly to us, including your name, email
                    address, postal address, phone number, and payment information when you make a
                    purchase or create an account.
                  </p>
                  <p>
                    We also automatically collect certain information when you visit our website,
                    including your IP address, browser type, operating system, referring URLs, and
                    information about how you interact with our site.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-light mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process transactions and send related information</li>
                    <li>Send promotional communications (with your consent)</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Analyze trends and improve our website and services</li>
                    <li>Detect, investigate, and prevent fraudulent transactions</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-light mb-4">3. Information Sharing</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third
                    parties except as described in this policy. We may share information with
                    service providers who assist us in operating our website, conducting our
                    business, or serving you.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-light mb-4">4. Data Security</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    We implement appropriate technical and organizational measures to protect your
                    personal information against unauthorized access, alteration, disclosure, or
                    destruction. All payment transactions are encrypted using SSL technology.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-light mb-4">5. Cookies</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    We use cookies and similar tracking technologies to enhance your browsing
                    experience, analyze site traffic, and understand where our audience is coming
                    from. You can control cookies through your browser settings.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-light mb-4">6. Your Rights</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>
                    You have the right to access, correct, or delete your personal information. You
                    may also opt out of receiving promotional communications from us at any time. To
                    exercise these rights, please contact us at privacy@seesaw.com.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-light mb-4">7. Contact Us</h2>
                <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                  <p>
                    Email: privacy@seesaw.com
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
