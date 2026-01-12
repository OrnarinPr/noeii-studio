import type { Project } from "@/data/projects";
import { apiJson, authHeaders } from "@/services/api";

export function createNewProjectId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function listProjects(): Promise<Project[]> {
  return apiJson<Project[]>("/api/projects");
}

export async function getProject(id: string): Promise<Project | null> {
  return apiJson<Project | null>(`/api/projects/${id}`);
}

export async function upsertProject(next: Project, token: string): Promise<Project> {
  const exists = await getProject(next.id);
  if (exists) {
    return apiJson<Project>(`/api/projects/${next.id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(next),
    });
  }

  return apiJson<Project>("/api/projects", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(next),
  });
}

export async function deleteProject(id: string, token: string): Promise<void> {
  await apiJson<{ ok: boolean }>(`/api/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
