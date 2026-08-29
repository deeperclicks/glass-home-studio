import service3d from "@/assets/service-3d.jpg";
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
  googleReviews: "https://www.google.com/search?q=DN+Design+Studio+Home+Interiors+Vijayawada",
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
      "Walk through every room of your home long before the first nail goes in. We model your actual floor plan, light it the way your windows really face, and render it in photorealistic detail so you can change your mind on paper instead of on site. Most families finalise their whole home in two or three review rounds with us.",
    price: "from ₹15,000",
    image: service3d,
  },
  {
    slug: "full-home-interiors",
    name: "Full Home Interiors",
    tagline: "Complete design and execution for your whole home, start to finish.",
    description:
      "One studio, one drawing set, one accountable team for every room in the house. We handle layout, joinery, finishes, furniture, soft furnishings and the site work that ties it together, so the palette in your bedroom quietly agrees with the one in your living room. You get a home that feels considered, not assembled.",
    image: serviceFullHome,
  },
  {
    slug: "modular-kitchen",
    name: "Modular Kitchen",
    tagline: "Smart, space-efficient kitchens built around how you cook and live.",
    description:
      "An Indian kitchen has to survive tempering, grinding and everyday chaos, so we design ours around real cooking. Deep pull-outs where the masalas go, ventilation planned before the false ceiling, and hardware we would put in our own homes. Every centimetre of storage is drawn to your utensils, not to a catalogue.",
    image: serviceKitchen,
  },
  {
    slug: "modern-living-bedroom-designing",
    name: "Modern Living & Bedroom Designing",
    tagline: "Contemporary living rooms and bedrooms designed around your daily life.",
    description:
      "Your living room hosts family on Sundays and quiet evenings on weekdays, and your bedroom has to switch off the day. We design both with warm, restrained material palettes, generous storage that disappears into the walls, and lighting layers you can dial down at night.",
    image: serviceBedroom,
  },
  {
    slug: "fall-ceiling-lighting",
    name: "Fall Ceiling & Lighting",
    tagline: "Custom ceilings and layered lighting that transform any room's mood.",
    description:
      "Ceilings are the one surface nobody decorates and everybody notices. We design profiles, coves and pelmets that suit your slab height, then layer ambient, task and accent lighting so a single room can feel bright at breakfast and soft at midnight. Wiring and dimming are planned with the design, never after it.",
    image: serviceCeiling,
  },
  {
    slug: "end-to-end-interiors",
    name: "End-to-End Interiors",
    tagline: "One team, one point of contact, from first sketch to final handover.",
    description:
      "Design, procurement, carpentry, electrical, painting and final styling, coordinated by one person you can call. We keep a written schedule, share site photographs as work progresses, and hand over a home that is clean, tested and ready to move into. No chasing five different vendors.",
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
