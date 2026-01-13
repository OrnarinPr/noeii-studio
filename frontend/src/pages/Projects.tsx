import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import AdminBar from "@/components/AdminBar";

import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAdmin } from "@/context/AdminContext";
import type { Project, ProjectCategory } from "@/data/projects";
import {
  createNewProjectId,
  deleteProject,
  listProjects,
  upsertProject,
} from "@/services/projects";
import { toast } from "@/components/ui/use-toast";
import { uploadImage } from "@/services/uploads";

type CategoryFilter = "All" | ProjectCategory;

const CATEGORIES: CategoryFilter[] = [
  "All",
  "Residence",
  "Villa",
  "Hotel",
  "Gallery",
  "Office",
  "Cultural",
  "Commercial",
  "Public",
];

function isAllowedImage(file: File) {
  const okType = ["image/png", "image/jpeg", "image/webp"].includes(file.type);
  const okSize = file.size <= 3 * 1024 * 1024; // 3MB
  return { okType, okSize };
}

// ✅ Ensure image URL is usable by FE (absolute when BE returns /uploads/..)
function toAbsoluteUrl(urlOrPath: string) {
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  if (!urlOrPath) return "";
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  if (urlOrPath.startsWith("/")) return `${API_BASE}${urlOrPath}`;
  return `${API_BASE}/${urlOrPath}`;
}

