"use client";

import Image from "next/image";

import { motion } from "framer-motion";

const processSteps = [
  {
    alt: "Material Selection",
    src: "/images/about/selection.png",
    description: "Sourcing the finest fabrics",
  },
  {
    alt: "Design Development",
    src: "/images/about/design.png",
    description: "Crafting the vision",
  },
  {
    alt: "Craftsmanship",
    src: "/images/about/craft.png",
    description: "Perfecting every detail",
  },
];

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
          {processSteps.map((item, index) => (
            <motion.div
              key={item.alt}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
              <p className="mt-4 text-sm font-light">{item.alt}</p>
              <p className="text-xs font-light text-muted-foreground">{item.description}</p>
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
          From initial concept to final stitch, each SEESAW piece undergoes a rigorous process of
          refinement. We collaborate with skilled artisans who understand that true luxury lies in
          the details invisible to the eye.
        </motion.p>
      </div>
    </section>
  );
}
