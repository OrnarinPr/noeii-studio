import slide1 from "@/assets/slides/slide-1.jpg";
import slide2 from "@/assets/slides/slide-2.jpg";
import slide3 from "@/assets/slides/slide-3.jpg";
import slide4 from "@/assets/slides/slide-4.jpg";

import project1 from "@/assets/projects/project-1.jpg";
import project2 from "@/assets/projects/project-2.jpg";
import project3 from "@/assets/projects/project-3.jpg";
import project4 from "@/assets/projects/project-4.jpg";
import project5 from "@/assets/projects/project-5.jpg";
import project6 from "@/assets/projects/project-6.jpg";

export type Project = {
  id: string;
  title: string;
  subtitle?: string;

  location: string;
  year: string;
  category: string;

  description: string;
  tags: string[];

  // hero image (used on Home sections + Detail hero)
  image: string;

  // list cover (used on /projects grid)
  coverImage: string;

  // optional rich fields (Detail page can show if available)
  material?: string;
  details?: string[];
  area?: string;
  status?: string;
};

export const projects: Project[] = [
  {
    id: "1",
    image: slide1,
    coverImage: project1,
    title: "NASU RETREAT",
    subtitle: "雄大な自然に浮かびあがる鉄の彫刻",
    location: "Nasu, Japan",
    year: "2024",
    category: "Hotel",
    material: "Corten Steel",
    description:
      "A sanctuary where weathered steel meets untouched nature. This retreat emerges from the landscape as if it has always been there, its oxidized surfaces echoing the autumn hues of the surrounding forests.",
    details: [
      "The building's form was derived from the natural contours of the hillside, creating a seamless integration between architecture and landscape.",
      "Corten steel cladding develops a protective patina over time, requiring minimal maintenance while providing a warm, organic aesthetic.",
      "Floor-to-ceiling windows frame panoramic views of Mount Nasu, transforming each room into a living painting.",
    ],
    area: "2,400 m²",
    status: "Completed",
    tags: ["Nasu", "2024", "Hotel", "Corten Steel"],
  },
  {
    id: "2",
    image: slide2,
    coverImage: project2,
    title: "MOUNTAIN VIEW HOUSE",
    subtitle: "草原の風景と思考の家",
    location: "Kyoto, Japan",
    year: "2023",
    category: "Residence",
    material: "Concrete",
    description:
      "A meditative dwelling that celebrates the dialogue between solid and void. Minimal concrete volumes create contemplative spaces that frame the mountain landscape beyond.",
    details: [
      "A central courtyard brings natural light deep into the home while creating a private outdoor sanctuary.",
      "Exposed concrete walls provide thermal mass and create a sense of permanence and calm.",
      "Carefully positioned openings capture changing light throughout the day, creating ever-evolving interior atmospheres.",
    ],
    area: "380 m²",
    status: "Completed",
    tags: ["Kyoto", "2023", "Residence", "Concrete"],
  },
  {
    id: "3",
    image: slide3,
    coverImage: project3,
    title: "FLOATING PAVILION",
    subtitle: "開かれた別荘",
    location: "Osaka, Japan",
    year: "2023",
    category: "Villa",
    material: "Water",
    description:
      "Architecture as a bridge between earth and sky. This pavilion appears to hover above its reflecting pool, creating moments of weightlessness and tranquility.",
    details: [
      "The reflecting pool extends beyond the building's footprint, blurring the boundary between architecture and landscape.",
      "Glass walls dissolve the enclosure, allowing nature to become part of the interior experience.",
      "The floating roof plane creates a sense of shelter while maintaining an ethereal lightness.",
    ],
    area: "450 m²",
    status: "Completed",
    tags: ["Osaka", "2023", "Villa", "Water"],
  },
  {
    id: "4",
    image: slide4,
    coverImage: project4,
    title: "FOREST HOTEL",
    subtitle: "Times of coexistence",
    location: "Tokyo, Japan",
    year: "2022",
    category: "Hotel",
    material: "Interior",
    description:
      "An urban retreat that brings the serenity of the forest into the heart of the city. Natural materials and biophilic design principles create spaces for rest and reflection.",
    details: [
      "Living walls and indoor gardens filter air and create a connection to nature within the urban context.",
      "Japanese timber joinery techniques are used throughout, celebrating traditional craftsmanship.",
      "Each guest room offers views of private garden terraces, providing moments of tranquility.",
    ],
    area: "8,200 m²",
    status: "Completed",
    tags: ["Tokyo", "2022", "Hotel", "Interior"],
  },

  // Extra items (present in /projects list)
  {
    id: "5",
    image: project5,
    coverImage: project5,
    title: "Stone Garden House",
    location: "Hakone, Japan",
    year: "2022",
    category: "Residential",
    description:
      "A weekend retreat that emerges from the landscape. Raw concrete meets polished wood, framing a quiet stone garden.",
    details: [
      "A linear plan organizes living spaces along a stone garden axis.",
      "Natural light is guided through narrow openings to create calm, shadow-rich interiors.",
    ],
    tags: ["Mountain", "Concrete", "Nature"],
  },
  {
    id: "6",
    image: project6,
    coverImage: project6,
    title: "Light Box Museum",
    location: "Kanazawa, Japan",
    year: "2021",
    category: "Cultural",
    description:
      "A museum of natural light, transforming throughout the day with the sun’s movement. The building becomes an instrument that reveals time.",
    details: [
      "A sequence of galleries is carved to shape light into distinct spatial experiences.",
      "Reflective surfaces amplify subtle changes in daylight.",
    ],
    tags: ["Curves", "Light", "White"],
  },
];
