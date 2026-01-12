import type { Project } from "@/data/projects";
import { DEFAULT_PROJECTS } from "@/data/projects";

const KEY = "noeii_projects_v1";

function read(): Project[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_PROJECTS;
  try {
    const data = JSON.parse(raw) as Project[];
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_PROJECTS;
    return data;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

function write(projects: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export async function listProjects(): Promise<Project[]> {
  return read();
}

export function createNewProjectId(): string {
  return `${Date.now()}`;
}

export async function upsertProject(project: Project): Promise<void> {
  const projects = read();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.unshift(project);
  write(projects);
}

export async function deleteProject(id: string): Promise<void> {
  const projects = read().filter((p) => p.id !== id);
  write(projects);
}
