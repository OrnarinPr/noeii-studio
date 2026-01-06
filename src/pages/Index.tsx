import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

import slide1 from "@/assets/slides/slide-1.jpg";
import slide2 from "@/assets/slides/slide-2.jpg";
import slide3 from "@/assets/slides/slide-3.jpg";
import slide4 from "@/assets/slides/slide-4.jpg";

const projects = [
  {
    id: "1",
    image: slide1,
    title: "NASU RETREAT",
    subtitle: "雄大な自然に浮かびあがる鉄の彫刻",
    tags: ["Nasu", "2024", "Hotel", "Corten Steel"],
  },
  {
    id: "2",
    image: slide2,
    title: "MOUNTAIN VIEW HOUSE",
    subtitle: "草原の風景と思考の家",
    tags: ["Kyoto", "2023", "Residence", "Concrete"],
  },
  {
    id: "3",
    image: slide3,
    title: "FLOATING PAVILION",
    subtitle: "開かれた別荘",
    tags: ["Osaka", "2023", "Villa", "Water"],
  },
  {
    id: "4",
    image: slide4,
    title: "FOREST HOTEL",
    subtitle: "Times of coexistence",
    tags: ["Tokyo", "2022", "Hotel", "Interior"],
  },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.project-section');
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background"
      onMouseMove={handleMouseMove}
    >
      <Navigation transparent />

      {/* Progress indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const section = document.querySelector(`[data-index="${index}"]`);
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-1 transition-all duration-500 rounded-full ${
              activeIndex === index 
                ? 'h-12 bg-primary-foreground' 
                : 'h-3 bg-primary-foreground/30 hover:bg-primary-foreground/50'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Project counter */}
      <div className="fixed left-8 bottom-8 z-40 hidden lg:block">
        <div className="flex items-baseline gap-1 text-primary-foreground mix-blend-difference">
          <span className="text-4xl font-serif font-light">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="text-sm opacity-50">/</span>
          <span className="text-sm opacity-50">{String(projects.length).padStart(2, '0')}</span>
        </div>
      </div>
      
      {/* Full-screen vertical scroll projects */}
      {projects.map((project, index) => (
        <section 
          key={project.id}
          data-index={index}
          className="project-section relative h-screen w-full overflow-hidden snap-start"
          style={{ scrollSnapAlign: 'start' }}
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
                isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            />
          </div>
          
          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          
          {/* Animated grain effect */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28">
            <div className="container-custom">
              {/* Tags with stagger animation */}
              <div className={`flex flex-wrap gap-2 mb-6 transition-all duration-700 ${
                activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <span className="text-primary-foreground/60 text-xs uppercase tracking-[0.25em]">Works</span>
                {project.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-primary-foreground/60 text-xs tracking-wide"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    + {tag}
                  </span>
                ))}
              </div>

              {/* Subtitle */}
              <p className={`text-primary-foreground/80 text-base md:text-lg mb-3 font-light transition-all duration-700 delay-100 ${
                activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {project.subtitle}
              </p>

              {/* Title with hover effect */}
              <Link 
                to={`/project/${project.id}`} 
                className="group inline-block"
              >
                <h2 className={`font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-primary-foreground font-light tracking-wide transition-all duration-700 delay-150 ${
                  activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-4">
                    {project.title}
                  </span>
                  <span className="inline-block ml-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    →
                  </span>
                </h2>
              </Link>

              {/* View project link */}
              <Link
                to={`/project/${project.id}`}
                className={`inline-flex items-center gap-3 mt-8 text-primary-foreground/70 text-xs uppercase tracking-[0.25em] hover:text-primary-foreground transition-all duration-700 delay-200 group ${
                  activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <span className="relative overflow-hidden">
                  <span className="inline-block group-hover:-translate-y-full transition-transform duration-300">View Project</span>
                  <span className="absolute top-full left-0 inline-block group-hover:-translate-y-full transition-transform duration-300">View Project</span>
                </span>
                <span className="w-8 h-px bg-primary-foreground/50 group-hover:w-12 transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Scroll indicator for first slide */}
          {index === 0 && (
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-primary-foreground/60 transition-all duration-1000 delay-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="text-xs uppercase tracking-[0.25em]">Scroll</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          )}
        </section>
      ))}

      {/* Philosophy section */}
      <section className="py-40 md:py-56 bg-background relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-0 left-1/4 w-px h-full bg-foreground" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-foreground" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-foreground" />
        </div>
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/90 mb-16">
              "We believe in the power of empty space. In architecture, what you leave out is just as important as what you put in."
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors group"
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
