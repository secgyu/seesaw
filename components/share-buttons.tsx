"use client";

import { Share2, Twitter, Facebook, LinkIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        <Share2 className="w-4 h-4 stroke-[1.5]" />
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-white border border-black/10 shadow-lg p-2 min-w-[150px]"
          >
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-sm font-light hover:bg-secondary/50 transition-colors"
              >
                <link.icon className="w-4 h-4 stroke-[1.5]" />
                {link.name}
              </a>
            ))}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-3 py-2 text-sm font-light hover:bg-secondary/50 transition-colors w-full text-left"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[1.5]" />
                  Copied!
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 stroke-[1.5]" />
                  Copy Link
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
