"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-[4/5] bg-muted overflow-hidden transition-opacity ${
                selectedIndex === index
                  ? "opacity-100 ring-1 ring-black"
                  : "opacity-50 hover:opacity-75"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <div className="flex-1">
          <div
            ref={imageContainerRef}
            className="relative aspect-[3/4] bg-muted overflow-hidden cursor-zoom-in group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[selectedIndex] || "/placeholder.svg"}
                  alt={`${name} view ${selectedIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-300"
                  style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transform: isZoomed ? "scale(1.5)" : "scale(1)",
                  }}
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 right-4 p-2 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 stroke-[1.5]" />
            </div>
          </div>
          <div className="flex md:hidden gap-2 mt-4 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-16 h-20 bg-muted overflow-hidden flex-shrink-0 transition-opacity ${
                  selectedIndex === index ? "opacity-100 ring-1 ring-black" : "opacity-50"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 text-white z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={`relative w-12 h-16 overflow-hidden transition-opacity ${
                    selectedIndex === index
                      ? "opacity-100 ring-1 ring-white"
                      : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative max-w-4xl max-h-[80vh] w-full h-full mx-8">
              <Image
                src={images[selectedIndex] || "/placeholder.svg"}
                alt={`${name} view ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
