import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

import studioImage from "@/assets/about/studio.jpg";
import slide3 from "@/assets/slides/slide-3.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero - Full bleed image */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={slide3}
          alt="NOEII Studio Philosophy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
          <div className="container-custom">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide">
              About
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-heading leading-relaxed text-muted-foreground">
              NOEII ARCH STUDIO is a Tokyo-based architecture and design practice founded on the belief that simplicity reveals beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy - Horizontal scroll feel */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Image */}
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={studioImage}
                  alt="NOEII Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-6 lg:col-start-7 space-y-12">
              <div>
                <h2 className="text-caption mb-6">Philosophy</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We approach each project as an opportunity to create harmony between human needs and spatial poetry. Our work is guided by the principle of "Ma" — the Japanese concept of negative space — understanding that emptiness is not absence, but potential.
                </p>
              </div>

              <div>
                <h2 className="text-caption mb-6">Approach</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Every design begins with listening. We seek to understand not just what our clients want, but how they live, work, and dream.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Materials are chosen for their honesty. Light is treated as a building material. Detail is obsessed over.
                </p>
              </div>

              <div>
                <h2 className="text-caption mb-6">Services</h2>
                <ul className="space-y-3 text-base text-muted-foreground">
                  <li>Architectural Design</li>
                  <li>Interior Design</li>
                  <li>Spatial Planning</li>
                  <li>Furniture Design</li>
                  <li>Visual Identity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story - Full width */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-caption mb-8">Our Story</h2>
              <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
                <p>
                  NOEII ARCH STUDIO was established in 2015 by a small group of architects who shared a vision: to create spaces where silence speaks louder than noise.
                </p>
                <p>
                  Based in Tokyo's Aoyama district, our studio operates at the intersection of traditional Japanese craftsmanship and contemporary design thinking.
                </p>
                <p>
                  The name "NOEII" derives from an ancient word meaning "the essence of things" — a reminder that our work should always seek truth beneath surface.
                </p>
              </div>
            </div>
            
            <div className="flex items-end">
              <div>
                <h2 className="text-heading mb-6">Begin a Conversation</h2>
                <p className="text-base text-muted-foreground mb-8">
                  We welcome inquiries for new projects, collaborations, and consultations.
                </p>
                <div className="space-y-2 text-base">
                  <p>info@noeii-arch.jp</p>
                  <p>+81 3 1234 5678</p>
                  <p className="text-muted-foreground">Tokyo, Japan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
