import { accessoriesProducts } from "./accessories";
import { bottomsProducts } from "./bottoms";
import { fragranceProducts } from "./fragrance";
import { outerwearProducts } from "./outerwear";
import { topsProducts } from "./tops";
import type { BaseProduct, Product } from "./types";
import { generateSlug } from "./types";

export type { Product, BaseProduct, ModelInfo, ProductCategory } from "./types";

const rawProducts = [
  ...outerwearProducts,
  ...topsProducts,
  ...bottomsProducts,
  ...accessoriesProducts,
  ...fragranceProducts,
];

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  slug: generateSlug(p.name, p.colors[0] || "default", p.id),
}));

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
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
