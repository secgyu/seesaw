"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("seesaw-newsletter-popup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("seesaw-newsletter-popup", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className="hidden md:block h-full min-h-[400px] bg-cover bg-center"
                style={{
                  backgroundImage: "url('/minimalist-fashion-black-white-editorial.jpg')",
                }}
              />
              <div className="p-8 lg:p-10">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 -m-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
                {!submitted ? (
                  <>
                    <h2 className="text-2xl font-extralight tracking-tight mb-3">
                      Join the Balance
                    </h2>
                    <p className="text-sm font-light text-muted-foreground mb-6 leading-relaxed">
                      Subscribe to receive exclusive access to new collections, private events, and
                      10% off your first order.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-0 py-3 text-sm font-light bg-transparent border-b border-black/20 outline-none focus:border-black transition-colors placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
                      >
                        Subscribe
                      </button>
                    </form>
                    <p className="mt-4 text-xs font-light text-muted-foreground">
                      By subscribing, you agree to our Privacy Policy and consent to receive
                      updates.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-extralight tracking-tight mb-3">Welcome</h2>
                    <p className="text-sm font-light text-muted-foreground">
                      Thank you for joining. Check your inbox for your welcome offer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
