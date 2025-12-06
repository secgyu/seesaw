"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Heart, Menu, X, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { motion, AnimatePresence } from "framer-motion";
import { SearchModal } from "./search-modal";
import { createClient } from "@/lib/supabase/client";

export function Navigation() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const { toggleCart, totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ email: user.email || "" });
      } else {
        setUser(null);
      }
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || "" });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
      >
        <nav className="flex items-center justify-between px-8 py-6 lg:px-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -m-2" aria-label="Open menu">
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase">
              SEESAW
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <Link
              href="/collection"
              className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Collection
            </Link>
            <Link
              href="/lookbook"
              className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Lookbook
            </Link>
            <Link
              href="/about"
              className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[11px] font-light tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-2 -m-2" aria-label="Open search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link href="/wishlist" className="relative p-2 -m-2" aria-label="View wishlist">
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[9px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={toggleCart} className="relative p-2 -m-2" aria-label="Open cart">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[9px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link href={user ? "/account" : "/login"} className="p-2 -m-2" aria-label={user ? "My account" : "Login"}>
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background md:hidden"
          >
            <div className="flex items-center justify-between px-8 py-6">
              <Link
                href="/"
                className="text-sm font-light tracking-[0.3em] uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                SEESAW
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -m-2" aria-label="Close menu">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <nav className="px-8 py-12">
              <ul className="space-y-8">
                {[
                  { href: "/collection", label: "Collection" },
                  { href: "/lookbook", label: "Lookbook" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/shipping", label: "Shipping & Returns" },
                  { href: user ? "/account" : "/login", label: user ? "My Account" : "Login" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-extralight tracking-wide"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
