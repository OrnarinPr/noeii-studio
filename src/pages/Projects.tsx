import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

import project1 from "@/assets/projects/project-1.jpg";
import project2 from "@/assets/projects/project-2.jpg";
import project3 from "@/assets/projects/project-3.jpg";
import project4 from "@/assets/projects/project-4.jpg";
import project5 from "@/assets/projects/project-5.jpg";
import project6 from "@/assets/projects/project-6.jpg";

const projects = [
  {
    id: 1,
    image: project1,
    title: "White House Residence",
    location: "Kyoto, Japan",
    year: "2024",
    description: "A private residence that blends traditional Japanese aesthetics with contemporary minimalism.",
    category: "Residential",
    tags: ["Bamboo Garden", "Glass", "Wood"],
  },
  {
    id: 2,
    image: project2,
    title: "Floating Pavilion",
    location: "Osaka, Japan",
    year: "2023",
    description: "A meditation space hovering above a reflecting pool, creating a sense of calm.",
    category: "Public",
    tags: ["Water", "Concrete", "Zen"],
  },
  {
    id: 3,
    image: project3,
    title: "Horizon Gallery",
    location: "Tokyo, Japan",
    year: "2023",
    description: "An art gallery designed to disappear, allowing the exhibited works to take center stage.",
    category: "Commercial",
    tags: ["White", "Light", "Minimal"],
  },
  {
    id: 4,
    image: project4,
    title: "Void Office",
    location: "Nagoya, Japan",
    year: "2022",
    description: "Corporate headquarters reimagined as a series of interconnected voids.",
    category: "Commercial",
    tags: ["Wood Structure", "Skylight", "Open"],
  },
  {
    id: 5,
    image: project5,
    title: "Stone Garden House",
    location: "Hakone, Japan",
    year: "2022",
    description: "A weekend retreat that emerges from the landscape. Raw concrete meets polished wood.",
    category: "Residential",
    tags: ["Mountain", "Concrete", "Nature"],
  },
  {
    id: 6,
    image: project6,
    title: "Light Box Museum",
    location: "Kanazawa, Japan",
    year: "2021",
    description: "A museum of natural light, transforming throughout the day with the sun's movement.",
    category: "Cultural",
    tags: ["Curves", "Light", "White"],
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-custom">
          <h1 className="text-display mb-6 opacity-0 animate-fade-up">Works</h1>
          <p className="text-body-large max-w-xl opacity-0 animate-fade-up stagger-1">
            A selection of architectural works spanning residential, commercial, and cultural spaces.
          </p>
        </div>
      </section>

      {/* Projects - Alternating layout like Suppose */}
      <section className="pb-24">
        {projects.map((project, index) => (
          <article 
            key={project.id}
            className={`py-12 md:py-20 ${index % 2 === 0 ? '' : 'bg-muted/30'}`}
          >
            <div className="container-custom">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/5] overflow-hidden image-fade">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">{project.category}</span>
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-muted-foreground text-xs">
                        + {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-heading mb-4">{project.title}</h2>
                  
                  <p className="text-caption mb-4">
                    {project.location} — {project.year}
                  </p>
                  
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    {project.description}
                  </p>

                  <Link to="#" className="text-caption link-underline">
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
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
    </div>
  );
};

export default Projects;
