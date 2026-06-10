import type { ProductPageConfig, ProductProofStat, ProductSideStat } from "./productMarketing.types";

export const LISTING_HERO = {
  badge: "Our Products",
  kicker: "End-to-end mechanisation.",
  title: "Smarter systems for modern",
  titleHighlight: "mechanisation",
  lede: "TracTrac builds digital platforms, workforce programmes, and financing models that connect farmers, service providers, investors, and equipment owners across Nigeria.",
  image:
    "https://res.cloudinary.com/tractrac-global/image/upload/v1760200992/Frame_181_afv1x1.jpg",
  stats: [
    { v: "5", l: "Product lines", sub: "platform to ownership" },
    { v: "2,500+", l: "MSPs deployed", sub: "via TracTrac Plus" },
    { v: "160+", l: "Tractors facilitated", sub: "under ISSAM" },
    { v: "10,000+", l: "Hectares mapped", sub: "digitally tracked" },
  ],
  primaryCta: { label: "Explore products", href: "#catalog" },
  secondaryCta: { label: "Partner with us", href: "#cta" },
  ghostCta: { label: "Contact our team", href: "/contact" },
};

export const LISTING_OVERVIEW = {
  eyebrow: "Why it matters",
  title: "Mechanisation is Nigeria's",
  titleHighlight: "biggest untapped lever",
  paragraphs: [
    "Over 70 million hectares of arable land need reliable access to tractors, implements, and skilled operators — yet supply and coordination remain fragmented.",
    "TracTrac products work together: digital deployment on TracTrac Plus, workforce scale-up through TRAxCelerate, capital via TRACINVEST, and inclusive ownership through Rise7 and Half-Way to Ownership.",
  ],
  sideStats: [
    {
      big: "<0.3",
      variant: "orange" as const,
      small: "Tractor horsepower per hectare — far below FAO's 1.5 hp/ha recommendation",
    },
    {
      big: "₦500B+",
      variant: "dark" as const,
      small: "Invested in agricultural machinery with utilisation still below 40%",
    },
    {
      big: "One",
      variant: "orange" as const,
      small: "Integrated stack connecting booking, people, capital, and ownership",
    },
  ],
  image:
    "https://res.cloudinary.com/tractrac-global/image/upload/v1760203408/Frame_180_1_y2swcl.jpg",
};

export const LISTING_PROOF: ProductProofStat[] = [
  { v: "2,500+", l: "Service providers trained & deployed", icon: "users", color: "#FA9413" },
  { v: "160+", l: "Tractors & 280+ implements facilitated", icon: "build", color: "#16A34A" },
  { v: "10,000+", l: "Hectares digitally mapped & tracked", icon: "map", color: "#60A5FA" },
  { v: "5 yrs", l: "ISSAM / Mastercard Foundation mandate", icon: "award", color: "#FBBF24" },
];

export const LISTING_CTA = {
  badge: "Collaborative growth",
  title: "Let's build the future of",
  titleHighlight: "mechanisation together",
  lead: "Partner with governments, cooperatives, development agencies, and agribusinesses to expand access across Africa.",
  primary: { label: "Start a conversation", href: "#cta" },
  secondary: { label: "View careers", href: "/careers" },
  link: { label: "Contact us", href: "/contact" },
};

export type ListingPartnerCard = {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: ProductPageConfig["steps"]["items"][0]["i"];
};

export const LISTING_PARTNER_MODELS: ListingPartnerCard[] = [
  {
    tag: "Platform",
    tagColor: "#FA9413",
    title: "Governments & agencies",
    description:
      "Deploy TracTrac Plus and TRAxCelerate to scale mechanisation services with real-time monitoring and verified MSP networks.",
    cta: "Explore TracTrac Plus",
    href: "/products/tractrac-plus",
    icon: "flag",
  },
  {
    tag: "Capital",
    tagColor: "#3B82F6",
    title: "Investors & DFIs",
    description:
      "TRACINVEST channels private and institutional capital into tractor assets with transparent ROI and impact reporting.",
    cta: "Explore TRACINVEST",
    href: "/products/tracinvest",
    icon: "trend",
  },
  {
    tag: "Inclusion",
    tagColor: "#16A34A",
    title: "Cooperatives & communities",
    description:
      "Rise7 and Half-Way to Ownership open asset pathways for youth and women through shared responsibility models.",
    cta: "Explore Rise7",
    href: "/products/rise7",
    icon: "users",
  },
  {
    tag: "Workforce",
    tagColor: "#8B5CF6",
    title: "Training partners",
    description:
      "TRAxCelerate certifies mechanisation service providers at national scale — the human infrastructure behind every machine.",
    cta: "Explore TRAxCelerate",
    href: "/traxcelerate-product-page",
    icon: "cap",
  },
];
