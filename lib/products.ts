import { createClient } from "@/lib/supabase/client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: "outerwear" | "tops" | "bottoms" | "accessories" | "fragrance";
  colors: string[];
  sizes: string[];
  images: string[];
  description: string | null;
  details: string | null;
  materials: string | null;
  modelInfo?: {
    height: string;
    size: string;
  };
  is_active: boolean;
}

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: "outerwear" | "tops" | "bottoms" | "accessories" | "fragrance";
  colors: string[];
  sizes: string[];
  images: string[];
  description: string | null;
  details: string | null;
  materials: string | null;
  model_height: string | null;
  model_size: string | null;
  is_active: boolean;
}

export function transformProduct(dbProduct: DBProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    price: dbProduct.price,
    category: dbProduct.category,
    colors: dbProduct.colors,
    sizes: dbProduct.sizes,
    images: dbProduct.images,
    description: dbProduct.description,
    details: dbProduct.details,
    materials: dbProduct.materials,
    modelInfo:
      dbProduct.model_height && dbProduct.model_size
        ? { height: dbProduct.model_height, size: dbProduct.model_size }
        : undefined,
    is_active: dbProduct.is_active,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(transformProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return transformProduct(data);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return transformProduct(data);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createClient();

  let query = supabase.from("products").select("*").eq("is_active", true);

  if (category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(transformProduct);
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .limit(10);

  if (error || !data) return [];
  return data.map(transformProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(4);

  if (error || !data) return [];
  return data.map(transformProduct);
}

export interface InventoryItem {
  product_id: string;
  size: string;
  stock: number;
}

export async function getProductInventory(productId: string): Promise<InventoryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("product_id, size, stock")
    .eq("product_id", productId);

  if (error || !data) return [];
  return data;
}

export async function checkStock(productId: string, size: string): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("stock")
    .eq("product_id", productId)
    .eq("size", size)
    .single();

  if (error || !data) return 0;
  return data.stock;
}
