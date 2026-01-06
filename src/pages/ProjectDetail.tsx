import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import slide1 from "@/assets/slides/slide-1.jpg";
import slide2 from "@/assets/slides/slide-2.jpg";
import slide3 from "@/assets/slides/slide-3.jpg";
import slide4 from "@/assets/slides/slide-4.jpg";

const projectsData = [
  {
    id: "1",
    image: slide1,
    title: "NASU RETREAT",
    subtitle: "雄大な自然に浮かびあがる鉄の彫刻",
    location: "Nasu, Japan",
    year: "2024",
    category: "Hotel",
    material: "Corten Steel",
    description: "A sanctuary where weathered steel meets untouched nature. This retreat emerges from the landscape as if it has always been there, its oxidized surfaces echoing the autumn hues of the surrounding forests.",
    details: [
      "The building's form was derived from the natural contours of the hillside, creating a seamless integration between architecture and landscape.",
      "Corten steel cladding develops a protective patina over time, requiring minimal maintenance while providing a warm, organic aesthetic.",
      "Floor-to-ceiling windows frame panoramic views of Mount Nasu, transforming each room into a living painting.",
    ],
    area: "2,400 m²",
    status: "Completed",
  },
  {
    id: "2",
    image: slide2,
    title: "MOUNTAIN VIEW HOUSE",
    subtitle: "草原の風景と思考の家",
    location: "Kyoto, Japan",
    year: "2023",
    category: "Residence",
    material: "Concrete",
    description: "A meditative dwelling that celebrates the dialogue between solid and void. The concrete structure floats above the meadow, offering uninterrupted views of the distant mountains.",
    details: [
      "The cantilevered design minimizes the building's footprint while maximizing visual connection to the landscape.",
      "Exposed concrete surfaces are hand-finished to reveal subtle variations in texture and tone.",
      "Internal courtyards bring natural light deep into the home while maintaining privacy.",
    ],
    area: "380 m²",
    status: "Completed",
  },
  {
    id: "3",
    image: slide3,
    title: "FLOATING PAVILION",
    subtitle: "開かれた別荘",
    location: "Osaka, Japan",
    year: "2023",
    category: "Villa",
    material: "Water",
    description: "Architecture as a bridge between earth and sky. This pavilion appears to hover above its reflecting pool, creating an ever-changing interplay of light, water, and space.",
    details: [
      "The reflecting pool extends the interior space visually, blurring the boundary between inside and outside.",
      "Operable glass walls allow the living spaces to open completely to the surrounding water garden.",
      "The roof's gentle curve was designed to collect rainwater, which feeds the surrounding landscape.",
    ],
    area: "520 m²",
    status: "Completed",
  },
  {
    id: "4",
    image: slide4,
    title: "FOREST HOTEL",
    subtitle: "Times of coexistence",
    location: "Tokyo, Japan",
    year: "2022",
    category: "Hotel",
    material: "Interior",
    description: "An urban retreat that brings the serenity of the forest into the heart of the city. Natural materials and biophilic design principles create spaces for rest and reflection.",
    details: [
      "Living walls and indoor gardens filter air and create a connection to nature within the urban context.",
      "Japanese timber joinery techniques are used throughout, celebrating traditional craftsmanship.",
      "Each guest room offers views of private garden terraces, providing moments of tranquility.",
    ],
    area: "8,200 m²",
    status: "Completed",
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  const project = projectsData.find(p => p.id === id);
  const currentIndex = projectsData.findIndex(p => p.id === id);
  const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
  const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.3);
    };

    window.addEventListener("scroll", handleScroll);
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
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-32">
          <div className="container-custom">
            <div className={`transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
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

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/50 transition-all duration-1000 delay-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}>
          <span className="text-xs uppercase tracking-[0.2em]">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary-foreground/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Project Info Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Description */}
            <div className="lg:col-span-2 space-y-8">
              <p className="text-heading text-foreground/90 leading-relaxed">
                {project.description}
              </p>
              
              <div className="space-y-6 pt-8">
                {project.details.map((detail, index) => (
                  <p key={index} className="text-body-large border-l-2 border-border pl-6">
                    {detail}
                  </p>
                ))}
              </div>
            </div>

            {/* Project Specs */}
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
