"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutProcess() {
  return (
    <section id="process" className="py-24 lg:py-32 px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-light tracking-[0.3em] uppercase mb-16"
        >
          Process
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { query: "fabric selection luxury materials", alt: "Material Selection" },
            { query: "fashion design sketching minimalist", alt: "Design Development" },
            { query: "fashion garment construction tailoring", alt: "Craftsmanship" },
          ].map((item, index) => (
            <motion.div
              key={item.alt}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                <Image
                  src={`/.jpg?height=800&width=640&query=${encodeURIComponent(item.query)}`}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-sm font-light text-muted-foreground">{item.alt}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground"
        >
          From initial concept to final stitch, each SEESAW piece undergoes a rigorous process of refinement. We
          collaborate with skilled artisans who understand that true luxury lies in the details invisible to the eye.
        </motion.p>
      </div>
    </section>
  );
}
