import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/services/projects";

const Projects = () => {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-20">
        <div className="container-custom">
          <h1 className="text-display mb-6">Selected Works</h1>
          <p className="text-body-large max-w-2xl">
            A curated selection of architecture and interior projects, exploring
            minimal space, light, and material.
          </p>
        </div>
      </section>

      {/* Project Grid */}
      <section className="pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {projects.map((project) => (
              <div key={project.id} className="group">
                <div className="image-fade mb-6">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-caption">
                    {project.category} • {project.location} • {project.year}
                  </p>

                  <h2 className="text-subheading">{project.title}</h2>

                  <p className="text-body-large">{project.description}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 border-thin rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      to={`/project/${project.id}`}
                      className="text-caption link-underline"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-32">
        <div className="container-custom text-center">
          <p className="text-heading mb-8">Interested in working together?</p>
          <Link to="/about" className="text-caption link-underline">
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
