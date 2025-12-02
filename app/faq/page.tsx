"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqCategories = [
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. International orders may take 7-14 business days depending on the destination.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination. Import duties and taxes may apply and are the responsibility of the customer.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive an email with a tracking number. You can use this number on our shipping partner's website to track your package in real-time.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter processing and cannot be changed. Please contact us immediately if you need assistance.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Final sale items are not eligible for return.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Contact our customer service team at returns@seesaw.com with your order number. We'll provide a prepaid return label and instructions for sending back your items.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed within 5-7 business days of receiving your return. The amount will be credited to your original payment method. Please allow additional time for your bank to process the refund.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer:
          "Yes, we offer free exchanges for different sizes within 30 days. If the desired size is out of stock, we'll process a refund and you can place a new order when the item becomes available.",
      },
    ],
  },
  {
    title: "Products & Care",
    items: [
      {
        question: "How should I care for my SEESAW pieces?",
        answer:
          "Each garment includes specific care instructions on the label. Generally, we recommend dry cleaning for wool and silk items, and cold water washing for cotton pieces. Always store knits folded, not hung.",
      },
      {
        question: "Are your materials ethically sourced?",
        answer:
          "Yes, we work exclusively with certified suppliers who meet our strict ethical and environmental standards. Our wool is mulesing-free, and our silk comes from sustainable sericulture farms.",
      },
      {
        question: "Do your items run true to size?",
        answer:
          "Our pieces are designed with a modern, slightly relaxed fit. We recommend consulting our detailed size guide for each item. If you're between sizes, we generally suggest sizing down for a more tailored look.",
      },
      {
        question: "Are your products made to order?",
        answer:
          "Most items are ready to ship, but select limited edition pieces may be made to order with a 2-3 week production time. This will be clearly indicated on the product page.",
      },
    ],
  },
  {
    title: "Account & Payment",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.",
      },
      {
        question: "Do you offer payment plans?",
        answer:
          "Yes, we partner with Klarna and Afterpay to offer interest-free installment plans. You can split your purchase into 4 equal payments at checkout.",
      },
      {
        question: "Is it safe to shop on your website?",
        answer:
          "Absolutely. Our website uses industry-standard SSL encryption to protect your personal and payment information. We never store your full credit card details on our servers.",
      },
      {
        question: "How do I create an account?",
        answer:
          "You can create an account during checkout or by clicking the account icon in the navigation. Having an account allows you to track orders, save your wishlist, and enjoy faster checkout.",
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-black/10">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left">
        <span className="text-sm font-light pr-8">{item.question}</span>
        <ChevronDown
          className={`w-4 h-4 stroke-[1.5] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm font-light text-muted-foreground leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Navigation />
      <CartSidebar />
      <main className="pt-24">
        <div className="px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-extralight tracking-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-sm font-light text-muted-foreground mb-16">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>

            {faqCategories.map((category, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">{category.title}</h2>
                <div>
                  {category.items.map((item, itemIndex) => (
                    <FAQAccordion key={itemIndex} item={item} />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-16 p-8 bg-secondary/30">
              <h3 className="text-lg font-light mb-2">Still have questions?</h3>
              <p className="text-sm font-light text-muted-foreground mb-4">
                Our customer service team is here to help.
              </p>
              <a
                href="mailto:hello@seesaw.com"
                className="inline-block text-[11px] font-light tracking-[0.2em] uppercase border-b border-black pb-1"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
