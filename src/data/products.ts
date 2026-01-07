import product1 from "@/assets/shop/product-1.jpg";
import product2 from "@/assets/shop/product-2.jpg";
import product3 from "@/assets/shop/product-3.jpg";

export type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  category: "Seating" | "Tables" | "Lighting" | "Objects" | "Storage";
};

export const products: Product[] = [
  {
    id: "1",
    name: "Void Chair",
    image: product1,
    description:
      "Minimalist oak chair with floating seat design. Handcrafted by Japanese artisans.",
    category: "Seating",
  },
  {
    id: "2",
    name: "Line Table",
    image: product2,
    description:
      "Low coffee table in blackened steel and white oak. Clean geometry meets warm materials.",
    category: "Tables",
  },
  {
    id: "3",
    name: "Shadow Lamp",
    image: product3,
    description:
      "Paper and brass floor lamp casting gentle, diffused light. Inspired by traditional Japanese lanterns.",
    category: "Lighting",
  },
  {
    id: "4",
    name: "Stone Bowl",
    image: product1,
    description:
      "Hand-carved granite bowl for display or function. Each piece unique in its natural variation.",
    category: "Objects",
  },
  {
    id: "5",
    name: "Frame Shelf",
    image: product2,
    description:
      "Wall-mounted shelving system in powder-coated steel. Modular and endlessly configurable.",
    category: "Storage",
  },
  {
    id: "6",
    name: "Fold Bench",
    image: product3,
    description:
      "Bench carved from a single piece of hinoki cypress. The grain tells its own story.",
    category: "Seating",
  },
];
