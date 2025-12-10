"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowRight, Check, Instagram, Loader2, Twitter } from "lucide-react";

import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { BRAND, FOOTER_LINKS } from "@/lib/constants";

const linkStyle =
  "text-sm font-light text-muted-foreground hover:text-foreground transition-colors";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    const result = await subscribeNewsletter(email);

    setIsLoading(false);
    setMessage(result.message);

    if (result.success) {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
    }
  };

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Shop</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">About</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Help</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Legal</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
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
            <p className="text-sm font-light text-muted-foreground mb-4">
              Subscribe for updates on new collections.
            </p>
            <form onSubmit={handleSubmit} className="flex border-b border-black/20">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 py-3 text-sm font-light bg-transparent outline-none placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-3 disabled:opacity-50"
                aria-label="Subscribe"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "success" ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
            {status !== "idle" && (
              <p
                className={`mt-2 text-xs ${status === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-black/5">
          <p className="text-xs font-light text-muted-foreground">{BRAND.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
