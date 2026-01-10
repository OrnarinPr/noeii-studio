export type ProjectCategory =
  | "Residence"
  | "Villa"
  | "Hotel"
  | "Gallery"
  | "Office"
  | "Cultural"
  | "Commercial"
  | "Public";

export type Project = {
  id: string;
  image: string; // URL or dataURL
  title: string;
  subtitle: string;
  location: string;
  year: string;
  category: ProjectCategory;
  material: string;
  description: string;
  details: string[];
  area: string;
  status: "Completed" | "In Progress" | "Concept";
  tags: string[];
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    image: "/src/assets/slides/slide-1.jpg",
    title: "NASU RETREAT",
    subtitle: "雄大な自然に浮かびあがる鉄の彫刻",
    location: "Nasu, Japan",
    year: "2024",
    category: "Hotel",
    material: "Corten Steel",
    description:
      "A sanctuary where weathered steel meets untouched nature. This retreat emerges from the landscape as if it has always been there.",
    details: [
      "The building's form follows the natural contours of the hillside, blending architecture and landscape.",
      "Corten steel cladding develops a protective patina over time, requiring minimal maintenance.",
      "Floor-to-ceiling windows frame panoramic views, turning each room into a living painting.",
    ],
    area: "2,400 m²",
    status: "Completed",
    tags: ["Nasu", "2024", "Hotel", "Corten Steel"],
  },
  {
    id: "2",
    image: "/src/assets/slides/slide-2.jpg",
    title: "MOUNTAIN VIEW HOUSE",
    subtitle: "草原の風景と思考の家",
    location: "Kyoto, Japan",
    year: "2023",
    category: "Residence",
    material: "Concrete",
    description:
      "A meditative dwelling that celebrates the dialogue between solid and void. The structure floats above the meadow.",
    details: [
      "Cantilevered design minimizes footprint while maximizing connection to the landscape.",
      "Hand-finished exposed concrete reveals subtle variations in texture and tone.",
      "Internal courtyards bring natural light deep into the home while maintaining privacy.",
    ],
    area: "380 m²",
    status: "Completed",
    tags: ["Kyoto", "2023", "Residence", "Concrete"],
  },
  {
    id: "3",
    image: "/src/assets/slides/slide-3.jpg",
    title: "FLOATING PAVILION",
    subtitle: "開かれた別荘",
    location: "Osaka, Japan",
    year: "2023",
    category: "Villa",
    material: "Water",
    description:
      "A pavilion that appears to hover above its reflecting pool, creating an interplay of light, water, and space.",
    details: [
      "Reflecting pool extends the interior visually, blurring inside and outside.",
      "Operable glass walls open living spaces to the surrounding water garden.",
      "Roof curve collects rainwater which feeds the landscape.",
    ],
    area: "520 m²",
    status: "Completed",
    tags: ["Osaka", "2023", "Villa", "Water"],
  },
  {
    id: "4",
    image: "/src/assets/slides/slide-4.jpg",
    title: "FOREST HOTEL",
    subtitle: "Times of coexistence",
    location: "Tokyo, Japan",
    year: "2022",
    category: "Hotel",
    material: "Interior",
    description:
      "An urban retreat that brings the serenity of the forest into the heart of the city.",
    details: [
      "Living walls and indoor gardens create a connection to nature within an urban context.",
      "Japanese timber joinery techniques celebrate traditional craftsmanship.",
      "Guest rooms overlook private garden terraces for moments of tranquility.",
    ],
    area: "8,200 m²",
    status: "Completed",
    tags: ["Tokyo", "2022", "Hotel", "Interior"],
  },
];
