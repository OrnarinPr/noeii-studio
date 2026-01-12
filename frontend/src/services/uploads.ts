import { apiUrl, authHeaders } from "@/services/api";

export async function uploadImage(file: File, token: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(apiUrl("/api/uploads"), {
    method: "POST",
    headers: {
      ...authHeaders(token),
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${text || res.statusText}`);
  }

  const data = (await res.json()) as { url?: string; error?: string };
  if (data.error) throw new Error(data.error);
  if (!data.url) throw new Error("Upload failed: missing url");
  return data.url;
}
