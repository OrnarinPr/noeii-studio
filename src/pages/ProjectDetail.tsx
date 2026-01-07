import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectById, listProjects } from "@/services/projects";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { id } = useParams();
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id ?? ""),
    enabled: !!id,
  });

  useEffect(() => {
    const handleScroll = () => setParallaxOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!id || project === undefined) {
    // while query resolves (instant for static, but safe)
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container-custom pt-40 pb-32">
          <p className="text-body-large">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  const currentIndex = projects.findIndex((p) => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  const detailLines = project.details ?? [];

  const specs = [
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Category", value: project.category },
    { label: "Material", value: project.material },
    { label: "Area", value: project.area },
    { label: "Status", value: project.status },
  ].filter((s) => !!s.value);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex items-end pb-20">
          <div className="container-custom">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors mb-10"
            >
              <ArrowLeft size={18} />
              <span className="text-caption">Back to Projects</span>
            </Link>

            <h1 className="text-display text-primary-foreground mb-4">
              {project.title}
            </h1>
            {project.subtitle ? (
              <p className="text-subheading text-primary-foreground/90 mb-6">
                {project.subtitle}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 border border-primary-foreground/40 rounded-full text-primary-foreground/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Description */}
            <div className="lg:col-span-8 space-y-10">
              <p className="text-body-large text-foreground/90 leading-relaxed">
                {project.description}
              </p>

              {detailLines.length > 0 ? (
                <div className="space-y-6 pt-8">
                  {detailLines.map((line, index) => (
                    <p
                      key={index}
                      className="text-body-large border-l-2 border-border pl-6"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Specs */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-6">
                {specs.map((spec, index) => (
                  <div key={index} className="border-b border-border pb-4">
                    <span className="text-caption block mb-1">
                      {spec.label}
                    </span>
                    <span className="text-body-large text-foreground/90">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between mt-20 pt-12 border-t border-border">
            {prevProject ? (
              <Link
                to={`/project/${prevProject.id}`}
                className="group inline-flex items-center gap-3"
              >
                <ArrowLeft
                  size={18}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
                <div>
                  <p className="text-caption">Previous</p>
                  <p className="text-body-large group-hover:underline">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                to={`/project/${nextProject.id}`}
                className="group inline-flex items-center gap-3 text-right"
              >
                <div>
                  <p className="text-caption">Next</p>
                  <p className="text-body-large group-hover:underline">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
