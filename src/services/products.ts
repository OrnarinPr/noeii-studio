import { products as seedProducts, type Product } from "@/data/products";

const STORAGE_KEY = "noeii_products_v1";

function readStore(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

function writeStore(items: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function listProducts(): Promise<Product[]> {
  const stored = readStore();
  if (stored) return stored;

  writeStore(seedProducts);
  return seedProducts;
}

export async function upsertProduct(input: Product): Promise<Product[]> {
  const current = (await listProducts()).slice();
  const idx = current.findIndex((p) => p.id === input.id);

  if (idx >= 0) current[idx] = input;
  else current.unshift(input);

  writeStore(current);
  return current;
}

export async function deleteProduct(id: string): Promise<Product[]> {
  const current = (await listProducts()).filter((p) => p.id !== id);
  writeStore(current);
  return current;
}

export function createNewProductId(): string {
  return String(Date.now());
}
