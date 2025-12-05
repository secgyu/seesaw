import { BELT_SIZES, ONE_SIZE } from "../constants"
import type { Product } from "./types"

export const accessoriesProducts: Product[] = [
  {
    id: "18",
    name: "Leather Belt",
    price: 280,
    category: "accessories",
    colors: ["Black", "Tan"],
    sizes: BELT_SIZES,
    images: [
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764831338/Leather_Belt_main_xywynb.png",
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764831335/Leather_Belt_back_h1ycbe.png",
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764831341/Leather_Belt_detail_wchjos.png",
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764831334/Leather_Belt_flat_ek9atx.png",
    ],
    description: "Minimal hardware meets premium leather. Classic elegance in solid color.",
    details: "Italian leather, tonal buckle, 3cm width.",
    materials: "100% Italian Calf Leather.",
  },
  {
    id: "19",
    name: "Cashmere Shawl",
    price: 580,
    category: "accessories",
    colors: ["Cream & Charcoal"],
    sizes: ONE_SIZE,
    images: [
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764830701/Cashmere_Shawl_main_jbdhze.png",
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764830707/Cashmere_Shawl_back_wxhhis.png",
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764830704/Cashmere_Shawl_detail_e6vtzv.png",
      "https://res.cloudinary.com/dz1ldzzf3/image/upload/v1764830699/Cashmere_Shawl_flat_resuub.png",
    ],
    description: "Luxurious oversized shawl for effortless elegance. Half cream, half charcoal split design.",
    details: "Oversized wrap, fringed edges, soft drape. Dry clean only.",
    materials: "100% Mongolian Cashmere.",
  },
]

