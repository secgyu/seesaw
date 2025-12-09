export interface ModelInfo {
  height: string;
  size: string;
}

export type ProductCategory = "outerwear" | "tops" | "bottoms" | "accessories" | "fragrance";

export interface BaseProduct {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  colors: string[];
  sizes: readonly string[];
  images: string[];
  description: string;
  details: string;
  materials: string;
  modelInfo?: ModelInfo;
}

export interface Product extends BaseProduct {
  slug: string;
}

export function generateSlug(name: string, color: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const colorSlug = color
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

  return `${nameSlug}-${colorSlug}-${id}`;
}
