export type ServiceItem = {
  id: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  paragraphs: string[];
  bullets?: string[];
  bulletsIntro?: string;
  closingParagraphs?: string[];
};

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: "hire-tractor",
    title: "Hire a tractor",
    buttonText: "Hire a tractor",
    buttonLink: "/home/hire-tractor",
    paragraphs: [
      "TracTrac's Hire a Tractor service makes it easy for farmers of all sizes, farmer cooperatives, booking and hiring agents, and other stakeholders to access mechanization services for their farms and communities at competitive prices.",
      "With TracTrac, farmers can book and pay for mechanization services (tractors, power tillers, and more) on the web app or through TracTrac Plus. We have a constantly growing network of vetted tractor owners and operators across Nigeria, so farmers can find the right equipment for their needs and budget.",
    ],
    bulletsIntro: "Some benefits of using TracTrac's Hire a Tractor service include:",
    bullets: ["Convenience", "Affordability", "Flexibility", "Quality"],
    closingParagraphs: [
      "TracTrac's Hire a Tractor service is a convenient and affordable way for users to mechanize their farms or get tractor services for their communities. If you are a farmer, cooperative, booking and hiring agent, or other agricultural stakeholder in Nigeria looking for mechanization access, this is built for you.",
    ],
  },
  {
    id: "enlist-tractor",
    title: "Enlist your Tractor",
    buttonText: "Enlist your Tractor",
    buttonLink: "/home/enlist-tractor",
    paragraphs: [
      "By enlisting tractors on TracTrac, tractor owners earn extra income by renting out their tractors to other farmers and agricultural stakeholders. Create a profile for yourself and your tractors—including type, size, available implements, and location.",
      "After registration and verification, TracTrac matches tractors with potential renters based on their needs. Beyond additional income, tractor owners help build our vast network of equipment available for hire across Nigeria and Africa.",
    ],
  },
  {
    id: "booking-agent",
    title: "Become a Booking Agent",
    buttonText: "Become an Agent",
    buttonLink: "/home/agent",
    paragraphs: [
      "Join TracTrac's growing network of Booking and Hiring Agents responsible for connecting farmers, farmer cooperatives, and other stakeholders with bundled mechanization services.",
      "As a Booking and Hiring Agent, you independently aggregate demand for tractor and mechanization services—and TracTrac ensures you get the machinery and manpower (tractor operators and mechanics) you need to get the job done.",
    ],
  },
  {
    id: "invest-tractor",
    title: "Invest in Tractor",
    buttonText: "Invest in Tractors",
    buttonLink: "/home/invest-in-tractor",
    paragraphs: [
      "TracTrac's Invest in Tractors service is a unique and innovative way to help increase tractor density and agricultural productivity in Nigeria.",
      "We link you with various known brands, vendors, and Original Equipment Manufacturers (OEMs) so you can get tractors at competitive prices. After purchase, investors can onboard tractors on the TracTrac platform (with potential returns in 24 to 30 months) or use them privately on their own farms.",
    ],
  },
  {
    id: "register-vendor",
    title: "Register as Vendors",
    buttonText: "Register as Vendors",
    buttonLink: "/home/register-as-vendor",
    paragraphs: [
      "TracTrac is always looking for reliable tractor and spare parts vendors who work with us to provide genuine products to our network of Mechanization Service Providers (MSPs) and tractor owners.",
      "By registering as a vendor on TracTrac, you reach MSPs and tractor owners across Nigeria who need your products and services to operate and grow their businesses.",
    ],
  },
  {
    id: "operators-mechanics",
    title: "Enlist as Operators/Mechanics",
    buttonText: "Enlist as Operators/Mechanics",
    buttonLink: "/home/enlist-as-op-mech",
    paragraphs: [
      "As an Operator or Mechanic on TracTrac, you have the opportunity to get hired by Mechanization Service Providers and tractor owners across our network.",
    ],
  },
  {
    id: "measure-farm",
    title: "Measure your Farm",
    buttonText: "Measure your Farm",
    buttonLink: "/home",
    paragraphs: [
      "The Measure your Farm service helps farmers get accurate farm measurements. Using TracTrac's mobile or web app, farmers can create a map of their farm and measure the area of each field.",
      "With accurate measurements, farmers get the information they need to seamlessly hire tractors and make informed decisions. The service is accurate and easy to use.",
    ],
  },
  {
    id: "track-tractor",
    title: "Track your Tractors",
    buttonText: "Track a Tractor",
    buttonLink: "/home/track-tractor",
    paragraphs: [
      "TracTrac's Track your Tractor allows tractor owners and Mechanization Service Providers (MSPs) to track their tractors in real time—knowing exactly where equipment is at every point in time.",
      "Using the mobile or web app, tractor owners can see where their tractors are located and get insights into tractor usage.",
    ],
  },
];
