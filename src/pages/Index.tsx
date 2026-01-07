import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/services/projects";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  // Keep home sections limited (same idea as before: 4 hero projects)
  const homeProjects = projects.slice(0, 4);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const sections = document.querySelectorAll(".project-section");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveIndex(index);
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setMousePosition({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToNext = () => {
    const nextIndex = Math.min(activeIndex + 1, homeProjects.length - 1);
    const section = document.querySelector(`[data-index="${nextIndex}"]`);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Side project nav */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {homeProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const section = document.querySelector(`[data-index="${index}"]`);
              section?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`w-1 transition-all duration-500 rounded-full ${
              activeIndex === index
                ? "h-12 bg-primary-foreground"
                : "h-3 bg-primary-foreground/30 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Project counter */}
      <div className="fixed left-8 bottom-8 z-40 hidden lg:block">
        <div className="flex items-baseline gap-1 text-primary-foreground mix-blend-difference">
          <span className="font-serif text-5xl">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="text-sm opacity-70">/ {String(homeProjects.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="fixed left-1/2 bottom-10 -translate-x-1/2 z-40 hidden lg:flex flex-col items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
      >
        <span className="text-caption">Scroll</span>
        <ArrowDown className="animate-bounce" size={18} />
      </button>

      {/* If no projects yet */}
      {homeProjects.length === 0 ? (
        <div className="container-custom pt-40 pb-32">
          <p className="text-body-large">No projects found.</p>
        </div>
      ) : null}

      {/* Sections */}
      {homeProjects.map((project, index) => (
        <section
          key={project.id}
          data-index={index}
          className="project-section relative h-screen w-full overflow-hidden snap-start"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`,
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-1000 ${
                isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          <div className="relative h-full flex items-center">
            <div className="container-custom">
              <div className="max-w-3xl">
                <p className="text-caption text-primary-foreground/80 mb-6">
                  {project.category} • {project.location} • {project.year}
                </p>

                <Link to={`/project/${project.id}`} className="group inline-block">
                  <h2
                    className={`font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-primary-foreground 
                    font-light tracking-wide leading-[1.1] transition-transform duration-500 group-hover:translate-x-2`}
                  >
                    {project.title}
                  </h2>
                </Link>

                {project.subtitle ? (
                  <p className="text-subheading text-primary-foreground/90 mt-6">
                    {project.subtitle}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-3 mt-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 border border-primary-foreground/40 rounded-full text-primary-foreground/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-12">
                  <Link
                    to={`/project/${project.id}`}
                    className="text-caption link-underline text-primary-foreground"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* About CTA */}
      <section className="py-32 bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption mb-4">NOEII ARCH STUDIO</p>
            <h2 className="text-heading mb-6">
              Minimal spaces with timeless elegance.
            </h2>
            <p className="text-body-large mb-10">
              We craft architecture, interiors, and visual identity through light,
              material, and quiet proportions.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-4 text-caption group"
            >
              <span>About Our Philosophy</span>
              <span className="w-12 h-px bg-current group-hover:w-20 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
