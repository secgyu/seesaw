import { createClient } from "@/lib/supabase/server";

import type { DBProduct, Product } from "./products";
import { transformProduct } from "./products";

export async function getProductsServer(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as DBProduct[]).map(transformProduct);
}

export async function getProductByIdServer(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return transformProduct(data as DBProduct);
}

export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return transformProduct(data as DBProduct);
}

export async function getAllSlugsServer(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("slug").eq("is_active", true);

  if (error || !data) return [];
  return data.map((p) => p.slug);
}
