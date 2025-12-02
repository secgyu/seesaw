"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/collection"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/collection?category=outerwear"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Outerwear
                </Link>
              </li>
              <li>
                <Link
                  href="/collection?category=tops"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link
                  href="/collection?category=bottoms"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bottoms
                </Link>
              </li>
              <li>
                <Link
                  href="/lookbook"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Lookbook
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">About</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/about#philosophy"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Philosophy
                </Link>
              </li>
              <li>
                <Link
                  href="/about#process"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Process
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Help</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li className="flex gap-4 pt-4">
                <a
                  href="https://instagram.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 stroke-[1.5]" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Newsletter</h3>
            <p className="text-sm font-light text-muted-foreground mb-4">Subscribe for updates on new collections.</p>
            <form onSubmit={handleSubmit} className="flex border-b border-black/20">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 py-3 text-sm font-light bg-transparent outline-none placeholder:text-muted-foreground"
                required
              />
              <button type="submit" className="p-3" aria-label="Subscribe">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-black/5">
          <p className="text-xs font-light text-muted-foreground">© 2025 SEESAW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
