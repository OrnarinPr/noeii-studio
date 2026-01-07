import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/services/products";

type Category = "All" | "Seating" | "Tables" | "Lighting" | "Objects" | "Storage";

const CATEGORIES: Category[] = [
  "All",
  "Seating",
  "Tables",
  "Lighting",
  "Objects",
  "Storage",
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-caption whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
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
          {isLoading ? (
            <p className="text-body-large">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product, index) => (
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
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-caption text-muted-foreground">
                      {product.category}
                    </p>
                  </div>

                  <h2 className="font-serif text-xl font-light mb-3 group-hover:text-muted-foreground transition-colors">
                    {product.name}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {product.description}
                  </p>

                  <a
                    href="mailto:shop@noeii-arch.jp?subject=Purchase%20Inquiry"
                    className="text-caption link-underline inline-block"
                  >
                    Contact to Purchase
                  </a>
                </article>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 ? (
            <div className="pt-12">
              <p className="text-body-large">No items in this category.</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Custom Inquiries - Split section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-heading mb-6">Custom Commissions</h2>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Beyond our standard collection, we accept commissions for custom
                furniture and objects. Our process is collaborative—working
                closely with clients to create pieces that perfectly suit their
                space.
              </p>
              <div className="space-y-2">
                <p className="text-base">shop@noeii-arch.jp</p>
                <p className="text-muted-foreground text-sm">
                  Response within 48 hours
                </p>
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden">
              {/* Reuse one product image as a placeholder visual (keeps design intact) */}
              <img
                src={products[0]?.image}
                alt="Custom furniture"
                className="w-full h-full object-cover"
                loading="lazy"
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
