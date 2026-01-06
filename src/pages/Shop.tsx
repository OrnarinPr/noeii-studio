import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

import product1 from "@/assets/shop/product-1.jpg";
import product2 from "@/assets/shop/product-2.jpg";
import product3 from "@/assets/shop/product-3.jpg";

const products = [
  {
    id: 1,
    name: "Void Chair",
    image: product1,
    description: "Minimalist oak chair with floating seat design. Handcrafted by Japanese artisans.",
    category: "Seating",
  },
  {
    id: 2,
    name: "Line Table",
    image: product2,
    description: "Low coffee table in blackened steel and white oak. Clean geometry meets warm materials.",
    category: "Tables",
  },
  {
    id: 3,
    name: "Shadow Lamp",
    image: product3,
    description: "Paper and brass floor lamp casting gentle, diffused light. Inspired by traditional Japanese lanterns.",
    category: "Lighting",
  },
  {
    id: 4,
    name: "Stone Bowl",
    image: product1,
    description: "Hand-carved granite bowl for display or function. Each piece unique in its natural variation.",
    category: "Objects",
  },
  {
    id: 5,
    name: "Frame Shelf",
    image: product2,
    description: "Wall-mounted shelving system in powder-coated steel. Modular and endlessly configurable.",
    category: "Storage",
  },
  {
    id: 6,
    name: "Fold Bench",
    image: product3,
    description: "Bench carved from a single piece of hinoki cypress. The grain tells its own story.",
    category: "Seating",
  },
];

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero - Marquee style */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container-custom">
          <h1 className="text-display mb-6 opacity-0 animate-fade-up">Shop</h1>
          <p className="text-body-large max-w-xl opacity-0 animate-fade-up stagger-1">
            A curated collection of furniture and objects designed by our studio.
          </p>
        </div>
        
        {/* Horizontal scrolling categories */}
        <div className="mt-12 flex gap-8 overflow-x-auto pb-4 px-6 md:px-12 lg:px-16 scrollbar-hide">
          {["All", "Seating", "Tables", "Lighting", "Objects", "Storage"].map((cat, i) => (
            <button
              key={cat}
              className={`text-caption whitespace-nowrap transition-colors ${
                i === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products - Large grid with hover effect */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="group opacity-0 animate-fade-up cursor-pointer"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Product Image */}
                <div className="aspect-[4/5] bg-muted mb-6 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-caption text-muted-foreground">{product.category}</p>
                </div>
                <h2 className="font-serif text-xl font-light mb-3 group-hover:text-muted-foreground transition-colors">
                  {product.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {product.description}
                </p>
                <button className="text-caption link-underline">
                  Contact to Purchase
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Inquiries - Split section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-heading mb-6">Custom Commissions</h2>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Beyond our standard collection, we accept commissions for bespoke furniture and objects. We work closely with clients to create pieces that perfectly suit their space.
              </p>
              <div className="space-y-2">
                <p className="text-base">shop@noeii-arch.jp</p>
                <p className="text-muted-foreground text-sm">Response within 48 hours</p>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={product1}
                alt="Custom furniture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
