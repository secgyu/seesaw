"use client";

import { motion } from "framer-motion";
import { ScrollIndicator } from "@/components/scroll-indicator";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-[#1a1a1a]" />
        <div className="w-1/2 bg-[#f5f5f5]" />
      </div>
      <div className="relative h-full flex">
        <div className="w-1/2 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-3/4 h-3/4 bg-[#2a2a2a] flex items-center justify-center"
          >
            <span className="text-white/10 text-9xl font-extralight">●</span>
          </motion.div>
        </div>
        <div className="w-1/2 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-3/4 h-3/4 bg-[#e8e8e8] flex items-center justify-center"
          >
            <span className="text-black/10 text-9xl font-extralight">○</span>
          </motion.div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] uppercase"
          >
            <span className="text-white">SEE</span>
            <span className="text-[#1a1a1a]">SAW</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6 text-[11px] font-light tracking-[0.4em] uppercase text-muted-foreground"
          >
            Balance in Duality
          </motion.p>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
}
