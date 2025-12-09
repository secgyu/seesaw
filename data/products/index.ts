import { accessoriesProducts } from "./accessories";
import { bottomsProducts } from "./bottoms";
import { fragranceProducts } from "./fragrance";
import { outerwearProducts } from "./outerwear";
import { topsProducts } from "./tops";
import type { Product } from "./types";

export type { Product, ModelInfo, ProductCategory } from "./types";

export const products: Product[] = [
  ...outerwearProducts,
  ...topsProducts,
  ...bottomsProducts,
  ...accessoriesProducts,
  ...fragranceProducts,
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getLatestProducts(): Product[] {
  return products.slice(-4).reverse();
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 4);
}

export { outerwearProducts, topsProducts, bottomsProducts, accessoriesProducts, fragranceProducts };
