import type { Product } from "@/data/products";
import { apiJson, authHeaders } from "@/services/api";

export function createNewProductId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function listProducts(): Promise<Product[]> {
  return apiJson<Product[]>("/api/products");
}

export async function getProduct(id: string): Promise<Product | null> {
  return apiJson<Product | null>(`/api/products/${id}`);
}

export async function upsertProduct(next: Product, token: string): Promise<Product> {
  const exists = await getProduct(next.id);

  if (exists) {
    return apiJson<Product>(`/api/products/${next.id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(next),
    });
  }

  return apiJson<Product>("/api/products", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(next),
  });
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  await apiJson<{ ok: boolean }>(`/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
