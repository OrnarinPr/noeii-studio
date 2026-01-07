import { projects, type Project } from "@/data/projects";

export async function listProjects(): Promise<Project[]> {
  return projects;
}

export async function getProjectById(id: string): Promise<Project | null> {
  return projects.find((p) => p.id === id) ?? null;
}
