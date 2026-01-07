import { products, type Product } from "@/data/products";

export async function listProducts(): Promise<Product[]> {
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}
