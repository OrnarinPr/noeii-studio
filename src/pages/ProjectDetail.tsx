import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Project } from "@/data/projects";
import { listProjects } from "@/services/projects";

const ProjectDetail = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const project: Project | undefined = projects.find((p) => p.id === id);
  const currentIndex = projects.findIndex((p) => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);

    const handleScroll = () => setParallaxOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-caption link-underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation transparent />

      {/* Hero Section with Parallax */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-[120%]"
          style={{ transform: `translateY(-${parallaxOffset}px)` }}
        >
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-32">
          <div className="container-custom">
            <div
              className={`transition-all duration-1000 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-primary-foreground/70 text-xs uppercase tracking-[0.25em] px-3 py-1 border border-primary-foreground/20 backdrop-blur-sm">
                  {project.category}
                </span>
                <span className="text-primary-foreground/70 text-xs uppercase tracking-[0.25em] px-3 py-1 border border-primary-foreground/20 backdrop-blur-sm">
                  {project.year}
                </span>
                <span className="text-primary-foreground/70 text-xs uppercase tracking-[0.25em] px-3 py-1 border border-primary-foreground/20 backdrop-blur-sm">
                  {project.location}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-primary-foreground font-light tracking-wide mb-4">
                {project.title}
              </h1>

              <p className="text-primary-foreground/80 text-lg md:text-xl font-light max-w-2xl">
                {project.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/50 transition-all duration-1000 delay-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-xs uppercase tracking-[0.2em]">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary-foreground/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Project Info Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              <p className="text-heading text-foreground/90 leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-6 pt-8">
                {(project.details || []).map((detail, index) => (
                  <p key={index} className="text-body-large border-l-2 border-border pl-6">
                    {detail}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  { label: "Location", value: project.location },
                  { label: "Year", value: project.year },
                  { label: "Category", value: project.category },
                  { label: "Material", value: project.material },
                  { label: "Area", value: project.area },
                  { label: "Status", value: project.status },
                ].map((spec, index) => (
                  <div key={index} className="border-b border-border pb-4">
                    <span className="text-caption block mb-1">{spec.label}</span>
                    <span className="text-lg font-serif">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to other projects */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8">
            {prevProject ? (
              <Link
                to={`/project/${prevProject.id}`}
                className="group flex items-center gap-4 hover:opacity-70 transition-opacity"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                <div>
                  <span className="text-caption block mb-1">Previous</span>
                  <span className="font-serif text-lg">{prevProject.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                to={`/project/${nextProject.id}`}
                className="group flex items-center gap-4 justify-end text-right hover:opacity-70 transition-opacity"
              >
                <div>
                  <span className="text-caption block mb-1">Next</span>
                  <span className="font-serif text-lg">{nextProject.title}</span>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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
