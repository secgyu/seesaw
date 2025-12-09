import { FRAGRANCE_SIZES } from "@/lib/constants";

import type { Product } from "./types";

export const fragranceProducts: Product[] = [
  {
    id: "27",
    name: "Éternel",
    price: 320,
    category: "fragrance",
    colors: ["Eau de Parfum"],
    sizes: FRAGRANCE_SIZES,
    images: [
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922225/%C3%89ternel_ancqd8.png",
    ],
    description:
      "A timeless signature scent. Warm amber and sandalwood base with delicate floral heart notes, crowned by fresh bergamot and pink pepper.",
    details: "Eau de Parfum. Long-lasting 8-12 hours. Made in France.",
    materials: "Top: Bergamot, Pink Pepper / Heart: Rose, Jasmine / Base: Sandalwood, Amber, Musk",
  },
  {
    id: "28",
    name: "Lumière",
    price: 280,
    category: "fragrance",
    colors: ["Eau de Parfum"],
    sizes: FRAGRANCE_SIZES,
    images: [
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922225/Lumi%C3%A8re_vzeyq2.png",
    ],
    description:
      "Radiant and luminous. A fresh, uplifting blend that captures the essence of golden morning light.",
    details: "Eau de Parfum. Moderate lasting 6-8 hours. Made in France.",
    materials: "Top: Citrus, Neroli / Heart: White Tea, Peony / Base: White Musk, Cedar",
  },
  {
    id: "29",
    name: "Nuit",
    price: 350,
    category: "fragrance",
    colors: ["Eau de Parfum Intense"],
    sizes: FRAGRANCE_SIZES,
    images: ["https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922225/Nuit_hn9c07.png"],
    description:
      "Mysterious and sensual. An intense oriental fragrance for unforgettable evenings.",
    details: "Eau de Parfum Intense. Long-lasting 10-14 hours. Made in France.",
    materials:
      "Top: Black Currant, Saffron / Heart: Bulgarian Rose, Oud / Base: Vanilla, Amber, Benzoin",
  },
  {
    id: "30",
    name: "Pétale",
    price: 290,
    category: "fragrance",
    colors: ["Eau de Parfum"],
    sizes: FRAGRANCE_SIZES,
    images: [
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922226/P%C3%A9tale_ydd6pc.png",
    ],
    description:
      "Romantic and feminine. A delicate floral bouquet that blooms on the skin like fresh petals.",
    details: "Eau de Parfum. Moderate lasting 6-8 hours. Made in France.",
    materials:
      "Top: Pear, Pink Pepper / Heart: Peony, Rose, Magnolia / Base: White Musk, Cashmere Wood",
  },
  {
    id: "31",
    name: "Brise",
    price: 180,
    category: "fragrance",
    colors: ["Eau de Toilette"],
    sizes: FRAGRANCE_SIZES,
    images: ["https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922225/Brise_kij0nj.png"],
    description:
      "Light and airy. A refreshing breeze of clean, crisp notes perfect for everyday elegance.",
    details: "Eau de Toilette. Light lasting 4-6 hours. Made in France.",
    materials:
      "Top: Green Apple, Lemon / Heart: Lily of the Valley, Freesia / Base: White Cedar, Musk",
  },
  {
    id: "32",
    name: "Soleil",
    price: 300,
    category: "fragrance",
    colors: ["Eau de Parfum"],
    sizes: FRAGRANCE_SIZES,
    images: ["https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922225/Soleil_vpuu7m.png"],
    description:
      "Warm and radiant. Captures the golden warmth of sunlight with honeyed florals and rich amber.",
    details: "Eau de Parfum. Long-lasting 8-12 hours. Made in France.",
    materials:
      "Top: Orange Blossom, Mandarin / Heart: Tuberose, Ylang-Ylang / Base: Honey, Amber, Vanilla",
  },
  {
    id: "33",
    name: "Équilibre",
    price: 340,
    category: "fragrance",
    colors: ["Eau de Parfum"],
    sizes: FRAGRANCE_SIZES,
    images: [
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764922226/%C3%89quilibre_xqhsbm.png",
    ],
    description:
      "Perfect balance. The signature SEESAW fragrance harmonizing contrasting notes into one seamless composition.",
    details: "Eau de Parfum. Long-lasting 8-12 hours. Made in France.",
    materials:
      "Top: Bergamot, Grapefruit / Heart: Iris, Violet Leaf / Base: Vetiver, Sandalwood, Musk",
  },
];