const Projects = () => {
  const queryClient = useQueryClient();
  const { isAdmin, editMode, token } = useAdmin();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const openCreate = () => {
    const next: Project = {
      id: createNewProjectId(),
      image: projects[0]?.image ?? "",
      title: "",
      subtitle: "",
      location: "",
      year: "",
      category: "Residence",
      material: "",
      description: "",
      details: ["", "", ""],
      area: "",
      status: "Completed",
      tags: [],
    };
    setDraft(next);
    setEditorOpen(true);
  };

  const openEdit = (p: Project) => {
    setDraft({ ...p, details: Array.isArray(p.details) ? p.details : [] });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setDraft(null);
  };

  const onUpload = async (file: File) => {
    if (!isAdmin || !editMode || !token) {
      toast({
        title: "Admin required",
        description: "Please login as admin to upload.",
        variant: "destructive",
      });
      return;
    }

    const { okType, okSize } = isAllowedImage(file);

    if (!okType) {
      toast({
        title: "Unsupported file type",
        description: "Please upload PNG, JPG, or WEBP.",
        variant: "destructive",
      });
      return;
    }

    if (!okSize) {
      toast({
        title: "File too large",
        description: "Please use an image <= 3MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // BE might return "/uploads/xxx.jpg" or full URL
      const raw = await uploadImage(file, token);
      const url = toAbsoluteUrl(String(raw || ""));

      // ✅ avoid stale draft state (functional setState)
      setDraft((prev) => (prev ? { ...prev, image: url } : prev));

      toast({ title: "Uploaded", description: "Image uploaded to server." });
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!draft) return;

    if (!isAdmin || !editMode || !token) {
      toast({
        title: "Admin required",
        description: "Please login as admin to save changes.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter project title.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.image.trim()) {
      toast({
        title: "Missing image",
        description: "Please upload an image or paste an image URL.",
        variant: "destructive",
      });
      return;
    }

    const cleaned: Project = {
      ...draft,
      image: toAbsoluteUrl(draft.image), // ✅ normalize before save too
      details: (draft.details || []).map((d) => d.trim()).filter(Boolean),
      tags: (draft.tags || []).map((t) => t.trim()).filter(Boolean),
    };

    try {
      await upsertProject(cleaned, token);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast({ title: "Saved", description: "Project updated." });
      closeEditor();
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string) => {
    if (!isAdmin || !editMode || !token) {
      toast({
        title: "Admin required",
        description: "Please login as admin to delete.",
        variant: "destructive",
      });
      return;
    }

    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    try {
      await deleteProject(id, token);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast({ title: "Deleted", description: "Project removed." });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AdminBar />

      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <h1 className="text-display mb-6 opacity-0 animate-fade-up">
                Works
              </h1>
            </div>

            <div className="lg:col-span-5">
              <p className="text-body-large opacity-0 animate-fade-up stagger-1 max-w-md lg:ml-auto">
                A selection of architectural works spanning residential,
                commercial, and cultural spaces.
              </p>

              {isAdmin && editMode ? (
                <div className="mt-8 lg:mt-10">
                  <button
                    onClick={openCreate}
                    className="hidden lg:inline-flex border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
                  >
                    + Add Project
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-10 border-t border-border/50 pt-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-caption whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isAdmin && editMode ? (
                <button
                  onClick={openCreate}
                  className="hidden md:inline-flex lg:hidden border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
                >
                  + Add Project
                </button>
              ) : null}
            </div>

            {/* Mobile add button */}
            {isAdmin && editMode ? (
              <div className="mt-4 md:hidden">
                <button
                  onClick={openCreate}
                  className="w-full border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
                >
                  + Add Project
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Projects list */}
      <section className="pb-24">
        {isLoading ? (
          <div className="container-custom">
            <p className="text-body-large">Loading...</p>
          </div>
        ) : (
          <>
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className={`py-12 md:py-20 ${
                  index % 2 === 0 ? "" : "bg-muted/30"
                }`}
              >
                <div className="container-custom">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Image */}
                    <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="aspect-[4/5] overflow-hidden image-fade bg-muted">
                        <img
                          src={toAbsoluteUrl(project.image)}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                            {project.category}
                          </span>
                          {(project.tags || []).slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="text-muted-foreground text-xs"
                            >
                              + {tag}
                            </span>
                          ))}
                        </div>

                        {isAdmin && editMode ? (
                          <div className="flex items-center gap-3 text-xs">
                            <button
                              onClick={() => openEdit(project)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(project.id)}
                              className="text-destructive"
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <h2 className="text-heading mb-4">{project.title}</h2>

                      <p className="text-caption mb-4">
                        {project.location} — {project.year}
                      </p>

                      <p className="text-base text-muted-foreground leading-relaxed mb-8">
                        {project.description}
                      </p>

                      <Link
                        to={`/project/${project.id}`}
                        className="text-caption link-underline"
                      >
                        View Project
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filteredProjects.length === 0 ? (
              <div className="container-custom">
                <p className="text-body-large">No projects in this category.</p>
              </div>
            ) : null}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/50">
        <div className="container-custom text-center">
          <p className="text-heading mb-8">Interested in working together?</p>
          <Link to="/about" className="text-caption link-underline">
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />

      {/* Editor Modal */}
      {isAdmin && editMode && editorOpen && draft ? (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={closeEditor} />

          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-background border border-border p-6 max-h-[86vh] overflow-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-serif text-xl">
                  {projects.some((p) => p.id === draft.id)
                    ? "Edit Project"
                    : "New Project"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Update fields and save.
                </div>
              </div>

              <button
                onClick={closeEditor}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <div className="text-caption mb-2">Title</div>
                <input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev
                    )
                  }
                  className="w-full border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Project title"
                />
              </div>

              <div>
                <div className="text-caption mb-2">Subtitle</div>
                <input
                  value={draft.subtitle}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev ? { ...prev, subtitle: e.target.value } : prev
                    )
                  }
                  className="w-full border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Project subtitle"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-caption mb-2">Location</div>
                  <input
                    value={draft.location}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev ? { ...prev, location: e.target.value } : prev
                      )
                    }
                    className="w-full border border-border bg-background px-4 py-3 outline-none"
                    placeholder="Tokyo, Japan"
                  />
                </div>

                <div>
                  <div className="text-caption mb-2">Year</div>
                  <input
                    value={draft.year}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev ? { ...prev, year: e.target.value } : prev
                      )
                    }
                    className="w-full border border-border bg-background px-4 py-3 outline-none"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-caption mb-2">Category</div>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              category: e.target.value as ProjectCategory,
                            }
                          : prev
                      )
                    }
                    className="w-full border border-border bg-background px-4 py-3 outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-caption mb-2">Status</div>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev
                          ? { ...prev, status: e.target.value as Project["status"] }
                          : prev
                      )
                    }
                    className="w-full border border-border bg-background px-4 py-3 outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Concept">Concept</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-caption mb-2">Material</div>
                  <input
                    value={draft.material}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev ? { ...prev, material: e.target.value } : prev
                      )
                    }
                    className="w-full border border-border bg-background px-4 py-3 outline-none"
                    placeholder="Concrete"
                  />
                </div>

                <div>
                  <div className="text-caption mb-2">Area</div>
                  <input
                    value={draft.area}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev ? { ...prev, area: e.target.value } : prev
                      )
                    }
                    className="w-full border border-border bg-background px-4 py-3 outline-none"
                    placeholder="520 m²"
                  />
                </div>
              </div>

              {/* Image Upload + URL (SERVER UPLOAD) */}
              <div>
                <div className="text-caption mb-2">Image</div>

                <div className="mb-3 aspect-[4/3] overflow-hidden border border-border bg-muted">
                  {draft.image ? (
                    <img
                      src={toAbsoluteUrl(draft.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => {
                        toast({
                          title: "Preview failed",
                          description:
                            "Image URL not reachable. Check VITE_API_BASE_URL or backend /uploads.",
                          variant: "destructive",
                        });
                      }}
                    />
                  ) : null}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors cursor-pointer inline-flex items-center justify-center">
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await onUpload(file);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <div className="text-xs text-muted-foreground">
                    Upload stores the image on your backend and returns a
                    /uploads/... URL.
                  </div>

                  <div className="pt-2">
                    <div className="text-caption mb-2">Or paste image URL</div>
                    <input
                      value={draft.image}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev ? { ...prev, image: e.target.value } : prev
                        )
                      }
                      className="w-full border border-border bg-background px-4 py-3 outline-none"
                      placeholder="https://... or /uploads/..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-caption mb-2">Description</div>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                  className="w-full min-h-[120px] border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Describe the project..."
                />
              </div>

              <div>
                <div className="text-caption mb-2">Details (one per line)</div>
                <textarea
                  value={(draft.details || []).join("\n")}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev
                        ? { ...prev, details: e.target.value.split("\n") }
                        : prev
                    )
                  }
                  className="w-full min-h-[140px] border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Detail line 1&#10;Detail line 2&#10;Detail line 3"
                />
              </div>

              <div>
                <div className="text-caption mb-2">Tags (comma separated)</div>
                <input
                  value={(draft.tags || []).join(", ")}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : prev
                    )
                  }
                  className="w-full border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Tokyo, 2026, Hotel, Concrete"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditor}
                className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Projects;
