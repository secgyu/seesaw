"use client";

import { motion } from "framer-motion";

export function AboutPhilosophy() {
  return (
    <section id="philosophy" className="py-24 lg:py-32 bg-[#1a1a1a] text-white">
      <div className="px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] font-light tracking-[0.3em] uppercase mb-16 text-white/60"
          >
            Philosophy
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <p className="text-lg lg:text-xl font-light leading-relaxed text-white/80">
                Balance is not merely a concept we embrace—it is the foundation upon which every decision is made. From
                the asymmetric cut of a sleeve to the contrast of textures within a single garment, duality informs our
                creative process at every stage.
              </p>
              <p className="text-lg lg:text-xl font-light leading-relaxed text-white/60">
                We reject the notion that minimalism means absence. Instead, we believe in purposeful restraint—each
                element earning its place through contribution to the whole. What remains is essential, intentional,
                pure.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <blockquote className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-[0.1em] leading-tight">
                BALANCE
                <br />
                <span className="text-white/40">IN</span>
                <br />
                DUALITY
              </blockquote>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
