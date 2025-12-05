"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutStory() {
  return (
    <section className="py-24 lg:py-32 px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-light tracking-[0.3em] uppercase mb-16"
        >
          Our Story
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <p className="text-lg lg:text-xl font-light leading-relaxed">
              SEESAW was born from a singular vision: to create garments that embody the delicate equilibrium between
              opposing forces. Light and dark. Structure and fluidity. Tradition and innovation.
            </p>
            <p className="text-lg lg:text-xl font-light leading-relaxed text-muted-foreground">
              Each piece in our collection represents a meditation on balance—the careful interplay of elements that
              defines not just our aesthetic, but our approach to luxury fashion itself.
            </p>
            <p className="text-lg lg:text-xl font-light leading-relaxed text-muted-foreground">
              We work with the finest materials, sourced from artisans who share our commitment to excellence. Every
              stitch, every seam, every silhouette is considered with intention and care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image src="/images/about/story.png" alt="SEESAW Atelier" fill className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
