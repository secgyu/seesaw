"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const lookbookImages = [
  {
    id: 1,
    src: "/images/lookbook/look1.png",
    alt: "Editorial look 1",
    title: "Structured Elegance",
    products: ["Oversized Wool Coat", "Wide Leg Trousers"],
  },
  {
    id: 2,
    src: "/images/lookbook/look2.png",
    alt: "Editorial look 2",
    title: "Pure Simplicity",
    products: ["Silk Blouse", "Tailored Slim Trousers"],
  },
  {
    id: 3,
    src: "/images/lookbook/look3.png",
    alt: "Editorial look 3",
    title: "Timeless Layers",
    products: ["Minimal Trench", "Cashmere Cardigan"],
  },
  {
    id: 4,
    src: "/images/lookbook/look4.png",
    alt: "Editorial look 4",
    title: "Sharp Lines",
    products: ["Structured Blazer", "Pleated Midi Skirt"],
  },
  {
    id: 5,
    src: "/images/lookbook/look5.png",
    alt: "Editorial look 5",
    title: "Quiet Luxury",
    products: ["Collarless Coat", "Merino Turtleneck"],
  },
  {
    id: 6,
    src: "/images/lookbook/look6.png",
    alt: "Editorial look 6",
    title: "Relaxed Form",
    products: ["Oversized Knit Sweater", "Drawstring Trousers"],
  },
];

export default function LookbookPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof lookbookImages)[0] | null>(null);

  return (
    <>
      <Navigation />
      <CartSidebar />
      <main className="pt-24">
        <div className="px-8 lg:px-12 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight mb-6">SS25 Lookbook</h1>
            <p className="text-lg font-light text-muted-foreground leading-relaxed">
              Different is Balance. A study in contrasts where structure meets fluidity, light meets shadow, and
              minimalism becomes maximalist in its restraint.
            </p>
          </motion.div>
        </div>
        <div className="px-8 lg:px-16 xl:px-24 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {lookbookImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">
                      <h3 className="text-base font-light mb-1">{image.title}</h3>
                      <p className="text-xs font-light opacity-80">{image.products.join(" / ")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-black text-white">
          <div className="px-8 lg:px-12 py-16 lg:py-24 text-center">
            <h2 className="text-2xl lg:text-3xl font-extralight tracking-tight mb-6">Shop the Collection</h2>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-[11px] font-light tracking-[0.2em] uppercase border-b border-white pb-1 hover:opacity-70 transition-opacity"
            >
              View All Pieces
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
            <Image
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-lg font-light mb-2">{selectedImage.title}</h3>
            <p className="text-sm font-light opacity-70">{selectedImage.products.join(" / ")}</p>
          </div>
        </motion.div>
      )}

      <Footer />
    </>
  );
}
