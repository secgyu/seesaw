"use client";

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="pt-40 pb-24 lg:pt-48 lg:pb-32 px-8 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed"
        >
          We believe in the power of balance.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mt-4 text-muted-foreground"
        >
          Every design tells a story of duality.
        </motion.p>
      </div>
    </section>
  );
}
