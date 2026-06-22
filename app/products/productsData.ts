export type ProductListingItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

export const PRODUCT_LISTING_ITEMS: ProductListingItem[] = [
  {
    id: "tractrac-plus",
    name: "TracTrac Plus",
    description:
      "TracTrac Plus is our flagship digital platform for delivering, tracking, and managing mechanisation services across Nigeria, connecting tractor owners, MSPs, and farmers.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361448/Frame_1000005376_2_cnqpda.jpg",
    href: "/products/tractrac-plus",
  },
  {
    id: "traxcelerate",
    name: "TRAxCelerate",
    description:
      "Our flagship capacity-building programme to train, certify, and deploy 2,000 mechanisation service providers, including operators, agents, and mechanics, across Nigeria.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361449/A5_-_3_zakm8e.jpg",
    href: "/traxcelerate-product-page",
  },
  {
    id: "tracinvest",
    name: "TRACINVEST",
    description:
      "A gateway for private and institutional investors into Nigeria's tractors-for-development revolution, combining financial return with measurable social impact.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361450/Frame_1000005376_3_b9pzji.png",
    href: "/products/tracinvest",
  },
  {
    id: "half-way",
    name: "H₂O: Half-Way to Ownership",
    description:
      "Young people and women are ready to join mechanisation, but finance is a barrier. Half-Way to Ownership opens shared pathways toward equipment and enterprise ownership.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361448/A5_-_4_nl2sxv.jpg",
    href: "/products/half-way-to-ownership",
  },
  {
    id: "rise7",
    name: "Rise7: Empowering Seven to Scale",
    description:
      "A cooperative-based asset financing model built on shared ownership, empowering groups of seven to access mechanisation and scale rural enterprise together.",
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760361449/A5_-_5_usti4u.jpg",
    href: "/products/rise7",
  },
];
