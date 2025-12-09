export interface ModelInfo {
  height: string;
  size: string;
}

export type ProductCategory = "outerwear" | "tops" | "bottoms" | "accessories" | "fragrance";

export interface Product {
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
