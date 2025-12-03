"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
            className="relative w-3/4 h-3/4"
          >
            <Image
              src="/images/hero/main_black.png"
              alt="SEESAW Collection - Dark"
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>
        </div>
        <div className="w-1/2 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-3/4 h-3/4"
          >
            <Image
              src="/images/hero/main_white.png"
              alt="SEESAW Collection - Light"
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative h-16 md:h-20 lg:h-24 w-[300px] md:w-[400px] lg:w-[500px]"
          >
            <div className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
              <Image src="/logo-white.svg" alt="SEESAW" fill className="object-contain" priority />
            </div>
            <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
              <Image src="/logo.svg" alt="SEESAW" fill className="object-contain" priority />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6 text-[11px] font-light tracking-[0.4em] uppercase text-muted-foreground"
          >
            Different is Balance
          </motion.p>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
}
