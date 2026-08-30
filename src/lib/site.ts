import service3dAsset from "@/assets/service-3d.png.asset.json";
import serviceFullHome from "@/assets/service-fullhome.jpg";
import serviceKitchen from "@/assets/service-kitchen.jpg";
import serviceBedroom from "@/assets/service-bedroom.jpg";
import serviceCeiling from "@/assets/service-ceiling.jpg";
import serviceEndToEnd from "@/assets/service-endtoend.jpg";

export const SITE = {
  name: "DN Design Studio Home Interiors",
  shortName: "DN Design Studio",
  city: "Vijayawada",
  state: "Andhra Pradesh",
  addressLine: "Vijayawada, Andhra Pradesh 520010, India",
  phonePrimary: "+91 88010 68392",
  phonePrimaryRaw: "918801068392",
  phoneSecondary: "+91 93813 50660",
  phoneSecondaryRaw: "919381350660",
  email: "dndesignstudio.vja@gmail.com",
  instagram: "https://www.instagram.com/dn_designstudio.vja",
  googleReviews: "https://www.google.com/maps/place/DN+Design+Studio+Home+Interiors/@16.4961146,80.6585754,17z/data=!4m6!3m5!1s0x3a35fb4fa47247bf:0xda44b10b8e917e2e!8m2!3d16.4961146!4d80.6634463!16s%2Fg%2F11x2590ff0?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
  rating: 4.9,
  reviewCount: 65,
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.phonePrimaryRaw}?text=${encodeURIComponent(message)}`;
}

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price?: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    slug: "full-home-3d-design",
    name: "Full Home 3D Design Services",
    tagline: "See your entire home in photorealistic 3D before construction begins.",
    description:
      "Walk through your future home in photorealistic 3D before construction starts. We model your actual floor plan and real lighting so you can refine every detail early. Most families finalise the whole design in just two or three review rounds.",
    price: "from ₹15,000",
    image: service3dAsset.url,
  },
  {
    slug: "full-home-interiors",
    name: "Full Home Interiors",
    tagline: "Complete design and execution for your whole home, start to finish.",
    description:
      "One studio handles layout, joinery, finishes, furniture and site work for your entire home. Every room is designed as part of a single, cohesive vision. You get a considered home, not an assembled one.",
    image: serviceFullHome,
  },
  {
    slug: "modular-kitchen",
    name: "Modular Kitchen",
    tagline: "Smart, space-efficient kitchens built around how you cook and live.",
    description:
      "Indian kitchens built for real daily cooking — deep pull-outs, smart ventilation and durable hardware. Every storage detail is drawn around your utensils and workflow. Designed to survive tempering, grinding and everyday chaos.",
    image: serviceKitchen,
  },
  {
    slug: "modern-living-bedroom-designing",
    name: "Modern Living & Bedroom Designing",
    tagline: "Contemporary living rooms and bedrooms designed around your daily life.",
    description:
      "Living rooms and bedrooms designed for both lively family time and quiet rest. Warm palettes, hidden storage and layered lighting set the mood. Spaces that adapt to your day and night.",
    image: serviceBedroom,
  },
  {
    slug: "fall-ceiling-lighting",
    name: "Fall Ceiling & Lighting",
    tagline: "Custom ceilings and layered lighting that transform any room's mood.",
    description:
      "Custom ceiling profiles, coves and pelmets tailored to your room height. We layer ambient, task and accent lighting so the same space feels bright by morning and soft after dark. Wiring and dimming are planned with the design, never after it.",
    image: serviceCeiling,
  },
  {
    slug: "end-to-end-interiors",
    name: "End-to-End Interiors",
    tagline: "One team, one point of contact, from first sketch to final handover.",
    description:
      "Design, procurement, carpentry, electrical, painting and styling under one accountable team. We share schedules, site updates and clear timelines throughout. Move into a clean, tested home without chasing multiple vendors.",
    image: serviceEndToEnd,
  },
];

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/our-work", label: "Our Work" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;
