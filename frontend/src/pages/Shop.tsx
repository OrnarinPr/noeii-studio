import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import AdminBar from "@/components/AdminBar";

import { useEffect, useMemo, useState } from "react";
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
import { uploadImage } from "@/services/uploads";

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

function isAllowedImage(file: File) {
  const okType = ["image/png", "image/jpeg", "image/webp"].includes(file.type);
  const okSize = file.size <= 3 * 1024 * 1024; // 3MB
  return { okType, okSize };
}

const Shop = () => {
  const queryClient = useQueryClient();
  const { isAdmin, editMode, token } = useAdmin();

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);

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

    if (!isAdmin || !editMode || !token) {
      toast({
        title: "Admin required",
        description: "Please login as admin to save changes.",
        variant: "destructive",
      });
      return;
    }

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
        description: "Please upload an image or paste an image URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      await upsertProduct(draft, token);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Saved", description: "Product updated." });
      closeEditor();
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string) => {
    if (!isAdmin || !editMode || !token) {
      toast({
        title: "Admin required",
        description: "Please login as admin to delete.",
        variant: "destructive",
      });
      return;
    }

    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      await deleteProduct(id, token);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Deleted", description: "Product removed." });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const onUpload = async (file: File) => {
    if (!draft) return;

    if (!token) {
      toast({
        title: "Admin required",
        description: "Please login as admin to upload.",
        variant: "destructive",
      });
      return;
    }

    const { okType, okSize } = isAllowedImage(file);

    if (!okType) {
      toast({
        title: "Unsupported file type",
        description: "Please upload PNG, JPG, or WEBP.",
        variant: "destructive",
      });
      return;
    }

    if (!okSize) {
      toast({
        title: "File too large",
        description: "Please use an image <= 3MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file, token); // returns "/uploads/xxx.jpg"
      setDraft({ ...draft, image: url });
      toast({ title: "Uploaded", description: "Image uploaded to server." });
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Lock page scroll while the editor drawer is open
  useEffect(() => {
    if (editorOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [editorOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AdminBar />

      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <h1 className="text-display mb-6 opacity-0 animate-fade-up">Shop</h1>
            </div>

            <div className="lg:col-span-5">
              <p className="text-body-large opacity-0 animate-fade-up stagger-1 max-w-md lg:ml-auto">
                A curated collection of furniture and objects designed by our studio.
              </p>

              {isAdmin && editMode ? (
                <div className="mt-8 lg:mt-10">
                  <button
                    onClick={openCreate}
                    className="hidden lg:inline-flex border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
                  >
                    + Add Product
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-10 border-t border-border/50 pt-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-caption whitespace-nowrap transition-colors ${activeCategory === cat
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isAdmin && editMode ? (
                <button
                  onClick={openCreate}
                  className="hidden md:inline-flex lg:hidden border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
                >
                  + Add Product
                </button>
              ) : null}
            </div>

            {/* Mobile add button */}
            {isAdmin && editMode ? (
              <div className="mt-4 md:hidden">
                <button
                  onClick={openCreate}
                  className="w-full border-thin px-4 py-3 text-caption hover:bg-accent transition-colors"
                >
                  + Add Product
                </button>
              </div>
            ) : null}
          </div>
        </div>
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
                      src={product.image.startsWith("/uploads/")
                        ? `http://127.0.0.1:8000${product.image}`
                        : product.image
                      }

                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-caption text-muted-foreground">{product.category}</p>

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
                furniture and objects. Our process is collaborative—working closely
                with clients to create pieces that perfectly suit their space.
              </p>
              <div className="space-y-2">
                <p className="text-base">shop@noeii-arch.jp</p>
                <p className="text-muted-foreground text-sm">Response within 48 hours</p>
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

      {/* Editor Modal (Replaced with Right Drawer; old logic preserved) */}
      {isAdmin && editMode && editorOpen && draft ? (
        <>
          {/* Overlay */}
          <div
            className="admin-drawer-overlay"
            onClick={closeEditor}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside className="admin-drawer animate-drawer-in" role="dialog" aria-modal="true">
            <div className="admin-drawer-header">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl font-light">
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
            </div>

            <div className="admin-drawer-body">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="admin-label">Name</div>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="admin-input"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <div className="admin-label">Category</div>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value as Product["category"] })
                    }
                    className="admin-input"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload + URL */}
                <div>
                  <div className="admin-label">Image</div>

                  <div className="mb-3 border border-border bg-muted p-2">
                    {draft.image ? (
                      <img
                        src={draft.image}
                        alt="Preview"
                        className="admin-image-preview"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors cursor-pointer inline-flex items-center justify-center">
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await onUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>

                    <div className="text-xs text-muted-foreground">
                      Upload stores the image on your backend and returns a /uploads/... URL.
                    </div>

                    <div className="pt-2">
                      <div className="admin-label">Or paste image URL</div>
                      <input
                        value={draft.image}
                        onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                        className="admin-input"
                        placeholder="https://... or /uploads/..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="admin-label">Description</div>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    className="w-full min-h-[120px] border border-border bg-background px-4 py-3 outline-none"
                    placeholder="Describe the product..."
                  />
                </div>
              </div>
            </div>

            <div className="admin-drawer-footer">
              <div className="flex items-center justify-end gap-3">
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
          </aside>
        </>
      ) : null}
    </div>
  );
};

export default Shop;
