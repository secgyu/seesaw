import { Navigation } from "@/components/navigation";
import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact | SEESAW",
  description: "Get in touch with SEESAW. We welcome inquiries about our collection, stockists, and press.",
};

export default function ContactPage() {
  return (
    <main>
      <Navigation />
      <CartSidebar />

      <section className="pt-40 pb-24 lg:pt-48 lg:pb-32 px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-light tracking-[0.1em] uppercase mb-8">Contact</h1>
          <p className="text-lg font-light text-muted-foreground mb-16">
            We welcome your inquiries. Please reach out for questions about our collection, stockist information, or
            press requests.
          </p>

          <ContactForm />

          <div className="mt-24 pt-12 border-t border-black/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-4">General Inquiries</h3>
                <a
                  href="mailto:hello@seesaw.com"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@seesaw.com
                </a>
              </div>
              <div>
                <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-4">Press</h3>
                <a
                  href="mailto:press@seesaw.com"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  press@seesaw.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
