import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

import studioImage from "@/assets/about/studio.jpg";

const team = [
  {
    id: 1,
    name: "Yuki Tanaka",
    role: "Founding Principal",
    bio: "With over 20 years of experience in architectural practice, Yuki leads the studio's creative vision.",
  },
  {
    id: 2,
    name: "Kenji Watanabe",
    role: "Design Director",
    bio: "Kenji oversees all design development, bringing a meticulous eye for detail.",
  },
  {
    id: 3,
    name: "Sakura Yamamoto",
    role: "Senior Architect",
    bio: "Specializing in residential projects, Sakura creates intimate spaces that respond to daily life.",
  },
  {
    id: 4,
    name: "Hiroshi Nakamura",
    role: "Project Architect",
    bio: "Hiroshi manages complex commercial projects with sustainable building practices.",
  },
  {
    id: 5,
    name: "Emi Suzuki",
    role: "Interior Designer",
    bio: "Emi curates the material palette for each project, selecting finishes that enhance the concept.",
  },
  {
    id: 6,
    name: "Takeshi Ito",
    role: "Junior Architect",
    bio: "The newest member of our team, Takeshi brings fresh perspectives and digital expertise.",
  },
];

const Staff = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero - Horizontal scroll style header */}
      <section className="pt-32 pb-8 md:pt-40 md:pb-12">
        <div className="container-custom">
          <div className="flex items-end justify-between gap-8">
            <div>
              <h1 className="text-display mb-4 opacity-0 animate-fade-up">Staff</h1>
              <p className="text-body-large max-w-xl opacity-0 animate-fade-up stagger-1">
                A dedicated team united by a shared vision.
              </p>
            </div>
            <div className="hidden md:block text-right text-caption text-muted-foreground opacity-0 animate-fade-up stagger-2">
              <p>Tokyo, Japan</p>
              <p>Est. 2015</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team - Masonry style grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {team.map((member, index) => (
              <article
                key={member.id}
                className={`opacity-0 animate-fade-up ${index % 3 === 1 ? 'md:mt-16' : ''}`}
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Photo */}
                <div className="aspect-[3/4] bg-muted mb-6 overflow-hidden group">
                  <img
                    src={studioImage}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <h2 className="font-serif text-xl font-light mb-1">{member.name}</h2>
                <p className="text-caption text-muted-foreground mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us - Full width band */}
      <section className="py-24 md:py-32 bg-charcoal text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-6">Join Our Team</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                We're always looking for talented individuals who share our passion for thoughtful design.
              </p>
              <p className="text-white">careers@noeii-arch.jp</p>
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-6xl font-serif font-light text-white/20">採用</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Staff;
