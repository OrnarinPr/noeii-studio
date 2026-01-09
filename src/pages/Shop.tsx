import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import AdminBar from "@/components/AdminBar";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewProductId,
  deleteProduct,
  listProducts,
  upsertProduct,
} from "@/services/products";
import { useAdmin } from "@/context/AdminContext";
import type { Product } from "@/data/products";
import { toast } from "@/components/ui/use-toast";

type Category = "All" | "Seating" | "Tables" | "Lighting" | "Objects" | "Storage";

const CATEGORIES: Category[] = [
  "All",
  "Seating",
  "Tables",
  "Lighting",
  "Objects",
  "Storage",
];

const PRODUCT_CATEGORIES: Exclude<Category, "All">[] = [
  "Seating",
  "Tables",
  "Lighting",
  "Objects",
  "Storage",
];

const Shop = () => {
  const queryClient = useQueryClient();
  const { isAdmin, editMode } = useAdmin();

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const openCreate = () => {
    const next: Product = {
      id: createNewProductId(),
      name: "",
      image: products[0]?.image ?? "",
      description: "",
      category: "Objects",
    };
    setDraft(next);
    setEditorOpen(true);
  };

  const openEdit = (p: Product) => {
    setDraft({ ...p });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setDraft(null);
  };

  const onSave = async () => {
    if (!draft) return;

    if (!draft.name.trim()) {
      toast({
        title: "Missing name",
        description: "Please enter product name.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please enter description.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.image.trim()) {
      toast({
        title: "Missing image",
        description: "Please enter image URL or keep default.",
        variant: "destructive",
      });
      return;
    }

    await upsertProduct(draft);
    await queryClient.invalidateQueries({ queryKey: ["products"] });

    toast({ title: "Saved", description: "Product updated." });
    closeEditor();
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    await deleteProduct(id);
    await queryClient.invalidateQueries({ queryKey: ["products"] });

    toast({ title: "Deleted", description: "Product removed." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AdminBar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container-custom">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-display mb-6 opacity-0 animate-fade-up">Shop</h1>
              <p className="text-body-large max-w-xl opacity-0 animate-fade-up stagger-1">
                A curated collection of furniture and objects designed by our studio.
              </p>
            </div>

            {isAdmin && editMode ? (
              <button
                onClick={openCreate}
                className="hidden md:inline-flex border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
              >
                + Add Product
              </button>
            ) : null}
          </div>
        </div>

        {/* Categories */}
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

        {/* Mobile add button */}
        {isAdmin && editMode ? (
          <div className="mt-4 px-6 md:hidden">
            <button
              onClick={openCreate}
              className="w-full border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
            >
              + Add Product
            </button>
          </div>
        ) : null}
      </section>

      {/* Products */}
      <section className="pb-24">
        <div className="container-custom">
          {isLoading ? (
            <p className="text-body-large">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product, index) => (
                <article
                  key={product.id}
                  className="group opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="aspect-[4/5] bg-muted mb-6 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-caption text-muted-foreground">
                      {product.category}
                    </p>

                    {isAdmin && editMode ? (
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="text-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
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

      {/* Custom Inquiries */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-heading mb-6">Custom Commissions</h2>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Beyond our standard collection, we accept commissions for custom
                furniture and objects. Our process is collaborative—working
                closely with clients to create pieces that perfectly suit their space.
              </p>
              <div className="space-y-2">
                <p className="text-base">shop@noeii-arch.jp</p>
                <p className="text-muted-foreground text-sm">
                  Response within 48 hours
                </p>
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden">
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

      {/* Editor Modal */}
      {isAdmin && editMode && editorOpen && draft ? (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={closeEditor} />

          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 bg-background border border-border p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-serif text-xl">
                  {products.some((p) => p.id === draft.id) ? "Edit Product" : "New Product"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Update fields and save.
                </div>
              </div>

              <button
                onClick={closeEditor}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <div className="text-caption mb-2">Name</div>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Product name"
                />
              </div>

              <div>
                <div className="text-caption mb-2">Category</div>
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      category: e.target.value as Product["category"],
                    })
                  }
                  className="w-full border border-border bg-background px-4 py-3 outline-none"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-caption mb-2">Image URL</div>
                <input
                  value={draft.image}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 outline-none"
                  placeholder="https://..."
                />
                <div className="text-xs text-muted-foreground mt-2">
                  For now use a URL or keep existing. Later we will add upload.
                </div>
              </div>

              <div>
                <div className="text-caption mb-2">Description</div>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  className="w-full min-h-[120px] border border-border bg-background px-4 py-3 outline-none"
                  placeholder="Describe the product..."
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditor}
                className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Shop;
