import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/services/projects";

const AdminProjects = () => {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-heading">Projects</h2>
        <button className="text-caption border-thin px-4 py-2">
          + New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-border p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-muted-foreground">
                {project.location} • {project.year}
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-muted-foreground hover:text-foreground">
                Edit
              </button>
              <button className="text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
